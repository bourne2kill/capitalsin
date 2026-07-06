## 2025-05-15 - Synchronous Loading of Heavy Libraries in Popups
**Learning:** In Chrome extensions, synchronous script tags in `popup.html` block the initial render. Large libraries like `html2pdf.bundle.min.js` (~888KB) can increase the popup's load time by hundreds of milliseconds, even if the feature isn't used.
**Action:** Always lazy load large dependencies (>100KB) or non-critical utilities in extension popups using a dynamic script injection pattern.
