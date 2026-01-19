# Mermaid Chart Documentation Tool

## 1. Objective

The goal of this project is to create a simple web-based viewer that can store and render Mermaid diagrams from `.md` (Markdown) files. This tool will act as a documentation site or a gallery for a collection of pre-written Mermaid charts.

## 2. Core Features

-   **File-based Structure:** The application will be designed to read from a collection of `.md` files stored within the project.
-   **Chart Selector:** A navigation panel or dropdown will allow users to select which Mermaid chart to view.
-   **Code Viewer:** A read-only panel will display the raw Mermaid syntax from the selected `.md` file for reference.
-   **Chart Preview:** A dedicated panel will render the visual diagram from the selected file's content.
-   **Clean & Minimalist UI:** The user interface will be intuitive and focused on providing a clear view of both the syntax and the rendered chart.

## 3. Technology Stack

-   **Frontend:** React with TypeScript (`.tsx`) for a modern, component-based architecture.
-   **Diagramming Library:** [Mermaid.js](https://github.com/mermaid-js/mermaid) will be used for parsing the syntax and rendering the SVG charts.
-   **Styling:** CSS for a clean and professional look and feel.

## 4. Implementation Plan

1.  **Project Setup:**
    -   Create a dedicated directory (e.g., `/charts`) within the project to store all the `.md` files.
    -   Set up the `index.html` file to serve as the application's entry point and include the Mermaid.js library.
    -   Initialize the main React application in `index.tsx`.

2.  **Component Structure:**
    -   **`App` component (main):**
        -   Will manage the state of the currently selected chart file.
        -   Will handle the logic for fetching and loading the content of the selected `.md` file.
    -   **`ChartSelector` component:**
        -   Will display a list of all available `.md` files from the `/charts` directory.
        -   Will allow the user to click on a file to select it for viewing.
    -   **`Viewer` component:**
        -   A composite component that will contain two panels:
            1.  **Code Panel:** A read-only `<pre>`/`<code>` block to show the Mermaid syntax.
            2.  **Preview Panel:** The area where the rendered Mermaid SVG chart will be displayed.

3.  **Data Flow:**
    -   The `App` component will start by identifying the list of available `.md` files (this can be a hardcoded list initially for simplicity).
    -   The list will be passed to the `ChartSelector` component to render the navigation.
    -   When a user selects a chart, the `App` component will fetch the text content of the corresponding `.md` file.
    -   This content will be passed as a prop to the `Viewer` component.
    -   Inside the `Viewer`, a `useEffect` hook will be triggered by the new content. This hook will use the Mermaid.js API (`mermaid.render()`) to generate the SVG and display it in the preview panel, while also showing the raw text in the code panel.

4.  **Styling and UX:**
    -   The layout will be a two-column design: a narrow navigation sidebar on the left (`ChartSelector`) and a main content area on the right (`Viewer`).
    -   The `Viewer` itself will have a responsive two-panel layout (code and preview).
    -   Error handling will be added to display a user-friendly message if a `.md` file contains invalid syntax.

## 5. Next Steps

With this revised plan, the next step is to implement the basic file structure and the core React components to load and display a sample `.md` file.
