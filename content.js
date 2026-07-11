// DirtyCHAT - Content Script
// Extracts conversations from multiple AI platforms

function extractChat() {
  const host = window.location.hostname;
  if (host.includes('together.ai')) return extractTogetherChat();
  if (host.includes('chatgpt.com')) return extractChatGPT();
  if (host.includes('grok.com')) return extractGrok();
  if (host.includes('gemini.google.com')) return extractGemini();
  if (host.includes('aistudio.google.com')) return extractAIStudio();
  if (host.includes('deepseek.com')) return extractDeepSeek();
  if (host.includes('qwen')) return extractQwen();
  if (host.includes('z.ai')) return extractZAI();
  if (host.includes('hailuoai.com')) return extractMiniMax();
  if (host.includes('mimo.mi.com') || host.includes('xiaomimimo')) return extractXiaomiMimo();
  
  // Generic fallback
  return extractGeneric();
}

function extractTogetherChat() {
  const chatBubbles = document.querySelectorAll('.chat-message');
  const chat = [];
  chatBubbles.forEach(msg => {
    const isUser = msg.classList.contains('user-message');
    const sender = isUser ? 'You' : 'AI';
    const messageHTML = msg.querySelector('.message-text')?.innerHTML || msg.innerHTML;
    const messageMD = msg.querySelector('.message-text')?.innerText || msg.innerText;
    // Performance: Use textContent for timestamp to avoid layout thrashing
    const timestamp = msg.querySelector('.timestamp')?.textContent || '';
    chat.push({ sender, messageHTML, messageMD, timestamp });
  });
  return chat;
}

function extractChatGPT() {
  const turns = document.querySelectorAll('[data-testid^="conversation-turn-"]');
  const chat = [];
  turns.forEach(turn => {
    // Performance: Use textContent for sender detection to avoid layout thrashing
    const isUser = turn.querySelector('img[alt="User"]') || turn.textContent.includes('You');
    const sender = isUser ? 'You' : 'AI';
    const contentEl = turn.querySelector('.markdown') || turn.querySelector('.prose') || turn;
    chat.push({
      sender,
      messageHTML: contentEl.innerHTML,
      messageMD: contentEl.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractGrok() {
  const containers = document.querySelectorAll('div[data-testid="message-container"]');
  const chat = [];
  containers.forEach(msg => {
    // Performance: Use textContent for sender detection to avoid layout thrashing
    const sender = msg.textContent.toLowerCase().includes('grok') ? 'AI' : 'You';
    const content = msg.querySelector('div[dir="auto"]') || msg;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractGemini() {
  const messages = document.querySelectorAll('message-content');
  const chat = [];
  messages.forEach(msg => {
    const isUser = msg.closest('.query-text');
    const sender = isUser ? 'You' : 'AI';
    chat.push({
      sender,
      messageHTML: msg.innerHTML,
      messageMD: msg.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractAIStudio() {
  const entries = document.querySelectorAll('.chat-entry');
  const chat = [];
  entries.forEach(entry => {
    const sender = entry.classList.contains('user') ? 'You' : 'AI';
    const content = entry.querySelector('.message-content') || entry;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractDeepSeek() {
  const items = document.querySelectorAll('.ds-message-item');
  const chat = [];
  items.forEach(item => {
    // Performance: Use textContent for sender detection to avoid layout thrashing
    const isUser = item.querySelector('.ds-icon--user') || item.textContent.includes('You');
    const sender = isUser ? 'You' : 'AI';
    const content = item.querySelector('.ds-markdown') || item;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractQwen() {
  const items = document.querySelectorAll('.message-item');
  const chat = [];
  items.forEach(item => {
    const sender = item.classList.contains('user') ? 'You' : 'AI';
    const content = item.querySelector('.content-wrapper') || item;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractZAI() {
  const bubbles = document.querySelectorAll('.message-bubble');
  const chat = [];
  bubbles.forEach(bubble => {
    const sender = bubble.classList.contains('user') ? 'You' : 'AI';
    chat.push({
      sender,
      messageHTML: bubble.innerHTML,
      messageMD: bubble.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractMiniMax() {
  const bubbles = document.querySelectorAll('.message-bubble');
  const chat = [];
  bubbles.forEach(bubble => {
    const sender = bubble.classList.contains('user') ? 'You' : 'AI';
    const content = bubble.querySelector('.chat-content') || bubble;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractXiaomiMimo() {
  const msgs = document.querySelectorAll('.chat-message');
  const chat = [];
  msgs.forEach(msg => {
    const sender = msg.classList.contains('user') ? 'You' : 'AI';
    const content = msg.querySelector('.message-content') || msg;
    chat.push({
      sender,
      messageHTML: content.innerHTML,
      messageMD: content.innerText,
      timestamp: ''
    });
  });
  return chat;
}

function extractGeneric() {
  // Very basic fallback: look for common markdown/prose classes
  const possibleMessages = document.querySelectorAll('.markdown, .prose, .message-content, .chat-bubble');
  const chat = [];
  possibleMessages.forEach((msg, index) => {
    chat.push({
      sender: index % 2 === 0 ? 'User' : 'AI',
      messageHTML: msg.innerHTML,
      messageMD: msg.innerText,
      timestamp: ''
    });
  });
  return chat;
}

// Listen for popup's request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_chat") {
    sendResponse({ chat: extractChat() });
  }
  return true;
});
