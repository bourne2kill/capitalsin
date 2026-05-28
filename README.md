# Capital Sin

Private Chrome extension to export conversations from multiple AI platforms (ChatGPT, Grok, Gemini, DeepSeek, Qwen, and more) with deep customization and Gemini-powered AI tools. Supports Notion export, local downloads, attachments, screenshot, and advanced editing.

## Features

- **Export**: Conversations to Notion, Google Drive, or as HTML, Markdown, PDF, and DOC.
- **Customizations**: Rename participants, custom header/footer images, edit messages and timestamps.
- **AI Agent (Gemini)**: Summarize, analyze, or rewrite chat with Gemini API (optional, never on by default).
- **Attachments**: Add files (images, PDFs, Markdown) to transcript.
- **Screenshots**: Capture full page or area and include/attach.
- **Local first**: Nothing sent to APIs unless you opt in; all processing is local until export/upload.

**For private personal use only.**

---

## Setup

1. Clone/download this repo.
2. In Chrome, go to `chrome://extensions`, Developer Mode > Load Unpacked > Select this directory.
3. (Optional) For Notion export: paste your integration token (https://www.notion.so/my-integrations).
4. (Optional) For Gemini-powered analysis: paste your API key from Google AI Studio.

## Privacy

No analytics, telemetry, or data leakage. Only you control where your chats and data go. No external calls unless you use Notion or Gemini export.

---

## Usage

1. Go to [TogetherChat](https://chat.together.ai/).
2. Click the extension icon.
3. Set your preferences (names, header image, edits).
4. Export to Notion or local file.

---

## Features in Detail

### 1. Customize Participants
- Rename AI model/character
- Rename your user name
- Add custom profile/header images for each

### 2. Edit & Enhance
- Edit individual message content
- Modify timestamps
- Add custom header/footer images to export
- Attach files (images, PDFs, Markdown)

### 3. Export Options
- **Notion**: Direct integration with Notion API
- **Google Drive**: Save directly to your cloud storage
- **HTML**: Styled, preserves layout
- **Markdown**: Structured, code-friendly
- **PDF**: Print-ready format
- **DOC**: Microsoft Word compatible format

### 4. AI Agent (Gemini)
Optional AI-powered analysis:
- **Summarize**: Quick overview of conversation
- **Analyze**: Sentiment, key insights, trends
- **Rewrite**: Concise or alternative phrasing
- **Custom**: Your own prompt instructions

### 5. Screenshots
- Full page capture
- Save as PNG attachment

---

## Setup Instructions

### Prerequisites
- Google Chrome browser
- (Optional) Notion integration token: https://www.notion.so/my-integrations
- (Optional) Gemini API key: https://makersuite.google.com/

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishidhho/capitalsin.git
   cd capitalsin
   ```

2. **Load as Chrome Extension**
   - Open `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the `capitalsin` folder

3. **Configure (Optional)**
   - Click the Capital Sin icon in your Chrome toolbar
   - Add Notion token for Notion exports
   - Add Gemini API key for AI analysis

### First Run

1. Go to [TogetherChat](https://chat.together.ai/)
2. Have a conversation
3. Click the Capital Sin extension icon
4. Customize names/images if desired
5. Choose export format (HTML/Markdown/PDF) or export to Notion

---

## Configuration

### Notion Setup

1. Visit [Notion My Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the integration token
4. Paste in Capital Sin popup under "Notion Integration Token"
5. (Optional) Add Notion Database ID to export to specific database

### Gemini Setup

1. Visit [Google AI Studio](https://makersuite.google.com/)
2. Create an API key
3. Paste in Capital Sin popup under "Gemini API Key"
4. Choose model and task, then click "Run Gemini"

---

## Privacy & Security

- **No analytics**: No tracking, no telemetry
- **No data leakage**: All processing is local
- **API keys are not stored**: Only kept in memory during use
- **User control**: Data only sent to Notion/Gemini if you explicitly choose export/analysis
- **Open source**: You can audit all code

---

## File Structure

```
capitalsin/
├── README.md                    # This file
├── manifest.json               # Chrome extension manifest
├── background.js               # Background service worker
├── content.js                  # Content script for DOM extraction
├── popup.html                  # Extension popup UI
├── popup.js                    # Popup logic & handlers
├── style.css                   # Styling
├── notion_api.js              # Notion API integration
├── libs/
│   └── html2pdf.bundle.min.js # PDF export library
├── icons/
│   └── icon128.png            # Extension icon
└── LICENSE                     # MIT License
```

---

## Development & Customization

### Adding New Platforms

To support more chat platforms (e.g., ChatGPT, Gemini web):

1. Update `manifest.json` with new `host_permissions`
2. Add platform-specific selectors in `content.js`
3. Update `popup.html` with platform selector (optional)

### Modifying DOM Selectors

If TogetherChat changes their DOM, update selectors in `content.js`:

```js
const chatBubbles = document.querySelectorAll('.your-new-selector');
```

### Adding More Gemini Tasks

Extend `popup.html` with new options and add logic in `popup.js`.

---

## Troubleshooting

### Extension not showing?
- Reload Chrome
- Check `chrome://extensions/` for errors
- Ensure extension is enabled

### Chat not extracting?
- Open DevTools (F12) on TogetherChat
- Inspect chat bubble elements
- Update selectors in `content.js` to match current DOM

### Notion export failing?
- Verify integration token is correct
- Check database ID format (32 chars or UUID)
- Ensure integration has permission to access database

### Gemini not responding?
- Verify API key is valid
- Check rate limits (free tier may have restrictions)
- Try a simpler prompt

---

## License

MIT License - See LICENSE file for details.

---

## Notes

- This extension is **for private personal use only**
- Not intended for public or marketplace distribution
- You are responsible for your own API keys and credentials
- Respect TogetherChat's terms of service when using this extension

---

## Support & Feedback

For issues or improvements, check the code and feel free to modify for your needs.

---

**Last updated**: Fri, 29 May 2026
