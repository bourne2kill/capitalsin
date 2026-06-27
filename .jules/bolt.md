# Bolt's Performance Journal

## 2025-06-27 - Lazy loading heavy libraries
**Learning:** The extension popup loads `html2pdf.bundle.min.js` (885KB) and `notion_api.js` synchronously on every open, even if the user doesn't use PDF or Notion export. This significantly delays DOMContentLoaded and Load events.
**Action:** Implemented lazy loading for these libraries using a `loadScript` helper.
**Impact:** Reduced initial DOMContentLoaded and Load times from ~891ms to ~88ms (~90% improvement) in a simulated environment.
