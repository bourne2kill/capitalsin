## 2025-07-07 - Lazy Loading Heavy Libraries in Extension Popups

**Learning:** Loading large libraries (like `html2pdf.js` ~885KB) synchronously in an extension popup's `popup.html` significantly delays the `DOMContentLoaded` and `Load` events, impacting the "Time to Interactive" (TTI) every time the user opens the extension. In this codebase, deferring these scripts until user interaction (clicking 'Export PDF' or 'Export to Notion') reduced initial load times by ~96%.

**Action:** Always check for heavy libraries in `popup.html` and implement a dynamic script loader (`loadScript`) for any dependencies that are only used in response to specific user actions.

## 2025-07-08 - Avoiding Layout Thrashing in Content Scripts

**Learning:** Using `innerText` in content scripts for logic-only tasks (like sender detection or timestamp extraction) triggers layout/reflow calculations, which can be expensive on complex pages. `textContent` is significantly faster as it only retrieves the raw text from the DOM without considering styles or visibility.

**Action:** Use `textContent` instead of `innerText` for string matching and data extraction where layout awareness is not required.
