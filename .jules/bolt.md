## 2025-06-25 - Lazy loading heavy libraries in popup

**Learning:** Including large libraries like `html2pdf.bundle.min.js` (~885KB) in `popup.html` significantly delays `DOMContentLoaded` (from ~19ms to ~137ms in a benchmark environment). Chrome extension popups benefit greatly from lazy loading dependencies that are only used for specific actions.

**Action:** Always check the size of libraries included in extension popups and defer loading them until user interaction if they are not needed for initial UI rendering.
