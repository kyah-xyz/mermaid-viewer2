graph TD;
    A[Start] --> B{Is it working?};
    B -- Yes --> C[Great!];
    C --> D[End];
    B -- No --> E[Fix it];
    E --> B;
