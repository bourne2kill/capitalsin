## 2024-06-29 - Lazy-loading heavy libraries in Chrome extension popup

**Learning:** Loading large libraries (like html2pdf.js, ~885KB) in a Chrome extension popup significantly delays the DOMContentLoaded and Load events, making the UI feel sluggish upon opening. Since these libraries are only used for specific actions, they don't need to be part of the initial payload.

**Action:** Use a dynamic script loader (singleton promise pattern) to load heavy dependencies only when the user triggers the associated functionality. This reduced initial load time from ~250ms+ to ~30ms in a mocked environment.
