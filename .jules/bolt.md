## 2024-05-24 - Lazy loading heavy libraries in Extension Popups
**Learning:** Chrome extension popups are performance-sensitive as they re-initialize on every open. Synchronously loading heavy libraries like `html2pdf.bundle.min.js` (~888KB) can more than triple the DOMContentLoaded time (from ~50ms to ~175ms).
**Action:** Use a singleton promise-based `loadScript` utility to defer loading of feature-specific libraries until the user actually interacts with those features.
