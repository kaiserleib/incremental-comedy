// Game state
let gameState = {
    money: 0,
    material: 0,
    laughsPerMinute: 0,
    followers: 0,
    
    // Time management
    availableTime: 100, // Percentage of time available for comedy
    currentJob: 'unemployed',
    
    // Income rates
    moneyPerSecond: 0,
    materialPerSecond: 0,
    followersPerSecond: 0,
    
    // Career progression
    careerLevel: 'Open Mic Comedian',
    totalGigs: 0,
    totalEarnings: 0,
    
    // Job configurations
    jobs: {
        'unemployed': { name: 'Unemployed', pay: 0, timeRequired: 0, comedyTime: 100 },
        'uber': { name: 'Uber Driver', pay: 0.005, timeRequired: 20, comedyTime: 80 },
        'coffee': { name: 'Coffee Shop', pay: 0.015, timeRequired: 50, comedyTime: 50 },
        'office': { name: 'Office Job', pay: 0.05, timeRequired: 80, comedyTime: 20 }
    },
    
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
const availableTimeElement = document.getElementById('available-time');
const moneyPerSecondElement = document.getElementById('money-per-second');
const materialPerSecondElement = document.getElementById('material-per-second');
const followersPerSecondElement = document.getElementById('followers-per-second');
const currentJobElement = document.getElementById('current-job');
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
    // Passive income from current job
    const currentJobConfig = gameState.jobs[gameState.currentJob];
    if (currentJobConfig) {
        gameState.money += currentJobConfig.pay;
        gameState.totalEarnings += currentJobConfig.pay;
        gameState.moneyPerSecond = currentJobConfig.pay;
    }
    
    updateDisplay();
}

// Update display
function updateDisplay() {
    moneyElement.textContent = formatMoney(gameState.money);
    materialElement.textContent = formatNumber(gameState.material);
    laughsPerMinuteElement.textContent = formatNumber(gameState.laughsPerMinute);
    followersElement.textContent = formatNumber(gameState.followers);
    availableTimeElement.textContent = `${gameState.availableTime}%`;
    
    moneyPerSecondElement.textContent = formatMoney(gameState.moneyPerSecond);
    materialPerSecondElement.textContent = formatNumber(gameState.materialPerSecond);
    followersPerSecondElement.textContent = formatNumber(gameState.followersPerSecond);
    
    // Update job statuses
    updateJobStatuses();
    
    // Update current job display
    currentJobElement.textContent = gameState.jobs[gameState.currentJob].name;
    
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
    
    // Update button states based on available resources and time
    updateButtonStates();
}

// Update job statuses
function updateJobStatuses() {
    for (let jobId in gameState.jobs) {
        const statusElement = document.getElementById(`${jobId}-status`);
        if (statusElement) {
            if (gameState.currentJob === jobId) {
                statusElement.textContent = 'ON';
                statusElement.className = 'status';
            } else {
                statusElement.textContent = 'OFF';
                statusElement.className = 'status off';
            }
        }
    }
}

// Update button states
function updateButtonStates() {
    // Open mic
    const openMicBtn = document.querySelector('#open-mic .upgrade-btn');
    const openMicAvailable = document.getElementById('open-mic-available');
    if (openMicBtn && openMicAvailable) {
        const canAfford = gameState.money >= gameState.openMicCost;
        const hasTime = gameState.availableTime >= 10;
        openMicBtn.disabled = !canAfford || !hasTime;
        openMicAvailable.textContent = hasTime ? 'Yes' : 'No Time';
        openMicAvailable.className = hasTime ? 'status' : 'status off';
    }
    
    // Comedy classes
    const comedyClassesBtn = document.querySelector('#comedy-classes .upgrade-btn');
    const comedyClassesAvailable = document.getElementById('comedy-classes-available');
    if (comedyClassesBtn && comedyClassesAvailable) {
        const canAfford = gameState.money >= gameState.comedyClassesCost;
        const hasTime = gameState.availableTime >= 15;
        comedyClassesBtn.disabled = !canAfford || !hasTime;
        comedyClassesAvailable.textContent = hasTime ? 'Yes' : 'No Time';
        comedyClassesAvailable.className = hasTime ? 'status' : 'status off';
    }
    
    // Writing time
    const writingTimeBtn = document.querySelector('#writing-time .upgrade-btn');
    const writingTimeAvailable = document.getElementById('writing-time-available');
    if (writingTimeBtn && writingTimeAvailable) {
        const canAfford = gameState.money >= gameState.writingTimeCost;
        const hasTime = gameState.availableTime >= 25;
        writingTimeBtn.disabled = !canAfford || !hasTime;
        writingTimeAvailable.textContent = hasTime ? 'Yes' : 'No Time';
        writingTimeAvailable.className = hasTime ? 'status' : 'status off';
    }
    
    // Social post
    const socialPostBtn = document.querySelector('#social-post .upgrade-btn');
    const socialPostAvailable = document.getElementById('social-post-available');
    if (socialPostBtn && socialPostAvailable) {
        const canAfford = gameState.money >= gameState.socialPostCost;
        const hasTime = gameState.availableTime >= 5;
        socialPostBtn.disabled = !canAfford || !hasTime;
        socialPostAvailable.textContent = hasTime ? 'Yes' : 'No Time';
        socialPostAvailable.className = hasTime ? 'status' : 'status off';
    }
    
    // Viral content
    const viralContentBtn = document.querySelector('#viral-content .upgrade-btn');
    const viralContentAvailable = document.getElementById('viral-content-available');
    if (viralContentBtn && viralContentAvailable) {
        const canAfford = gameState.money >= gameState.viralContentCost;
        const hasTime = gameState.availableTime >= 20;
        viralContentBtn.disabled = !canAfford || !hasTime;
        viralContentAvailable.textContent = hasTime ? 'Yes' : 'No Time';
        viralContentAvailable.className = hasTime ? 'status' : 'status off';
    }
    
    // Paid gig
    const paidGigBtn = document.querySelector('#paid-gig .upgrade-btn');
    const paidGigAvailable = document.getElementById('paid-gig-available');
    if (paidGigBtn && paidGigAvailable) {
        const hasMaterial = gameState.material >= 10;
        const hasTime = gameState.availableTime >= 30;
        paidGigBtn.disabled = !hasMaterial || !hasTime;
        paidGigAvailable.textContent = hasMaterial && hasTime ? 'Yes' : hasMaterial ? 'No Time' : 'No Material';
        paidGigAvailable.className = hasMaterial && hasTime ? 'status' : 'status off';
    }
    
    // Comedy festival
    const festivalBtn = document.querySelector('#comedy-festival .upgrade-btn');
    const festivalAvailable = document.getElementById('comedy-festival-available');
    if (festivalBtn && festivalAvailable) {
        const hasMaterial = gameState.material >= 30;
        const hasTime = gameState.availableTime >= 50;
        festivalBtn.disabled = !hasMaterial || !hasTime;
        festivalAvailable.textContent = hasMaterial && hasTime ? 'Yes' : hasMaterial ? 'No Time' : 'No Material';
        festivalAvailable.className = hasMaterial && hasTime ? 'status' : 'status off';
    }
}

// Job switching function
function switchJob(jobId) {
    if (gameState.currentJob === jobId) return; // Already at this job
    
    gameState.currentJob = jobId;
    const newJob = gameState.jobs[jobId];
    gameState.availableTime = newJob.comedyTime;
    
    updateDisplay();
    saveGame();
    
    showMessage(`Switched to ${newJob.name}! Available comedy time: ${newJob.comedyTime}%`);
}

// Comedy development functions
function attendOpenMic() {
    if (gameState.money >= gameState.openMicCost && gameState.availableTime >= 10) {
        gameState.money -= gameState.openMicCost;
        gameState.material += 1;
        gameState.availableTime -= 10;
        gameState.openMicCost = Math.floor(gameState.openMicCost * 1.1); // 10% increase
        
        updateDisplay();
        saveGame();
        showMessage('Attended open mic! Gained 1 minute of material. Used 10% time.');
    }
}

function takeComedyClass() {
    if (gameState.money >= gameState.comedyClassesCost && gameState.availableTime >= 15) {
        gameState.money -= gameState.comedyClassesCost;
        gameState.laughsPerMinute += 0.1;
        gameState.availableTime -= 15;
        gameState.comedyClassesCost = Math.floor(gameState.comedyClassesCost * 1.2); // 20% increase
        
        updateDisplay();
        saveGame();
        showMessage('Took comedy class! Laughs per minute increased. Used 15% time.');
    }
}

function writeMaterial() {
    if (gameState.money >= gameState.writingTimeCost && gameState.availableTime >= 25) {
        gameState.money -= gameState.writingTimeCost;
        gameState.material += 5;
        gameState.availableTime -= 25;
        gameState.writingTimeCost = Math.floor(gameState.writingTimeCost * 1.15); // 15% increase
        
        updateDisplay();
        saveGame();
        showMessage('Wrote new material! Gained 5 minutes of material. Used 25% time.');
    }
}

// Social media functions
function makeSocialPost() {
    if (gameState.money >= gameState.socialPostCost && gameState.availableTime >= 5) {
        gameState.money -= gameState.socialPostCost;
        gameState.followers += 5;
        gameState.availableTime -= 5;
        gameState.socialPostCost = Math.floor(gameState.socialPostCost * 1.05); // 5% increase
        
        updateDisplay();
        saveGame();
        showMessage('Made social media post! Gained 5 followers. Used 5% time.');
    }
}

function createViralContent() {
    if (gameState.money >= gameState.viralContentCost && gameState.availableTime >= 20) {
        gameState.money -= gameState.viralContentCost;
        gameState.followers += 50;
        gameState.availableTime -= 20;
        gameState.viralContentCost = Math.floor(gameState.viralContentCost * 1.3); // 30% increase
        
        updateDisplay();
        saveGame();
        showMessage('Created viral content! Gained 50 followers. Used 20% time.');
    }
}

// Performance functions
function performPaidGig() {
    if (gameState.material >= 10 && gameState.availableTime >= 30) {
        gameState.material -= 10;
        gameState.money += 25;
        gameState.totalEarnings += 25;
        gameState.totalGigs += 1;
        gameState.availableTime -= 30;
        
        updateDisplay();
        saveGame();
        showMessage('Performed paid gig! Earned $25. Used 30% time.');
        checkCareerProgression();
    }
}

function performAtFestival() {
    if (gameState.material >= 30 && gameState.availableTime >= 50) {
        gameState.material -= 30;
        gameState.money += 200;
        gameState.totalEarnings += 200;
        gameState.totalGigs += 1;
        gameState.availableTime -= 50;
        
        updateDisplay();
        saveGame();
        showMessage('Performed at festival! Earned $200. Used 50% time.');
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