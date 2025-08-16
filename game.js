// Game state
let gameState = {
    laughs: 0,
    laughsPerSecond: 0,
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
    
    // Update upgrade displays
    for (let upgradeId in gameState.upgrades) {
        const upgrade = gameState.upgrades[upgradeId];
        const countElement = document.getElementById(`${upgradeId}-count`);
        const costElement = document.getElementById(`${upgradeId}-cost`);
        
        if (countElement) countElement.textContent = upgrade.count;
        if (costElement) costElement.textContent = formatNumber(upgrade.cost);
        
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
        upgradeElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            upgradeElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Tell a joke manually
function tellJoke() {
    gameState.laughs += 1;
    updateDisplay();
    saveGame();
    
    // Visual feedback
    laughsElement.style.transform = 'scale(1.2)';
    laughsElement.style.color = '#ff6b6b';
    setTimeout(() => {
        laughsElement.style.transform = 'scale(1)';
        laughsElement.style.color = '#667eea';
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Add some fun jokes for manual clicking
const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fake noodle? An impasta!",
    "Why did the math book look so sad? Because it had too many problems!"
];

// Easter egg: random joke on manual click
function tellJoke() {
    gameState.laughs += 1;
    updateDisplay();
    saveGame();
    
    // Show random joke
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    // Create temporary joke display
    const jokeDisplay = document.createElement('div');
    jokeDisplay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 1000;
        max-width: 400px;
        animation: fadeInOut 3s ease-in-out;
    `;
    jokeDisplay.innerHTML = `
        <h3>🎭 Here's a joke for you!</h3>
        <p>${randomJoke}</p>
    `;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(jokeDisplay);
    
    // Remove after animation
    setTimeout(() => {
        document.body.removeChild(jokeDisplay);
    }, 3000);
    
    // Visual feedback
    laughsElement.style.transform = 'scale(1.2)';
    laughsElement.style.color = '#ff6b6b';
    setTimeout(() => {
        laughsElement.style.transform = 'scale(1)';
        laughsElement.style.color = '#667eea';
    }, 200);
} 