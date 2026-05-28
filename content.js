// Capital Sin - Content Script
// Extracts TogetherChat conversations from DOM

function extractTogetherChat() {
  // Adjust selectors as TogetherChat DOM changes
  // Open DevTools on TogetherChat and inspect message bubbles to get correct selectors
  const chatBubbles = document.querySelectorAll('.chat-message');
  const chat = [];
  
  chatBubbles.forEach(msg => {
    const isUser = msg.classList.contains('user-message');
    const sender = isUser ? 'You' : 'AI';
    
    // Adjust these selectors based on actual TogetherChat DOM
    const messageHTML = msg.querySelector('.message-text')?.innerHTML || msg.innerHTML;
    const messageMD = msg.querySelector('.message-text')?.innerText || msg.innerText;
    const timestamp = msg.querySelector('.timestamp')?.innerText || '';
    
    chat.push({
      sender,
      messageHTML,
      messageMD,
      timestamp
    });
  });
  
  return chat;
}

// Listen for popup's request to extract chat
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_chat") {
    sendResponse({chat: extractTogetherChat()});
  }
  return true; // Required for async response
});
