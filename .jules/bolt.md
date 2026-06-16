## 2025-06-16 - Lazy Loading Dependencies
**Learning:** Large libraries like `html2pdf.bundle.min.js` (~885KB) were being loaded on every popup open, even when not needed. Extension popups have limited lifespans and memory, so initial load time and memory footprint are critical for a snappy UX.
**Action:** Use a singleton promise pattern (`loadScript`) to lazily load heavy dependencies only when the user triggers the corresponding action.
