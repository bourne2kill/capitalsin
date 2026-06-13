## 2026-06-13 - [Lazy Loading Dependencies in Extension Popups]
**Learning:** Browser extension popups benefit greatly from minimizing the initial JS bundle size. Loading a ~900KB library like html2pdf synchronously blocks the main thread and increases startup latency. Implementing a singleton promise-based loadScript utility allows for safe, on-demand loading of these heavy assets.
**Action:** Identify feature-specific heavy dependencies and move them to a lazy-loading pattern to keep the initial UI snappy.
