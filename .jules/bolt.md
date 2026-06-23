## 2024-06-23 - Lazy loading heavy libraries in extension popup
**Learning:** Including heavy libraries (like html2pdf.bundle.min.js at ~885KB) in the initial popup script tags causes significant DOMContentLoaded delay (200ms+), even if they aren't used in the primary workflow.
**Action:** Use a singleton promise pattern to dynamically load heavy or secondary dependencies only when the user triggers the specific action that requires them.
