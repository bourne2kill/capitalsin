## 2025-07-07 - Lazy Loading Heavy Libraries in Extension Popups

**Learning:** Loading large libraries (like `html2pdf.js` ~885KB) synchronously in an extension popup's `popup.html` significantly delays the `DOMContentLoaded` and `Load` events, impacting the "Time to Interactive" (TTI) every time the user opens the extension. In this codebase, deferring these scripts until user interaction (clicking 'Export PDF' or 'Export to Notion') reduced initial load times by ~96%.

**Action:** Always check for heavy libraries in `popup.html` and implement a dynamic script loader (`loadScript`) for any dependencies that are only used in response to specific user actions.

## 2025-07-21 - Avoiding Redundant Synchronous localStorage Access and JSON Parsing in popup.js

**Learning:** Invoking `localStorage.getItem` and parsing JSON synchronously on every single export button click (like HTML, MD, PDF, DOC) blocks the single-threaded UI execution context. Caching the parsed localStorage values inside a `customChatCache` and bypassing mapping/cloning altogether when default values are present results in significant performance speedups.

**Action:** Cache synchronous storage lookups, perform early exits for default/unchanged configurations, and avoid unnecessary object creations or mapping overhead whenever possible in Hot paths.
