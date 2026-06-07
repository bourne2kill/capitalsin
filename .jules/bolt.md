## 2026-06-07 - [Optimization] Lazy load heavy export libraries

**Learning:** Loading heavy libraries (~900KB) like `html2pdf.bundle.min.js` in a Chrome extension popup significantly impacts initial load time and memory usage. Since these are only needed for specific actions (PDF and Notion export), they can be lazy-loaded.

**Action:** Implement a lazy-loading pattern in `popup.js` using a singleton promise to fetch and inject scripts only when requested. Remove static script tags from `popup.html`.
