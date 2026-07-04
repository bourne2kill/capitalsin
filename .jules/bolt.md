## 2025-05-15 - Lazy loading heavy libraries in Chrome extension popup
**Learning:** Heavy dependencies like `html2pdf.bundle.min.js` (~885KB) significantly delay the `DOMContentLoaded` event in Chrome extension popups, even when stored locally. Moving them to lazy loading on-demand reduced `DOMContentLoaded` from ~200ms to ~15ms.
**Action:** Always check the size of libraries included in `popup.html` and consider lazy loading for features that are not used immediately upon opening the popup.
