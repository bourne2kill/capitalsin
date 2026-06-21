## 2025-06-21 - Lazy loading heavy libraries in extension popup
**Learning:** Initializing a Chrome extension popup with large libraries like `html2pdf.bundle.min.js` (885KB) significantly delays `DOMContentLoaded` (from ~105ms to ~980ms), impacting the perceived speed of the extension.
**Action:** Always lazy load heavy dependencies in the popup that are only needed for specific user actions (like exports) using a dynamic script loader and a Promise-based cache.
