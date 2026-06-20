## 2025-06-20 - Lazy loading large libraries in extension popups
**Learning:** Heavy dependencies like `html2pdf.bundle.min.js` (~885KB) in a Chrome extension popup significantly impact the initial load time. In this codebase, it accounted for most of the ~850ms DOMContentLoaded time.
**Action:** Use a singleton promise pattern to lazily load niche or heavy scripts only when the user triggers the specific functionality that requires them. This reduced the initial load time to ~25ms.
