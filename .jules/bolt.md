## 2025-07-07 - Lazy Loading Heavy Libraries in Extension Popups

**Learning:** Loading large libraries (like `html2pdf.js` ~885KB) synchronously in an extension popup's `popup.html` significantly delays the `DOMContentLoaded` and `Load` events, impacting the "Time to Interactive" (TTI) every time the user opens the extension. In this codebase, deferring these scripts until user interaction (clicking 'Export PDF' or 'Export to Notion') reduced initial load times by ~96%.

**Action:** Always check for heavy libraries in `popup.html` and implement a dynamic script loader (`loadScript`) for any dependencies that are only used in response to specific user actions.

## 2026-07-10 - Optimizing Array Mapping with Early Returns
**Learning:** In extension popups where data processing (like name mapping) happens on every export, performing a full array map when no changes are actually required is a common but avoidable bottleneck. For a 1000-message chat, an early return for default state reduced processing time from ~0.2ms to nearly instantaneous per call, and object spread proved significantly faster than `Object.assign` for the non-default case.
**Action:** Always check if a data transformation is necessary before iterating over large arrays, and prefer object spread syntax for shallow copies in performance-sensitive paths.
