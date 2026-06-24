## 2024-06-24 - Optimized Initial Popup Load via Lazy Loading

**Learning:** Heavy dependencies like `html2pdf.bundle.min.js` (885KB) significantly delay `DOMContentLoaded` in Chrome extension popups, even when the functionality they provide is not used immediately.

**Action:** Implement a `loadScript` utility to lazily load heavy scripts only when the user triggers the associated features (e.g., PDF export, Notion integration).
