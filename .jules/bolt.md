## 2025-07-03 - Lazy Loading Heavy Libraries in Popup

**Learning:** Synchronously loading large libraries (e.g., html2pdf.bundle.min.js at ~885KB) in a Chrome extension popup significantly delays DOMContentLoaded and the initial render. In this case, it was causing a delay of ~67ms (from ~79ms down to ~12ms).

**Action:** Always check for heavy dependencies in `popup.html` and implement lazy loading using a dynamic script injection pattern for features that are not required for the initial UI render.
