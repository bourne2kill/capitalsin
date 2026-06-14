## 2025-06-14 - Lazy Loading Heavy Dependencies in Popups
**Learning:** Synchronously loading heavy libraries (e.g., html2pdf.js ~885KB) in a Chrome extension popup significantly delays the initial "Time to Interactive" and increases memory usage, even for users who don't use those features.
**Action:** Implement a lazy-loading pattern using a singleton promise for heavy or non-essential dependencies to ensure the UI remains snappy and responsive.
