import React, { useState, useEffect, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

declare global {
    interface Window {
        mermaid: any;
    }
}

const charts = [
    'flowchart.md',
    'sequence.md',
    'gantt.md',
    'invalid-syntax.md'
];

// --- Components ---

interface ChartSelectorProps {
    chartList: string[];
    selectedChart: string | null;
    onSelectChart: (chartName: string) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ chartList, selectedChart, onSelectChart }) => {
    return (
        <aside className="sidebar">
            <h2>Charts</h2>
            <nav>
                <ul>
                    {chartList.map((chart) => (
                        <li key={chart}>
                            <button
                                onClick={() => onSelectChart(chart)}
                                className={selectedChart === chart ? 'selected' : ''}
                                aria-pressed={selectedChart === chart}
                            >
                                {chart}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

interface ViewerProps {
    content: string | null;
    isLoading: boolean;
    error: string | null;
}

const Viewer: React.FC<ViewerProps> = ({ content, isLoading, error }) => {
    const mermaidContainerId = 'mermaid-preview';
    const [renderError, setRenderError] = useState<boolean>(false);

    useEffect(() => {
        const container = document.getElementById(mermaidContainerId);
        if (!container) return;

        if (!content || error) {
            container.innerHTML = '';
            return;
        }
        
        setRenderError(false);
        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
        });

        const renderMermaid = async () => {
            try {
                // Use a unique ID for each render to avoid conflicts
                const renderId = `mermaid-render-${Date.now()}`;
                const { svg } = await window.mermaid.render(renderId, content);
                if (document.getElementById(mermaidContainerId)) {
                    container.innerHTML = svg;
                }
            } catch (e) {
                console.error("Mermaid rendering error:", e);
                setRenderError(true);
            }
        };

        renderMermaid();

    }, [content, error]);

    const renderPreviewContent = () => {
        if (isLoading) return <div className="loading-message">Loading...</div>;
        if (error) return null; // Main error is shown above the viewer
        if (!content) return <div className="empty-message">Select a chart to view</div>;
        if (renderError) return <div className="empty-message">Could not render chart. Invalid syntax.</div>;
        return <div id={mermaidContainerId} className="preview-panel-content"></div>;
    };


    return (
        <div className="viewer-container">
            <section className="panel code-panel" aria-labelledby="code-heading">
                <h3 id="code-heading">Code</h3>
                <pre><code>{isLoading ? 'Loading...' : content || 'Select a chart...'}</code></pre>
            </section>
            <section className="panel preview-panel" aria-labelledby="preview-heading">
                <h3 id="preview-heading">Preview</h3>
                {renderPreviewContent()}
            </section>
        </div>
    );
};


// --- Main App ---

const App: React.FC = () => {
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
    const [chartContent, setChartContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedChart) return;

        const fetchChart = async () => {
            setIsLoading(true);
            setError(null);
            setChartContent(null);
            try {
                const response = await fetch(`/charts/${selectedChart}`);
                if (!response.ok) {
                    throw new Error(`Chart file not found: ${selectedChart}`);
                }
                const text = await response.text();
                setChartContent(text);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChart();
    }, [selectedChart]);


    const handleSelectChart = (chartName: string) => {
        setSelectedChart(chartName);
    };

    return (
        <div className="app-container">
            <ChartSelector chartList={charts} selectedChart={selectedChart} onSelectChart={handleSelectChart} />
            <main className="main-content">
                {error && <div className="error-message" role="alert"><strong>Error:</strong> {error}</div>}
                <Viewer content={chartContent} isLoading={isLoading} error={error} />
            </main>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
