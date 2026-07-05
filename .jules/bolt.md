## 2025-07-05 - Heavy Library Lazy Loading in Popup

**Learning:** Loading a heavy library (e.g., html2pdf.bundle.min.js, ~885KB) synchronously in a Chrome extension popup significantly delays `DOMContentLoaded`. This is because the browser must download and parse the script before the popup becomes interactive.

**Action:** Always check for heavy scripts (>100KB) in the popup's HTML. Move them to lazy loading via a dynamic `<script>` injection pattern triggered only by the specific user action that needs them. This keeps the popup snappy for common actions.
