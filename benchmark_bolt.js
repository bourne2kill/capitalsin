// Benchmark script for popup.js applyEdits optimizations

const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  clear() {
    this.store = {};
  }
};

// Original implementation
function originalApplyEdits(chat, aiName, userName, localStorageMock) {
  try {
    const cc = JSON.parse(localStorageMock.getItem("customChat") || "[]");
    if(cc && cc.length) {
      return cc;
    }
  } catch(e) {}

  return chat.map(msg => Object.assign({}, msg, {
    sender: msg.sender === "AI" ? aiName : userName
  }));
}

// Optimized implementation
let customChatCache = null;
function optimizedApplyEdits(chat, aiName, userName, localStorageMock) {
  try {
    if (customChatCache === null) {
      const stored = localStorageMock.getItem("customChat");
      if (stored) {
        customChatCache = JSON.parse(stored);
      } else {
        customChatCache = [];
      }
    }
    if (customChatCache && customChatCache.length) {
      return customChatCache;
    }
  } catch(e) {}

  // Early return if names are default: no mapping or copying needed!
  if (aiName === "AI" && userName === "You") {
    return chat;
  }

  return chat.map(msg => {
    const targetSender = msg.sender === "AI" ? aiName : userName;
    if (msg.sender === targetSender) {
      return msg; // Avoid object allocation and copying if unchanged
    }
    return Object.assign({}, msg, { sender: targetSender });
  });
}

function runBenchmark() {
  const numMessages = 1000;
  const chat = [];
  for (let i = 0; i < numMessages; i++) {
    chat.push({
      sender: i % 2 === 0 ? "AI" : "You",
      messageHTML: `<p>Message content ${i} is extremely long and interesting and has multiple paragraphs. Let's make it look realistic.</p>`,
      messageMD: `Message content ${i} is extremely long and interesting and has multiple paragraphs. Let's make it look realistic.`,
      timestamp: "10:00 AM"
    });
  }

  console.log(`Running benchmark with ${numMessages} messages...\n`);

  // Scenario 1: Default Names (no customChat)
  console.log("--- Scenario 1: Default Names & No customChat ---");
  let t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    originalApplyEdits(chat, "AI", "You", mockLocalStorage);
  }
  let t1 = performance.now();
  const origTimeS1 = t1 - t0;
  console.log(`Original:  ${origTimeS1.toFixed(3)} ms`);

  t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    optimizedApplyEdits(chat, "AI", "You", mockLocalStorage);
  }
  t1 = performance.now();
  const optTimeS1 = t1 - t0;
  console.log(`Optimized: ${optTimeS1.toFixed(3)} ms`);
  console.log(`Speedup:   ${(origTimeS1 / optTimeS1).toFixed(1)}x\n`);


  // Scenario 2: Custom Names (no customChat)
  console.log("--- Scenario 2: Custom Names & No customChat ---");
  t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    originalApplyEdits(chat, "Jarvis", "Tony", mockLocalStorage);
  }
  t1 = performance.now();
  const origTimeS2 = t1 - t0;
  console.log(`Original:  ${origTimeS2.toFixed(3)} ms`);

  t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    optimizedApplyEdits(chat, "Jarvis", "Tony", mockLocalStorage);
  }
  t1 = performance.now();
  const optTimeS2 = t1 - t0;
  console.log(`Optimized: ${optTimeS2.toFixed(3)} ms`);
  console.log(`Speedup:   ${(origTimeS2 / optTimeS2).toFixed(1)}x\n`);


  // Scenario 3: with customChat in localStorage (cached vs parsed each time)
  console.log("--- Scenario 3: customChat loaded from localStorage ---");
  const customChatData = JSON.stringify(chat.slice(0, 100));
  mockLocalStorage.setItem("customChat", customChatData);
  customChatCache = null; // reset cache

  t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    originalApplyEdits(chat, "AI", "You", mockLocalStorage);
  }
  t1 = performance.now();
  const origTimeS3 = t1 - t0;
  console.log(`Original:  ${origTimeS3.toFixed(3)} ms`);

  t0 = performance.now();
  for (let i = 0; i < 1000; i++) {
    optimizedApplyEdits(chat, "AI", "You", mockLocalStorage);
  }
  t1 = performance.now();
  const optTimeS3 = t1 - t0;
  console.log(`Optimized: ${optTimeS3.toFixed(3)} ms`);
  console.log(`Speedup:   ${(origTimeS3 / optTimeS3).toFixed(1)}x\n`);
}

runBenchmark();
