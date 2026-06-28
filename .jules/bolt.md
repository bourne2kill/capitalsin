## 2025-06-28 - Lazy Loading Heavy Libraries in Popup
**Learning:** Large libraries like `html2pdf.bundle.min.js` (~885KB) in a Chrome extension popup significantly delay `DOMContentLoaded` and `Load` events, even if they aren't used immediately. In this case, it was causing a ~900ms delay.
**Action:** Always identify which libraries are "action-dependent" and lazy load them using a dynamic script injection pattern to keep the initial popup load time under 100ms.
