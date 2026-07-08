## 2025-07-07 - Lazy Loading Heavy Libraries in Extension Popups

**Learning:** Loading large libraries (like `html2pdf.js` ~885KB) synchronously in an extension popup's `popup.html` significantly delays the `DOMContentLoaded` and `Load` events, impacting the "Time to Interactive" (TTI) every time the user opens the extension. In this codebase, deferring these scripts until user interaction (clicking 'Export PDF' or 'Export to Notion') reduced initial load times by ~96%.

**Action:** Always check for heavy libraries in `popup.html` and implement a dynamic script loader (`loadScript`) for any dependencies that are only used in response to specific user actions.

## 2025-07-08 - String Concatenation vs Array.join

**Learning:** In the current V8 environment (Node.js 22), iterative string concatenation using `+=` significantly outperformed `Array.join('')` for building large HTML strings (e.g., chat exports). Benchmarks showed `Array.join('')` was ~220% slower for a 5000-message chat. This is likely due to modern V8 optimizations like "ConsStrings" which handle concatenation very efficiently.

**Action:** Prefer `+=` for building large strings in this codebase unless profiling shows it as a bottleneck. Avoid blindly applying the `Array.join` "optimization".
