# 🐛 Demo Code for Hackathon Presentation

**Copy and paste this code into the code input panel to generate 6-7 different bug creatures!**

```javascript
// ============================================
// HACKATHON DEMO CODE - Generates Multiple Bugs
// ============================================

// 1. 🔴 Ring Cicada - Infinite Loop
function processItems(items) {
    while (true) {
        for (let i = 0; i < items.length; i++) {
            console.log(items[i]);
        }
        // Missing break - infinite loop!
    }
}

// 2. 🟡 Offset Ant - Off-by-one Error
function getArrayElements(arr) {
    const result = [];
    for (let i = 0; i <= arr.length; i++) {
        result.push(arr[i]);
    }
    return result;
}

// 3. 💧 Glow Moth - Memory Leak
function readUserData() {
    const file = fs.open('data.txt', 'r');
    const stream = new FileStream('output.txt');
    const data = file.readAll();
    return data;
    // Missing: file.close() and stream.close()
}

// 4. ⚡ Flash Mantis - Race Condition
let sharedCounter = 0;
function increment() {
    sharedCounter++;
    return sharedCounter;
}
function decrement() {
    sharedCounter--;
}

// 5. ⛔ Void Beetle - Generic Catch
try {
    const user = getUserById(null);
    const profile = user.profile.name;
} catch (e) {
    // Generic catch - no error handling!
}

// 6. 🍝 Tangled Worm - Deep Nesting
function complexCalculation(data) {
    if (data) {
        if (data.items) {
            if (data.items.length > 0) {
                for (let i = 0; i < data.items.length; i++) {
                    if (data.items[i].value) {
                        if (data.items[i].value > 10) {
                            if (data.items[i].value < 100) {
                                return data.items[i].value * 2;
                            }
                        }
                    }
                }
            }
        }
    }
}

// 7. 📣 Blink Firefly - Log Spam
function debugProcess() {
    console.log("Starting process");
    console.log("Step 1");
    console.log("Step 2");
    console.log("Step 3");
    console.log("Step 4");
    console.log("Step 5");
    console.log("Step 6");
    console.log("Step 7");
    console.log("Process complete");
}

// 8. {} Rune Spider - Syntax Error
function brokenFunction() {
    const obj = {
        name: "test",
        items: [1, 2, 3
    // Missing closing brackets!
}
```

## Expected Bugs Generated:

1. **Ring Cicada** (∞ Infinite Loop) - from `while(true)`
2. **Offset Ant** (➕1 Off-by-one) - from `i <= arr.length`
3. **Glow Moth** (💧 Memory Leak) - from `.open()` without `.close()`
4. **Flash Mantis** (⚡ Race Condition) - from `++` without locks
5. **Void Beetle** (⛔ Null Pointer) - from generic `catch`
6. **Tangled Worm** (🍝 Spaghetti Code) - from deep nesting
7. **Blink Firefly** (📣 Log Spam) - from multiple `console.log`
8. **Rune Spider** ({} Syntax Error) - from unclosed brackets

## How to Use:

1. Copy the entire code block above
2. Paste it into the code input panel in the app
3. Click "Analyze Code" or press Enter
4. Watch as 6-7 bug creatures appear in the Digital Terrarium!
5. Start the simulation to see them multiply and interact

