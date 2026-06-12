## 2025-05-14 - Lazy Loading Heavy Dependencies in Extension Popups
**Learning:** In standard Manifest V3 extensions, every script listed in popup.html is fetched and parsed before the popup becomes responsive. Large libraries like html2pdf.bundle.min.js (~885KB) can dominate the load time. Implementing a lazy-loading pattern with a singleton promise significantly reduces the initial payload (~90% reduction) and improves time-to-interactive.
**Action:** Use the `loadScript` utility for heavy or feature-specific dependencies that aren't required for the initial popup render.
