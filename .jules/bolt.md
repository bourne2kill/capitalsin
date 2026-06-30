## 2025-06-30 - Lazy Loading heavy libraries in Extension Popup
**Learning:** In Chrome extension popups, loading large libraries (like html2pdf.bundle.min.js, ~885KB) synchronously blocks the main thread and significantly delays DOMContentLoaded/Load events. Since popups are often opened briefly, this creates a noticeable lag.
**Action:** Always identify non-essential heavy dependencies in popup environments and implement a lazy-loading pattern (singleton promise) to defer their load until the specific feature is triggered by the user.
