# Bolt's Journal
## 2026-06-22 - Lazy loading heavy dependencies in Chrome extension popup
**Learning:** Loading large libraries (e.g., html2pdf.js ~885KB) and multiple API scripts in a Chrome extension popup significantly delays DOMContentLoaded and Load events, impacting perceived performance.
**Action:** Use a dynamic script loader with a promise-based cache to defer loading heavy dependencies until they are actually needed by user actions.
