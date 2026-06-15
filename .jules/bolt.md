# Bolt's Performance Journal

## 2025-06-15 - Lazy Loading Heavy Dependencies
**Learning:** Initial load of the extension popup included ~885KB of libraries (html2pdf) that are only used for specific export actions. Moving these to a lazy-loading pattern reduces initial payload by over 90%.
**Action:** Always check if third-party libraries can be loaded on-demand, especially in resource-constrained environments like extension popups.
