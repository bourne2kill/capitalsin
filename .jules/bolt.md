## 2025-06-06 - [Lazy Loading Dependencies in Extension Popups]
**Learning:** Chrome extension popups have a very limited lifecycle and should open as fast as possible. Loading large libraries like 'html2pdf.bundle.min.js' (885KB) synchronously on every popup open significantly increases scripting and parsing time, even if the feature is never used.
**Action:** Always lazy load heavy dependencies in popups using a dynamic script injection pattern with a singleton promise to ensure they are only loaded once and only when needed.
