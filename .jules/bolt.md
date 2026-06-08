## 2025-05-15 - Lazy-loading heavy dependencies in extension popups
**Learning:** Eagerly loading large libraries like `html2pdf.bundle.min.js` (~885KB) in an extension's popup script significantly increases startup time and memory footprint, even when the feature isn't used.
**Action:** Implement a `loadScript` utility with a singleton promise cache to inject scripts only when a specific feature is triggered.

## 2025-05-15 - Efficient string building in JavaScript
**Learning:** Repeated string concatenation using `+=` in loops can have O(n²) performance implications in some engines for very large strings. Using `Array.map().join('')` is generally more efficient and readable for building large HTML/Markdown blocks from lists.
**Action:** Refactor export builders to use `.map().join('')`.
