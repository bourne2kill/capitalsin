// benchmark.js
// Profiles original applyEdits function vs various states

// Mock localStorage
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, val) {
    this.store[key] = String(val);
  },
  clear() {
    this.store = {};
  }
};

global.localStorage = mockLocalStorage;

// Original applyEdits function
function originalApplyEdits(chat, aiName, userName) {
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

// Optimized applyEdits function
let customChatCache = null;
function optimizedApplyEdits(chat, aiName, userName) {
  try {
    if (customChatCache === null) {
      const stored = localStorage.getItem("customChat");
      customChatCache = stored ? JSON.parse(stored) : [];
    }
    if (customChatCache && customChatCache.length) {
      return customChatCache;
    }
  } catch(e) {}

  // Early return if default configurations (no custom names set)
  if (aiName === "AI" && userName === "You") {
    return chat;
  }

  return chat.map(msg => {
    const targetSender = msg.sender === "AI" ? aiName : userName;
    if (msg.sender === targetSender) {
      return msg; // Avoid object allocation
    }
    return Object.assign({}, msg, { sender: targetSender });
  });
}

// Generate dummy chat data (1000 messages)
const generateChat = (size) => {
  const list = [];
  for (let i = 0; i < size; i++) {
    list.push({
      sender: i % 2 === 0 ? "AI" : "You",
      messageHTML: `Hello world ${i}`,
      messageMD: `Hello world ${i}`,
      timestamp: new Date().toISOString()
    });
  }
  return list;
};

const chatData = generateChat(1000);

console.log("--- RUNNING BENCHMARK ---");

// Test Case 1: Default Names (AI / You), No custom chat edit
console.log("\n[Test Case 1] Default configs (no custom names, no edits):");
localStorage.clear();
customChatCache = null;

let start = performance.now();
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(chatData, "AI", "You");
}
let end = performance.now();
const originalDefaultTime = end - start;
console.log(`Original applyEdits: ${originalDefaultTime.toFixed(4)} ms`);

start = performance.now();
for (let i = 0; i < 1000; i++) {
  optimizedApplyEdits(chatData, "AI", "You");
}
end = performance.now();
const optimizedDefaultTime = end - start;
console.log(`Optimized applyEdits: ${optimizedDefaultTime.toFixed(4)} ms`);
console.log(`Speedup: ${(originalDefaultTime / (optimizedDefaultTime || 0.0001)).toFixed(2)}x`);

// Test Case 2: Custom Names (Siri / Bob), No custom chat edit
console.log("\n[Test Case 2] Custom participant names, no edits:");
localStorage.clear();
customChatCache = null;

start = performance.now();
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(chatData, "Siri", "Bob");
}
end = performance.now();
const originalCustomNameTime = end - start;
console.log(`Original applyEdits: ${originalCustomNameTime.toFixed(4)} ms`);

start = performance.now();
for (let i = 0; i < 1000; i++) {
  optimizedApplyEdits(chatData, "Siri", "Bob");
}
end = performance.now();
const optimizedCustomNameTime = end - start;
console.log(`Optimized applyEdits: ${optimizedCustomNameTime.toFixed(4)} ms`);
console.log(`Speedup: ${(originalCustomNameTime / (optimizedCustomNameTime || 0.0001)).toFixed(2)}x`);

// Test Case 3: Custom Chat Edits in localStorage
console.log("\n[Test Case 3] Custom chat edits in localStorage:");
localStorage.setItem("customChat", JSON.stringify(chatData));
customChatCache = null;

start = performance.now();
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(chatData, "AI", "You");
}
end = performance.now();
const originalEditsTime = end - start;
console.log(`Original applyEdits: ${originalEditsTime.toFixed(4)} ms`);

start = performance.now();
for (let i = 0; i < 1000; i++) {
  optimizedApplyEdits(chatData, "AI", "You");
}
end = performance.now();
const optimizedEditsTime = end - start;
console.log(`Optimized applyEdits: ${optimizedEditsTime.toFixed(4)} ms`);
console.log(`Speedup: ${(originalEditsTime / (optimizedEditsTime || 0.0001)).toFixed(2)}x`);
