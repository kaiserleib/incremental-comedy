// Game state
let gameState = {
    money: 0,
    material: 0,
    laughsPerMinute: 0,
    followers: 0,
    
    // Income rates
    moneyPerSecond: 0,
    materialPerSecond: 0,
    followersPerSecond: 0,
    
    // Career progression
    careerLevel: 'Open Mic Comedian',
    totalGigs: 0,
    totalEarnings: 0,
    
    // Day job status
    dayJobActive: false,
    dayJobPay: 0.01,
    
    // Costs (will increase with usage)
    openMicCost: 5,
    comedyClassesCost: 50,
    writingTimeCost: 20,
    socialPostCost: 2,
    viralContentCost: 100,
    
    lastSave: Date.now()
};

// DOM elements
const moneyElement = document.getElementById('money');
const materialElement = document.getElementById('material');
const laughsPerMinuteElement = document.getElementById('laughs-per-minute');
const followersElement = document.getElementById('followers');
const moneyPerSecondElement = document.getElementById('money-per-second');
const materialPerSecondElement = document.getElementById('material-per-second');
const followersPerSecondElement = document.getElementById('followers-per-second');
const dayJobStatusElement = document.getElementById('day-job-status');
const careerLevelElement = document.getElementById('career-level');
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
    // Passive income from day job
    if (gameState.dayJobActive) {
        gameState.money += gameState.dayJobPay;
        gameState.totalEarnings += gameState.dayJobPay;
    }
    
    updateDisplay();
}

// Update display
function updateDisplay() {
    moneyElement.textContent = formatMoney(gameState.money);
    materialElement.textContent = formatNumber(gameState.material);
    laughsPerMinuteElement.textContent = formatNumber(gameState.laughsPerMinute);
    followersElement.textContent = formatNumber(gameState.followers);
    
    moneyPerSecondElement.textContent = formatMoney(gameState.moneyPerSecond);
    materialPerSecondElement.textContent = formatNumber(gameState.materialPerSecond);
    followersPerSecondElement.textContent = formatNumber(gameState.followersPerSecond);
    
    // Update day job status
    dayJobStatusElement.textContent = gameState.dayJobActive ? 'ON' : 'OFF';
    dayJobStatusElement.className = gameState.dayJobActive ? 'status' : 'status off';
    
    // Update career level
    careerLevelElement.textContent = gameState.careerLevel;
    
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
    
    // Update button states based on available resources
    updateButtonStates();
}

// Update button states
function updateButtonStates() {
    // Open mic
    const openMicBtn = document.querySelector('#open-mic .upgrade-btn');
    if (openMicBtn) {
        openMicBtn.disabled = gameState.money < gameState.openMicCost;
    }
    
    // Comedy classes
    const comedyClassesBtn = document.querySelector('#comedy-classes .upgrade-btn');
    if (comedyClassesBtn) {
        comedyClassesBtn.disabled = gameState.money < gameState.comedyClassesCost;
    }
    
    // Writing time
    const writingTimeBtn = document.querySelector('#writing-time .upgrade-btn');
    if (writingTimeBtn) {
        writingTimeBtn.disabled = gameState.money < gameState.writingTimeCost;
    }
    
    // Social post
    const socialPostBtn = document.querySelector('#social-post .upgrade-btn');
    if (socialPostBtn) {
        socialPostBtn.disabled = gameState.money < gameState.socialPostCost;
    }
    
    // Viral content
    const viralContentBtn = document.querySelector('#viral-content .upgrade-btn');
    if (viralContentBtn) {
        viralContentBtn.disabled = gameState.money < gameState.viralContentCost;
    }
    
    // Paid gig
    const paidGigBtn = document.querySelector('#paid-gig .upgrade-btn');
    if (paidGigBtn) {
        paidGigBtn.disabled = gameState.material < 10;
    }
    
    // Comedy festival
    const festivalBtn = document.querySelector('#comedy-festival .upgrade-btn');
    if (festivalBtn) {
        festivalBtn.disabled = gameState.material < 30;
    }
}

// Day job functions
function toggleDayJob() {
    gameState.dayJobActive = !gameState.dayJobActive;
    if (gameState.dayJobActive) {
        gameState.moneyPerSecond = gameState.dayJobPay;
    } else {
        gameState.moneyPerSecond = 0;
    }
    updateDisplay();
    saveGame();
}

// Comedy development functions
function attendOpenMic() {
    if (gameState.money >= gameState.openMicCost) {
        gameState.money -= gameState.openMicCost;
        gameState.material += 1;
        gameState.openMicCost = Math.floor(gameState.openMicCost * 1.1); // 10% increase
        
        updateDisplay();
        saveGame();
        showMessage('Attended open mic! Gained 1 minute of material.');
    }
}

function takeComedyClass() {
    if (gameState.money >= gameState.comedyClassesCost) {
        gameState.money -= gameState.comedyClassesCost;
        gameState.laughsPerMinute += 0.1;
        gameState.comedyClassesCost = Math.floor(gameState.comedyClassesCost * 1.2); // 20% increase
        
        updateDisplay();
        saveGame();
        showMessage('Took comedy class! Laughs per minute increased.');
    }
}

function writeMaterial() {
    if (gameState.money >= gameState.writingTimeCost) {
        gameState.money -= gameState.writingTimeCost;
        gameState.material += 5;
        gameState.writingTimeCost = Math.floor(gameState.writingTimeCost * 1.15); // 15% increase
        
        updateDisplay();
        saveGame();
        showMessage('Wrote new material! Gained 5 minutes of material.');
    }
}

// Social media functions
function makeSocialPost() {
    if (gameState.money >= gameState.socialPostCost) {
        gameState.money -= gameState.socialPostCost;
        gameState.followers += 5;
        gameState.socialPostCost = Math.floor(gameState.socialPostCost * 1.05); // 5% increase
        
        updateDisplay();
        saveGame();
        showMessage('Made social media post! Gained 5 followers.');
    }
}

function createViralContent() {
    if (gameState.money >= gameState.viralContentCost) {
        gameState.money -= gameState.viralContentCost;
        gameState.followers += 50;
        gameState.viralContentCost = Math.floor(gameState.viralContentCost * 1.3); // 30% increase
        
        updateDisplay();
        saveGame();
        showMessage('Created viral content! Gained 50 followers.');
    }
}

// Performance functions
function performPaidGig() {
    if (gameState.material >= 10) {
        gameState.material -= 10;
        gameState.money += 25;
        gameState.totalEarnings += 25;
        gameState.totalGigs += 1;
        
        updateDisplay();
        saveGame();
        showMessage('Performed paid gig! Earned $25.');
        checkCareerProgression();
    }
}

function performAtFestival() {
    if (gameState.material >= 30) {
        gameState.material -= 30;
        gameState.money += 200;
        gameState.totalEarnings += 200;
        gameState.totalGigs += 1;
        
        updateDisplay();
        saveGame();
        showMessage('Performed at festival! Earned $200.');
        checkCareerProgression();
    }
}

// Career progression
function checkCareerProgression() {
    if (gameState.totalEarnings >= 1000 && gameState.careerLevel === 'Open Mic Comedian') {
        gameState.careerLevel = 'Paid Comedian';
        showMessage('🎉 Career milestone: You\'re now a Paid Comedian!');
    } else if (gameState.totalEarnings >= 5000 && gameState.careerLevel === 'Paid Comedian') {
        gameState.careerLevel = 'Professional Comedian';
        showMessage('🎉 Career milestone: You\'re now a Professional Comedian!');
    } else if (gameState.totalEarnings >= 20000 && gameState.careerLevel === 'Professional Comedian') {
        gameState.careerLevel = 'Headliner';
        showMessage('🎉 Career milestone: You\'re now a Headliner!');
    } else if (gameState.totalEarnings >= 100000 && gameState.careerLevel === 'Headliner') {
        gameState.careerLevel = 'Comedy Legend';
        showMessage('🎉 Career milestone: You\'re now a Comedy Legend!');
    }
    
    updateDisplay();
}

// Utility functions
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000;
        color: #fff;
        border: 2px solid #333;
        padding: 15px;
        font-family: 'Courier New', monospace;
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.5s ease-out;
    `;
    messageDiv.textContent = message;
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            document.body.removeChild(messageDiv);
        }
    }, 3000);
}

// Save/Load functions
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('comedyCareer', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('comedyCareer');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            gameState = { ...gameState, ...loadedState };
        } catch (e) {
            console.error('Failed to load saved game:', e);
        }
    }
}

function autoSave() {
    saveGame();
}

// Formatting functions
function formatMoney(amount) {
    if (amount < 1000) return `$${amount.toFixed(2)}`;
    if (amount < 1000000) return `$${(amount / 1000).toFixed(1)}K`;
    if (amount < 1000000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000000000).toFixed(1)}B`;
}

function formatNumber(num) {
    if (num < 1000) return Math.floor(num);
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame); 