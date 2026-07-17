// benchmark_bolt.js
// Mocking browser environment to load popup.js
const mockElement = () => ({
  set oninput(fn) {},
  set onchange(fn) {},
  set onclick(fn) {},
  style: {}
});

global.document = {
  getElementById: mockElement
};

global.localStorage = {
  _store: {},
  getItem(key) { return this._store[key] || null; },
  setItem(key, val) { this._store[key] = val; }
};

global.chrome = {
  downloads: {},
  tabs: {}
};

// Now import/eval popup.js with some variable scope replacements for Node.js benchmarking
const fs = require('fs');
let popupCode = fs.readFileSync('popup.js', 'utf8');

// Replace local scoping with global scoping for variables accessed/manipulated by benchmark
popupCode = popupCode.replace('let aiName = "AI", userName = "You";', 'global.aiName = "AI"; global.userName = "You";');
popupCode = popupCode.replace('let customChatCache = null;', 'global.customChatCache = null;');

// We can run the code in global context
eval(popupCode);

// Let's create a test chat of 1000 messages
const msgTypes = ["AI", "You"];
const testChat = Array.from({ length: 1000 }, (_, i) => ({
  sender: msgTypes[i % 2],
  messageHTML: `<p>Message content ${i}</p>`,
  messageMD: `Message content ${i}`,
  timestamp: i % 10 === 0 ? `10:${String(i%60).padStart(2, '0')} AM` : ''
}));

console.log("=== ⚡ BOLT PERFORMANCE BENCHMARK ===");
console.log(`Test chat contains ${testChat.length} messages.`);

// ----------------- Original approach simulation -----------------
function originalApplyEdits(chat) {
  try {
    const cc = JSON.parse(localStorage.getItem("customChat")||"[]");
    if(cc && cc.length) {
      return cc;
    }
  } catch(e) {}

  return chat.map(msg => Object.assign({}, msg, {
    sender: msg.sender === "AI" ? global.aiName : global.userName
  }));
}

// ----------------- Test 1: Default Names (aiName = "AI", userName = "You") -----------------
console.log("\n--- Scenario 1: Default Names (no custom names, no customChat in localStorage) ---");

// Benchmark original
const startOrig1 = process.hrtime.bigint();
let resOrig1;
for (let i = 0; i < 500; i++) {
  resOrig1 = originalApplyEdits(testChat);
}
const endOrig1 = process.hrtime.bigint();
const timeOrig1 = Number(endOrig1 - startOrig1) / 1e6; // ms

// Benchmark optimized
const startOpt1 = process.hrtime.bigint();
let resOpt1;
for (let i = 0; i < 500; i++) {
  resOpt1 = applyEdits(testChat);
}
const endOpt1 = process.hrtime.bigint();
const timeOpt1 = Number(endOpt1 - startOpt1) / 1e6; // ms

console.log(`Original applyEdits average time: ${(timeOrig1 / 500).toFixed(4)} ms`);
console.log(`Optimized applyEdits average time: ${(timeOpt1 / 500).toFixed(4)} ms`);
console.log(`Speedup factor: ${(timeOrig1 / timeOpt1).toFixed(1)}x`);
console.log(`Are returned objects reference-identical in optimized? ${resOpt1 === testChat ? 'YES (O(1) early-return win!)' : 'NO'}`);
console.log(`Are returned objects reference-identical in original? ${resOrig1 === testChat ? 'YES' : 'NO (O(N) unnecessary copying and GC pressure)'}`);

// ----------------- Test 2: Fully Customized Names -----------------
console.log("\n--- Scenario 2: Fully Customized Names (aiName = 'Assistant', userName = 'User') ---");
global.aiName = "Assistant";
global.userName = "User";

// Benchmark original
const startOrig2 = process.hrtime.bigint();
let resOrig2;
for (let i = 0; i < 500; i++) {
  resOrig2 = originalApplyEdits(testChat);
}
const endOrig2 = process.hrtime.bigint();
const timeOrig2 = Number(endOrig2 - startOrig2) / 1e6; // ms

// Benchmark optimized
const startOpt2 = process.hrtime.bigint();
let resOpt2;
for (let i = 0; i < 500; i++) {
  resOpt2 = applyEdits(testChat);
}
const endOpt2 = process.hrtime.bigint();
const timeOpt2 = Number(endOpt2 - startOpt2) / 1e6; // ms

console.log(`Original applyEdits average time: ${(timeOrig2 / 500).toFixed(4)} ms`);
console.log(`Optimized applyEdits average time: ${(timeOpt2 / 500).toFixed(4)} ms`);
console.log(`Speedup factor: ${(timeOrig2 / timeOpt2).toFixed(1)}x`);

// Check allocations / object identity
let allocationSavedCount2 = 0;
resOpt2.forEach((msg, i) => {
  if (msg === testChat[i]) {
    allocationSavedCount2++;
  }
});
console.log(`Allocations saved: ${allocationSavedCount2} / ${testChat.length} (by reusing identical objects)`);

// ----------------- Test 3: Partially Customized Names -----------------
console.log("\n--- Scenario 3: Partially Customized Names (aiName = 'Assistant', userName = 'You' [default]) ---");
global.aiName = "Assistant";
global.userName = "You";

// Benchmark original
const startOrig3 = process.hrtime.bigint();
let resOrig3;
for (let i = 0; i < 500; i++) {
  resOrig3 = originalApplyEdits(testChat);
}
const endOrig3 = process.hrtime.bigint();
const timeOrig3 = Number(endOrig3 - startOrig3) / 1e6; // ms

// Benchmark optimized
const startOpt3 = process.hrtime.bigint();
let resOpt3;
for (let i = 0; i < 500; i++) {
  resOpt3 = applyEdits(testChat);
}
const endOpt3 = process.hrtime.bigint();
const timeOpt3 = Number(endOpt3 - startOpt3) / 1e6; // ms

console.log(`Original applyEdits average time: ${(timeOrig3 / 500).toFixed(4)} ms`);
console.log(`Optimized applyEdits average time: ${(timeOpt3 / 500).toFixed(4)} ms`);
console.log(`Speedup factor: ${(timeOrig3 / timeOpt3).toFixed(1)}x`);

// Check allocations / object identity
let allocationSavedCount3 = 0;
resOpt3.forEach((msg, i) => {
  if (msg === testChat[i]) {
    allocationSavedCount3++;
  }
});
console.log(`Allocations saved: ${allocationSavedCount3} / ${testChat.length} (by reusing identical objects)`);

// ----------------- Test 4: Custom Chat Cached from LocalStorage -----------------
console.log("\n--- Scenario 4: Custom Chat exists in localStorage (multiple access) ---");
localStorage.setItem("customChat", JSON.stringify(testChat));
global.customChatCache = null; // reset cache

// Benchmark original
const startOrig4 = process.hrtime.bigint();
for (let i = 0; i < 500; i++) {
  originalApplyEdits(testChat);
}
const endOrig4 = process.hrtime.bigint();
const timeOrig4 = Number(endOrig4 - startOrig4) / 1e6; // ms

// Benchmark optimized
const startOpt4 = process.hrtime.bigint();
for (let i = 0; i < 500; i++) {
  applyEdits(testChat);
}
const endOpt4 = process.hrtime.bigint();
const timeOpt4 = Number(endOpt4 - startOpt4) / 1e6; // ms

console.log(`Original applyEdits (with JSON parsing) average time: ${(timeOrig4 / 500).toFixed(4)} ms`);
console.log(`Optimized applyEdits (with Cache) average time: ${(timeOpt4 / 500).toFixed(4)} ms`);
console.log(`Speedup factor: ${(timeOrig4 / timeOpt4).toFixed(1)}x`);
