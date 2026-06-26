## 2025-06-26 - Lazy loading heavy dependencies in popup

**Learning:** Loading large libraries like `html2pdf.bundle.min.js` (~885KB) and `notion_api.js` in the Chrome extension popup significantly delays the `DOMContentLoaded` and `Load` events, even if those features aren't used.

**Action:** Always lazy load heavy dependencies in the popup using a script-loading utility and only trigger it when the user interacts with the specific feature.
