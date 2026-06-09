## 2025-06-09 - Lazy-loading heavy libraries in browser extension popups
**Learning:** Browser extension popups benefit significantly from reduced initial load weight since they are loaded frequently and are sensitive to perceived latency. The `html2pdf.js` library is relatively heavy (~885KB) and only used for one specific export feature.
**Action:** Always consider lazy-loading large dependencies that are not critical for the initial UI render. Use a singleton promise pattern for script injection to avoid duplicate loading and race conditions.
