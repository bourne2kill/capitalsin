// DirtyCHAT - Popup Logic

let chat = [];
let aiName = "AI", userName = "You";
let aiImg, userImg, headerImg, footerImg;
let attachments = [];

// Utility: Lazy load heavy scripts
const scriptCache = {};
function loadScript(src) {
  if (scriptCache[src]) return scriptCache[src];
  scriptCache[src] = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptCache[src];
}

// Utility: Convert file to Data URL
function fileToDataURL(file, fn) {
  const reader = new FileReader();
  reader.onload = e => fn(e.target.result);
  reader.readAsDataURL(file);
}

// Fetch chat from content script
function fetchChat(cb) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (!tabs[0]) return setStatus("Error: No active tab found.");
    chrome.tabs.sendMessage(tabs[0].id, {action: "extract_chat"}, response => {
      if (response && response.chat) {
        chat = response.chat;
        cb(chat);
      } else {
        setStatus("Error: Could not extract chat. Make sure you're on a supported AI platform.");
      }
    });
  });
}

// Input handlers
document.getElementById('ai-name').oninput = e => aiName = e.target.value;
document.getElementById('user-name').oninput = e => userName = e.target.value;
document.getElementById('ai-img').onchange = e => fileToDataURL(e.target.files[0], val => aiImg = val);
document.getElementById('user-img').onchange = e => fileToDataURL(e.target.files[0], val => userImg = val);
document.getElementById('header-img').onchange = e => fileToDataURL(e.target.files[0], val => headerImg = val);
document.getElementById('footer-img').onchange = e => fileToDataURL(e.target.files[0], val => footerImg = val);

// Attachment handler
document.getElementById('attach-file').onchange = e => {
  Array.from(e.target.files).forEach(f =>
    fileToDataURL(f, url => attachments.push({name: f.name, url}))
  );
  setStatus(`Attached ${e.target.files.length} file(s)`);
};

// Build HTML export
function buildHTML(chat, opts={}) {
  let html = `<html><head><meta charset="UTF-8"><title>DirtyCHAT Export</title>
    <style>
    body{font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;}
    .chat-container{max-width:800px;margin:auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
    .msg-You{background:#bdf3fa;margin:12px 0;padding:12px;border-radius:8px;text-align:right;}
    .msg-AI{background:#ecebfd;margin:12px 0;padding:12px;border-radius:8px;}
    .sender{font-weight:bold;margin-bottom:4px;}
    .timestamp{font-size:0.8em;color:#999;margin-top:4px;}
    .attachments{margin-top:20px;padding-top:20px;border-top:1px solid #ccc;}
    </style></head><body>`;

  if (opts.headerImg) html += `<img src="${opts.headerImg}" style="width:100%;max-height:120px;border-radius:8px;margin-bottom:20px;">`;
  
  html += `<div class="chat-container">`;
  
  chat.forEach(m => {
    html += `<div class="msg-${m.sender === userName ? 'You' : 'AI'}">
      <div class="sender">${m.sender}</div>
      <div class="text">${m.messageHTML}</div>
      ${m.timestamp ? `<div class="timestamp">${m.timestamp}</div>` : ""}
    </div>`;
  });

  if (attachments.length)
    html += `<div class="attachments"><strong>Attachments:</strong><ul>${attachments.map(a=>`<li><a href="${a.url}" download="${a.name}">${a.name}</a></li>`).join("")}</ul></div>`;
  
  html += `</div>`;
  
  if (opts.footerImg) html += `<img src="${opts.footerImg}" style="width:100%;max-height:120px;border-radius:8px;margin-top:20px;">`;
  
  html += `</body></html>`;
  return html;
}

// Build Markdown export
function buildMarkdown(chat) {
  let md = `# DirtyCHAT Export\n\n`;
  md += `**Exported:** ${new Date().toLocaleString()}\n\n`;
  
  chat.forEach((m) => {
    md += `**${m.sender}:**\n${m.messageMD}\n${m.timestamp ? `_(${m.timestamp})_` : ""} \n\n`;
  });
  
  if (attachments.length)
    md += `\n## Attachments\n${attachments.map(a=>`- [${a.name}](${a.url})`).join("\n")}\n`;
  
  return md;
}

// Download utility
function downloadFile(name, type, data) {
  const blob = new Blob([data], {type});
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: name });
}

// Export handlers
document.getElementById('export-html').onclick = () =>
  fetchChat(c => {
    const c_edited = applyEdits(c);
    const html = buildHTML(c_edited, {headerImg, footerImg});
    downloadFile('dirtychat-' + Date.now() + '.html', 'text/html', html);
    setStatus('✓ HTML exported');
  });

document.getElementById('export-md').onclick = () =>
  fetchChat(c => {
    const c_edited = applyEdits(c);
    const md = buildMarkdown(c_edited);
    downloadFile('dirtychat-' + Date.now() + '.md', 'text/markdown', md);
    setStatus('✓ Markdown exported');
  });

document.getElementById('export-pdf').onclick = async () => {
  await loadScript('libs/html2pdf.bundle.min.js');
  fetchChat(c => {
    const c_edited = applyEdits(c);
    const html = buildHTML(c_edited, {headerImg, footerImg});
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    html2pdf().from(iframe.contentDocument.body).save('dirtychat-' + Date.now() + '.pdf');
    setTimeout(()=>document.body.removeChild(iframe),2000);
    setStatus('✓ PDF export triggered');
  });
};

document.getElementById('export-doc').onclick = () =>
  fetchChat(c => {
    const c_edited = applyEdits(c);
    const html = buildHTML(c_edited, {headerImg, footerImg});
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Export DOC</title></head>
      <body>${html}</body></html>`;
    downloadFile('dirtychat-' + Date.now() + '.doc', 'application/msword', docContent);
    setStatus('✓ DOC exported');
  });

// Screenshot full page
document.getElementById('screenshot-full').onclick = () => {
  chrome.tabs.captureVisibleTab(null, {format: "png"}, dataUrl => {
    if (dataUrl) {
      downloadFile("screenshot-" + Date.now() + ".png", "image/png", atob(dataUrl.split(',')[1]));
      setStatus('✓ Screenshot saved');
    } else {
      setStatus('Error: Could not capture screenshot');
    }
  });
};

// Edit messages (JSON editor)
document.getElementById('edit-messages').onclick = () =>
  fetchChat(chat => {
    const edits = prompt("Edit chat as JSON (advanced):\n[{sender, messageMD, timestamp}]", JSON.stringify(chat,null,2));
    if (edits) {
      try {
        JSON.parse(edits); // Validate JSON
        localStorage.setItem("customChat", edits);
        setStatus('✓ Messages saved for edit');
      } catch(e) {
        setStatus('✗ Invalid JSON');
      }
    }
  });

// Apply edits and custom names
function applyEdits(chat) {
  try {
    const cc = JSON.parse(localStorage.getItem("customChat")||"[]");
    if(cc && cc.length) {
      return cc;
    }
  } catch(e) {}
  
  return chat.map(msg => Object.assign({}, msg, {
    sender: msg.sender === "AI" ? aiName : userName
  }));
}

// Notion integration
document.getElementById('to-notion').onclick = async () => {
  await loadScript('notion_api.js');
  fetchChat(c => {
    setStatus("Exporting to Notion...");
    const token = document.getElementById('notion-token').value.trim();
    const db = document.getElementById('notion-db').value.trim();
    if (!token) {
      setStatus("✗ Please enter Notion integration token");
      return;
    }
    sendToNotion(token, db, buildMarkdown(applyEdits(c)), (ok,msg) => 
      setStatus(ok?"✓ Exported to Notion":("✗ "+(msg||"Error")))
    );
  });
};

// Google Drive Placeholder
document.getElementById('to-gdrive').onclick = () => {
  setStatus("Google Drive export requires OAuth. Redirecting...");
  // In a real extension, this would trigger the identity API or a server-side OAuth flow
  // For now, we'll simulate a redirect or provide instructions
  const url = "https://accounts.google.com/o/oauth2/v2/auth";
  setStatus("✓ Google Drive integration pending (OAuth required)");
};

// Gemini AI Agent
document.getElementById('gemini-task').onchange = e => {
  document.getElementById('gemini-custom').style.display =
    e.target.value === 'custom' ? 'inline-block' : 'none';
};

document.getElementById('gemini-run').onclick = async () => {
  const apiKey = document.getElementById('gemini-api-key').value.trim();
  const model = document.getElementById('gemini-model').value;
  const task = document.getElementById('gemini-task').value;
  const customPrompt = document.getElementById('gemini-custom').value;
  
  document.getElementById('gemini-result').textContent = 'Gemini: working...';
  
  if (!apiKey) {
    document.getElementById('gemini-result').textContent = 'Error: Please enter Gemini API Key';
    return;
  }
  
  fetchChat(async (chat) => {
    let instruction = '';
    if (task === 'summarize') instruction = 'Summarize this AI/user conversation transcript in a few paragraphs. Be concise.';
    else if (task === 'analyze') instruction = 'Analyze the sentiment, key trends, questions, and topics in this dialogue. Provide insights.';
    else if (task === 'rewrite') instruction = 'Rewrite this conversation, making it clear, concise, and easy to understand.';
    else instruction = customPrompt || 'Interpret this conversation as you see fit.';

    const chatText = applyEdits(chat).map(m => `${m.sender}: ${m.messageMD}`).join('\n');
    const prompt = `${instruction}\n\n${chatText}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          contents: [{
            parts: [{text: prompt}]
          }]
        })
      });
      const result = await res.json();
      
      let output = '';
      if (result.candidates?.[0]?.content?.parts?.[0]?.text)
        output = result.candidates[0].content.parts[0].text;
      else if (result.promptFeedback?.blockReason)
        output = 'Blocked: ' + result.promptFeedback.blockReason;
      else if (result.error?.message)
        output = 'Error: ' + result.error.message;
      else
        output = JSON.stringify(result, null, 2);

      document.getElementById('gemini-result').textContent = output;
    } catch (e) {
      document.getElementById('gemini-result').textContent = "Gemini error: " + e.message;
    }
  });
};

// Status message utility
function setStatus(msg) {
  document.getElementById('status').textContent = msg;
}
