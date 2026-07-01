# Bolt Performance Journal

## 2025-07-01 - Deferred Library Loading in Extension Popup
**Learning:** Loading heavy libraries (800KB+) synchronously in a Chrome extension popup blocking `DOMContentLoaded` significantly degrades perceived performance. In a mocked environment, moving these to on-demand lazy loading improved load time by ~85% (from 175ms to 25ms).
**Action:** Always identify scripts that are only needed for specific user interactions (like exports or API calls) and load them lazily using a `loadScript` utility.
