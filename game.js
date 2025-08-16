// Game state
let gameState = {
    laughs: 0,
    laughsPerSecond: 0,
    jokesTold: 0,
    upgrades: {
        'joke-writer': { count: 0, cost: 10, baseCost: 10, multiplier: 1.15, production: 0.1 },
        'comedy-club': { count: 0, cost: 50, baseCost: 50, multiplier: 1.15, production: 1 },
        'tv-show': { count: 0, cost: 500, baseCost: 500, multiplier: 1.15, production: 10 }
    },
    lastSave: Date.now()
};

// DOM elements
const laughsElement = document.getElementById('laughs');
const lpsElement = document.getElementById('lps');
const jokesToldElement = document.getElementById('jokes-told');
const lastSaveElement = document.getElementById('last-save');

// Initialize game
function initGame() {
    loadGame();
    updateDisplay();
    setInterval(gameLoop, 1000);
    setInterval(autoSave, 30000); // Auto-save every 30 seconds
}

// Main game loop
function gameLoop() {
    // Calculate passive income
    let totalProduction = 0;
    for (let upgradeId in gameState.upgrades) {
        const upgrade = gameState.upgrades[upgradeId];
        totalProduction += upgrade.count * upgrade.production;
    }
    
    gameState.laughsPerSecond = totalProduction;
    gameState.laughs += totalProduction;
    
    updateDisplay();
}

// Update display
function updateDisplay() {
    laughsElement.textContent = formatNumber(gameState.laughs);
    lpsElement.textContent = formatNumber(gameState.laughsPerSecond);
    jokesToldElement.textContent = formatNumber(gameState.jokesTold);
    
    // Update last save time
    if (gameState.lastSave) {
        const lastSaveDate = new Date(gameState.lastSave);
        const now = new Date();
        const diffMs = now - lastSaveDate;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) {
            lastSaveElement.textContent = 'Just now';
        } else if (diffMins < 60) {
            lastSaveElement.textContent = `${diffMins} minutes ago`;
        } else {
            const diffHours = Math.floor(diffMins / 60);
            lastSaveElement.textContent = `${diffHours} hours ago`;
        }
    }
    
    // Update upgrade displays
    for (let upgradeId in gameState.upgrades) {
        const upgrade = gameState.upgrades[upgradeId];
        const countElement = document.getElementById(`${upgradeId}-count`);
        const costElement = document.getElementById(`${upgradeId}-cost`);
        const totalElement = document.getElementById(`${upgradeId}-total`);
        
        if (countElement) countElement.textContent = upgrade.count;
        if (costElement) costElement.textContent = formatNumber(upgrade.cost);
        if (totalElement) totalElement.textContent = formatNumber(upgrade.count * upgrade.production);
        
        // Update button states
        const button = document.querySelector(`#${upgradeId} .upgrade-btn`);
        if (button) {
            button.disabled = gameState.laughs < upgrade.cost;
        }
    }
}

// Buy upgrade
function buyUpgrade(upgradeId) {
    const upgrade = gameState.upgrades[upgradeId];
    
    if (gameState.laughs >= upgrade.cost) {
        gameState.laughs -= upgrade.cost;
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.multiplier, upgrade.count));
        
        updateDisplay();
        saveGame();
        
        // Visual feedback
        const upgradeElement = document.getElementById(upgradeId);
        upgradeElement.style.borderColor = '#0f0';
        setTimeout(() => {
            upgradeElement.style.borderColor = '#333';
        }, 200);
    }
}

// Tell a joke manually
function tellJoke() {
    gameState.laughs += 1;
    gameState.jokesTold += 1;
    updateDisplay();
    saveGame();
    
    // Show random joke
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    // Create temporary joke display in Universal Paperclips style
    const jokeDisplay = document.createElement('div');
    jokeDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #000;
        color: #fff;
        border: 2px solid #333;
        padding: 20px;
        font-family: 'Courier New', monospace;
        z-index: 1000;
        max-width: 500px;
        text-align: center;
    `;
    jokeDisplay.innerHTML = `
        <h3 style="margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 5px;">Joke</h3>
        <p style="margin-bottom: 15px; line-height: 1.5;">${randomJoke}</p>
        <button onclick="this.parentElement.remove()" style="background: #333; color: #fff; border: 1px solid #555; padding: 8px 16px; cursor: pointer; font-family: 'Courier New', monospace;">Close</button>
    `;
    
    document.body.appendChild(jokeDisplay);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(jokeDisplay)) {
            document.body.removeChild(jokeDisplay);
        }
    }, 5000);
    
    // Visual feedback
    laughsElement.style.color = '#0f0';
    setTimeout(() => {
        laughsElement.style.color = '#fff';
    }, 200);
}

// Save game
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('incrementalComedy', JSON.stringify(gameState));
}

// Load game
function loadGame() {
    const saved = localStorage.getItem('incrementalComedy');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
        } catch (e) {
            console.error('Failed to load saved game:', e);
        }
    }
}

// Auto-save
function autoSave() {
    saveGame();
}

// Format numbers for display
function formatNumber(num) {
    if (num < 1000) return Math.floor(num);
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

// Jokes array
const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fake noodle? An impasta!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the cookie go to the doctor? Because it was feeling crumbly!",
    "What do you call a fish wearing a bowtie? So-fish-ticated!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What do you call a can opener that doesn't work? A can't opener!"
];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame); 