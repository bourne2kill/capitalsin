## 2024-06-19 - Lazy load heavy dependencies
**Learning:** Heavy libraries like `html2pdf.bundle.min.js` (~885KB) significantly delay the initial load and increase memory footprint of extension popups. Implementing a lazy loading pattern with a singleton promise ensures these assets are only fetched when needed.
**Action:** Always check for large dependencies that are only used in specific, non-critical paths and implement lazy loading to keep the "hot path" lean.
