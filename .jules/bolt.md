## 2025-07-07 - Lazy Loading Heavy Libraries in Extension Popups

**Learning:** Loading large libraries (like `html2pdf.js` ~885KB) synchronously in an extension popup's `popup.html` significantly delays the `DOMContentLoaded` and `Load` events, impacting the "Time to Interactive" (TTI) every time the user opens the extension. In this codebase, deferring these scripts until user interaction (clicking 'Export PDF' or 'Export to Notion') reduced initial load times by ~96%.

**Action:** Always check for heavy libraries in `popup.html` and implement a dynamic script loader (`loadScript`) for any dependencies that are only used in response to specific user actions.

## 2025-07-08 - Selective use of innerText vs textContent

**Learning:** In chat extraction scripts, `innerText` is often used for both logic checks (sender detection) and content extraction. While `innerText` preserves line breaks (important for chat content), it triggers expensive reflows. Replacing it with `textContent` for non-content strings (logic markers, timestamps) improves extraction speed without losing formatting where it matters.

**Action:** Use `textContent` for logic checks and metadata; reserve `innerText` only for user-facing content where formatting (like newlines) must be preserved.
