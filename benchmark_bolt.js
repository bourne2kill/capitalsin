// benchmark_bolt.js
const fs = require('fs');

// Mock DOM & Chrome API for Node environment
const inputs = {};
global.window = {};
global.document = {
  getElementById: (id) => {
    if (!inputs[id]) {
      inputs[id] = {
        oninput: null,
        onchange: null,
        onclick: null,
        value: id === 'ai-name' ? 'AI' : id === 'user-name' ? 'You' : '',
        style: { display: '' },
        textContent: ''
      };
    }
    return inputs[id];
  }
};
global.FileReader = class {};
global.Blob = class {};
global.URL = {
  createObjectURL: () => ''
};
global.chrome = {
  tabs: {
    query: () => {},
    sendMessage: () => {}
  },
  downloads: {
    download: () => {}
  }
};

// Simple Mock for localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const key in store) delete store[key]; }
};

// Evaluate popup.js in the global scope
const popupCode = fs.readFileSync('popup.js', 'utf8');
eval(popupCode);

// Generate mock chat history (1000 messages)
const mockChat = [];
for (let i = 0; i < 1000; i++) {
  mockChat.push({
    sender: i % 2 === 0 ? 'AI' : 'You',
    messageHTML: `This is message number ${i}`,
    messageMD: `This is message number ${i}`,
    timestamp: '12:00 PM'
  });
}

console.log('--- Benchmarking Original/New applyEdits ---');

// Warm up
for (let i = 0; i < 100; i++) {
  applyEdits(mockChat);
}

// Helper to reset cache (like restarting/opening popup again)
function resetState() {
  customChatCache = null;
}

// 1. Scenario: Default Config (no edits, default names "AI" and "You")
console.log('\nScenario 1: Default Config (1000 messages, 1000 iterations)');
resetState();
let start = performance.now();
for (let i = 0; i < 1000; i++) {
  applyEdits(mockChat);
}
let end = performance.now();
const timeDefault = end - start;
console.log(`Time taken: ${timeDefault.toFixed(2)} ms`);

// 2. Scenario: Custom Names (no edits, custom names)
// Trigger input event to set names inside popup.js closure
resetState();
inputs['ai-name'].oninput({ target: { value: 'CustomAI' } });
inputs['user-name'].oninput({ target: { value: 'CustomUser' } });

console.log('\nScenario 2: Custom Names (1000 messages, 1000 iterations)');
start = performance.now();
for (let i = 0; i < 1000; i++) {
  applyEdits(mockChat);
}
end = performance.now();
const timeCustomNames = end - start;
console.log(`Time taken: ${timeCustomNames.toFixed(2)} ms`);

// 3. Scenario: Custom Edits (edits in localStorage, 1000 iterations)
resetState();
const customEdits = JSON.stringify(mockChat.map(m => Object.assign({}, m, { sender: 'CustomSender' })));
localStorage.setItem('customChat', customEdits);
console.log('\nScenario 3: Custom Edits parsed from localStorage (1000 messages, 1000 iterations)');
start = performance.now();
for (let i = 0; i < 1000; i++) {
  applyEdits(mockChat);
}
end = performance.now();
const timeCustomEdits = end - start;
console.log(`Time taken: ${timeCustomEdits.toFixed(2)} ms`);
