// Performance benchmark script for applyEdits
const fs = require('fs');

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; }
};

// Original implementation
function originalApplyEdits(chat, aiName, userName) {
  try {
    const cc = JSON.parse(localStorage.getItem("customChat") || "[]");
    if (cc && cc.length) {
      return cc;
    }
  } catch (e) {}

  return chat.map(msg => Object.assign({}, msg, {
    sender: msg.sender === "AI" ? aiName : userName
  }));
}

// Optimized implementation
let customChatCache = null;
function optimizedApplyEdits(chat, aiName, userName) {
  if (customChatCache === null) {
    try {
      const stored = localStorage.getItem("customChat");
      customChatCache = stored ? JSON.parse(stored) : [];
    } catch (e) {
      customChatCache = [];
    }
  }

  if (customChatCache && customChatCache.length) {
    return customChatCache;
  }

  if (aiName === "AI" && userName === "You") {
    return chat;
  }

  return chat.map(msg => {
    const expectedSender = msg.sender === "AI" ? aiName : userName;
    if (msg.sender === expectedSender) {
      return msg;
    }
    return Object.assign({}, msg, { sender: expectedSender });
  });
}

// Generate large dummy chat (1000 messages)
const dummyChat = [];
for (let i = 0; i < 1000; i++) {
  dummyChat.push({
    sender: i % 2 === 0 ? "AI" : "You",
    messageHTML: `<p>Message ${i}</p>`,
    messageMD: `Message ${i}`,
    timestamp: "12:00 PM"
  });
}

console.log("Running benchmarks...");

// Scenario 1: Default names, no custom chat
console.log("\n--- Scenario 1: Default names ('AI' and 'You'), no custom chat ---");
let start, end;

// Warmup
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(dummyChat, "AI", "You");
  optimizedApplyEdits(dummyChat, "AI", "You");
}

start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  originalApplyEdits(dummyChat, "AI", "You");
}
end = process.hrtime.bigint();
const originalTimeS1 = Number(end - start) / 1000000;
console.log(`Original: ${originalTimeS1.toFixed(3)} ms`);

// Reset cache
customChatCache = null;
start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  optimizedApplyEdits(dummyChat, "AI", "You");
}
end = process.hrtime.bigint();
const optimizedTimeS1 = Number(end - start) / 1000000;
console.log(`Optimized: ${optimizedTimeS1.toFixed(3)} ms`);
console.log(`Speedup: ${(originalTimeS1 / optimizedTimeS1).toFixed(2)}x`);

// Scenario 2: Custom names, no custom chat
console.log("\n--- Scenario 2: Custom names, no custom chat ---");

// Warmup
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(dummyChat, "Assistant", "User");
  optimizedApplyEdits(dummyChat, "Assistant", "User");
}

start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  originalApplyEdits(dummyChat, "Assistant", "User");
}
end = process.hrtime.bigint();
const originalTimeS2 = Number(end - start) / 1000000;
console.log(`Original: ${originalTimeS2.toFixed(3)} ms`);

// Reset cache
customChatCache = null;
start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  optimizedApplyEdits(dummyChat, "Assistant", "User");
}
end = process.hrtime.bigint();
const optimizedTimeS2 = Number(end - start) / 1000000;
console.log(`Optimized: ${optimizedTimeS2.toFixed(3)} ms`);
console.log(`Speedup: ${(originalTimeS2 / optimizedTimeS2).toFixed(2)}x`);

// Scenario 3: Custom chat in localStorage (100 messages)
console.log("\n--- Scenario 3: Custom chat in localStorage ---");
const customChatData = [];
for (let i = 0; i < 100; i++) {
  customChatData.push({
    sender: i % 2 === 0 ? "Bot" : "Human",
    messageHTML: `<p>Custom ${i}</p>`,
    messageMD: `Custom ${i}`,
    timestamp: "12:05 PM"
  });
}
localStorage.setItem("customChat", JSON.stringify(customChatData));

// Warmup
for (let i = 0; i < 1000; i++) {
  originalApplyEdits(dummyChat, "AI", "You");
  optimizedApplyEdits(dummyChat, "AI", "You");
}

start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  originalApplyEdits(dummyChat, "AI", "You");
}
end = process.hrtime.bigint();
const originalTimeS3 = Number(end - start) / 1000000;
console.log(`Original: ${originalTimeS3.toFixed(3)} ms`);

// Reset cache
customChatCache = null;
start = process.hrtime.bigint();
for (let i = 0; i < 5000; i++) {
  optimizedApplyEdits(dummyChat, "AI", "You");
}
end = process.hrtime.bigint();
const optimizedTimeS3 = Number(end - start) / 1000000;
console.log(`Optimized: ${optimizedTimeS3.toFixed(3)} ms`);
console.log(`Speedup: ${(originalTimeS3 / optimizedTimeS3).toFixed(2)}x`);
