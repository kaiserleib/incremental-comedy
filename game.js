// Game State
let gameState = {
    // Resources
    money: 0,
    freeTime: 4, // hours
    freshMaterial: 0, // minutes
    totalMaterial: 0, // minutes (never decreases)
    followers: 0,
    confidence: 50, // percentage
    reputation: 0,
    
    // Income rates
    moneyPerSec: 0,
    timePerSec: 1, // unemployed default
    
    // Job
    currentJob: 'unemployed',
    
    // Progress
    gigsCompleted: 0,
    careerLevel: 'Open Mic Rookie',
    gamePhase: 1,
    
    // Automation
    automation: {
        writingRoutine: false,
        dayPlanner: false,
        socialScheduler: false,
        bookingAgent: false
    },
    
    // Unlocks
    unlockedGigs: false,
    unlockedAutomation: false,
    unlockedVenues: false,
    
    lastSave: Date.now()
};

// Job configurations
const jobs = {
    unemployed: { name: 'Unemployed', money: 0, time: 1 },
    barista: { name: 'Barista', money: 2, time: 0.3 },
    uber: { name: 'Uber Driver', money: 3, time: 0.5 },
    office: { name: 'Office Job', money: 8, time: 0.1 }
};

// Automation upgrades
const automationUpgrades = {
    writingRoutine: {
        name: 'Writing Routine',
        cost: 300,
        description: 'Auto-writes material when free time ≥ 15h',
        unlocked: () => gameState.totalMaterial >= 20
    },
    dayPlanner: {
        name: 'Day Planner',
        cost: 500,
        description: 'Auto-attends open mics when material ≥ 5min AND time ≥ 10h',
        unlocked: () => gameState.totalMaterial >= 50
    },
    socialScheduler: {
        name: 'Social Media Scheduler',
        cost: 750,
        description: 'Auto-posts when fresh material ≥ 3min',
        unlocked: () => gameState.followers >= 100
    },
    bookingAgent: {
        name: 'Booking Agent',
        cost: 2000,
        description: 'Auto-applies for gigs when reputation ≥ 20',
        unlocked: () => gameState.reputation >= 10
    }
};

// DOM Elements
const elements = {
    money: document.getElementById('money'),
    freeTime: document.getElementById('free-time'),
    freshMaterial: document.getElementById('fresh-material'),
    totalMaterial: document.getElementById('total-material'),
    followers: document.getElementById('followers'),
    confidence: document.getElementById('confidence'),
    reputation: document.getElementById('reputation'),
    moneyPerSec: document.getElementById('money-per-sec'),
    timePerSec: document.getElementById('time-per-sec'),
    careerLevel: document.getElementById('career-level'),
    gamePhase: document.getElementById('game-phase'),
    gigsCompleted: document.getElementById('gigs-completed'),
    eventLog: document.getElementById('event-log')
};

// Utility Functions
function formatNumber(num) {
    if (num < 1000) return Math.floor(num);
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

function formatMoney(amount) {
    return '$' + formatNumber(amount);
}

function formatTime(hours) {
    if (hours < 1) return Math.floor(hours * 60) + 'm';
    return hours.toFixed(1) + 'h';
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function logEvent(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;
    elements.eventLog.appendChild(logEntry);
    elements.eventLog.scrollTop = elements.eventLog.scrollHeight;
    
    // Keep log manageable
    if (elements.eventLog.children.length > 50) {
        elements.eventLog.removeChild(elements.eventLog.firstChild);
    }
}

// Game Actions
function writeMaterial() {
    if (gameState.freeTime >= 2) {
        gameState.freeTime -= 2;
        const materialGained = random(1, 3);
        gameState.freshMaterial += materialGained;
        gameState.totalMaterial += materialGained;
        
        logEvent(`Wrote ${materialGained} minutes of fresh material`, 'success');
        updateDisplay();
        checkUnlocks();
    }
}

function attendOpenMic() {
    if (gameState.freeTime >= 3 && gameState.freshMaterial >= 1) {
        gameState.freeTime -= 3;
        const materialUsed = Math.min(gameState.freshMaterial, 5);
        gameState.freshMaterial -= materialUsed;
        
        // Success based on confidence
        const successChance = gameState.confidence / 100;
        const success = Math.random() < successChance;
        
        if (success) {
            const confidenceGain = random(5, 15);
            const followersGain = random(2, 8);
            gameState.confidence = Math.min(100, gameState.confidence + confidenceGain);
            gameState.followers += followersGain;
            gameState.reputation += 0.5;
            
            logEvent(`Great set! +${confidenceGain}% confidence, +${followersGain} followers`, 'success');
        } else {
            const confidenceLoss = random(5, 10);
            gameState.confidence = Math.max(10, gameState.confidence - confidenceLoss);
            
            logEvent(`Tough crowd... -${confidenceLoss}% confidence`, 'failure');
        }
        
        updateDisplay();
        checkUnlocks();
    }
}

function postContent() {
    if (gameState.freeTime >= 1 && gameState.freshMaterial >= 1) {
        gameState.freeTime -= 1;
        gameState.freshMaterial -= 1;
        
        const followersGain = random(5, 15);
        gameState.followers += followersGain;
        
        // Chance for viral content
        if (Math.random() < 0.1) {
            const viralBonus = random(50, 200);
            gameState.followers += viralBonus;
            logEvent(`Content went viral! +${followersGain + viralBonus} followers total`, 'success');
        } else {
            logEvent(`Posted content. +${followersGain} followers`, 'success');
        }
        
        updateDisplay();
        checkUnlocks();
    }
}

function applyForGigs() {
    if (gameState.freeTime >= 1) {
        gameState.freeTime -= 1;
        
        // Success based on reputation and followers
        const successChance = Math.min(0.8, (gameState.reputation + gameState.followers / 100) / 20);
        
        if (Math.random() < successChance) {
            const payment = random(50, 200);
            gameState.money += payment;
            gameState.gigsCompleted++;
            gameState.reputation += 2;
            
            logEvent(`Booked a gig! Earned ${formatMoney(payment)}`, 'success');
        } else {
            logEvent('No callbacks this time. Keep building your rep!', 'info');
        }
        
        updateDisplay();
        checkUnlocks();
    }
}

// Job System
function selectJob(jobType) {
    gameState.currentJob = jobType;
    const job = jobs[jobType];
    gameState.moneyPerSec = job.money;
    gameState.timePerSec = job.time;
    
    // Update UI
    document.querySelectorAll('.job').forEach(j => j.classList.remove('selected'));
    document.querySelector(`[data-job="${jobType}"]`).classList.add('selected');
    
    logEvent(`Switched to: ${job.name}`, 'info');
    updateDisplay();
}

// Automation
function buyAutomation(upgradeKey) {
    const upgrade = automationUpgrades[upgradeKey];
    if (gameState.money >= upgrade.cost && !gameState.automation[upgradeKey]) {
        gameState.money -= upgrade.cost;
        gameState.automation[upgradeKey] = true;
        
        logEvent(`Purchased: ${upgrade.name}`, 'success');
        updateDisplay();
        updateAutomationUI();
    }
}

function runAutomation() {
    // Writing Routine
    if (gameState.automation.writingRoutine && gameState.freeTime >= 15) {
        gameState.freeTime -= 2;
        const materialGained = random(1, 3);
        gameState.freshMaterial += materialGained;
        gameState.totalMaterial += materialGained;
    }
    
    // Day Planner
    if (gameState.automation.dayPlanner && gameState.freeTime >= 10 && gameState.freshMaterial >= 5) {
        gameState.freeTime -= 3;
        const materialUsed = Math.min(gameState.freshMaterial, 5);
        gameState.freshMaterial -= materialUsed;
        
        const successChance = gameState.confidence / 100;
        if (Math.random() < successChance) {
            const confidenceGain = random(3, 8);
            const followersGain = random(1, 5);
            gameState.confidence = Math.min(100, gameState.confidence + confidenceGain);
            gameState.followers += followersGain;
            gameState.reputation += 0.3;
        }
    }
    
    // Social Scheduler
    if (gameState.automation.socialScheduler && gameState.freshMaterial >= 3) {
        gameState.freshMaterial -= 1;
        const followersGain = random(3, 8);
        gameState.followers += followersGain;
    }
    
    // Booking Agent
    if (gameState.automation.bookingAgent && gameState.reputation >= 20) {
        const successChance = Math.min(0.6, gameState.reputation / 50);
        if (Math.random() < successChance) {
            const payment = random(30, 100);
            gameState.money += payment;
            gameState.gigsCompleted++;
            gameState.reputation += 1;
        }
    }
}

// UI Updates
function updateDisplay() {
    elements.money.textContent = formatMoney(gameState.money);
    elements.freeTime.textContent = formatTime(gameState.freeTime);
    elements.freshMaterial.textContent = gameState.freshMaterial + ' min';
    elements.totalMaterial.textContent = gameState.totalMaterial + ' min';
    elements.followers.textContent = formatNumber(gameState.followers);
    elements.confidence.textContent = Math.floor(gameState.confidence) + '%';
    elements.reputation.textContent = formatNumber(gameState.reputation);
    elements.moneyPerSec.textContent = formatMoney(gameState.moneyPerSec);
    elements.timePerSec.textContent = formatTime(gameState.timePerSec);
    elements.careerLevel.textContent = gameState.careerLevel;
    elements.gamePhase.textContent = getPhaseText();
    elements.gigsCompleted.textContent = gameState.gigsCompleted;
    
    updateActionStates();
    updateCareerLevel();
}

function updateActionStates() {
    // Write Material
    const writeBtn = document.querySelector('#write-material-action .button');
    const writeAvailable = document.getElementById('write-available');
    if (gameState.freeTime >= 2) {
        writeBtn.disabled = false;
        writeAvailable.textContent = 'Available';
        writeAvailable.className = 'status-available';
    } else {
        writeBtn.disabled = true;
        writeAvailable.textContent = 'Need 2 hours';
        writeAvailable.className = 'status-unavailable';
    }
    
    // Open Mic
    const micBtn = document.querySelector('#open-mic-action .button');
    const micAvailable = document.getElementById('open-mic-available');
    if (gameState.freeTime >= 3 && gameState.freshMaterial >= 1) {
        micBtn.disabled = false;
        micAvailable.textContent = 'Available';
        micAvailable.className = 'status-available';
    } else {
        micBtn.disabled = true;
        if (gameState.freeTime < 3) {
            micAvailable.textContent = 'Need 3 hours';
        } else {
            micAvailable.textContent = 'Need material';
        }
        micAvailable.className = 'status-unavailable';
    }
    
    // Post Content
    const postBtn = document.querySelector('#post-content-action .button');
    const postAvailable = document.getElementById('post-available');
    if (gameState.freeTime >= 1 && gameState.freshMaterial >= 1) {
        postBtn.disabled = false;
        postAvailable.textContent = 'Available';
        postAvailable.className = 'status-available';
    } else {
        postBtn.disabled = true;
        if (gameState.freeTime < 1) {
            postAvailable.textContent = 'Need 1 hour';
        } else {
            postAvailable.textContent = 'Need material';
        }
        postAvailable.className = 'status-unavailable';
    }
    
    // Apply for Gigs
    if (gameState.unlockedGigs) {
        const gigsBtn = document.querySelector('#apply-gigs-action .button');
        const gigsAvailable = document.getElementById('gigs-available');
        if (gameState.freeTime >= 1) {
            gigsBtn.disabled = false;
            gigsAvailable.textContent = 'Available';
            gigsAvailable.className = 'status-available';
        } else {
            gigsBtn.disabled = true;
            gigsAvailable.textContent = 'Need 1 hour';
            gigsAvailable.className = 'status-unavailable';
        }
    }
}

function updateAutomationUI() {
    if (!gameState.unlockedAutomation) return;
    
    const container = document.getElementById('automation-upgrades');
    container.innerHTML = '';
    
    Object.entries(automationUpgrades).forEach(([key, upgrade]) => {
        if (upgrade.unlocked()) {
            const div = document.createElement('div');
            div.className = `upgrade ${gameState.automation[key] ? 'owned' : ''}`;
            
            const canAfford = gameState.money >= upgrade.cost;
            const isOwned = gameState.automation[key];
            
            div.innerHTML = `
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <div class="cost">Cost: ${formatMoney(upgrade.cost)}</div>
                ${!isOwned ? 
                    `<button class="button" onclick="buyAutomation('${key}')" ${!canAfford ? 'disabled' : ''}>Purchase</button>` :
                    '<div style="color: #0f0;">OWNED</div>'
                }
            `;
            
            container.appendChild(div);
        }
    });
}

function getPhaseText() {
    if (gameState.gamePhase === 1) return 'Manual Grind';
    if (gameState.gamePhase === 2) return 'Automation Unlocked';
    if (gameState.gamePhase === 3) return 'Comedy Empire';
    return 'Transcendence';
}

function updateCareerLevel() {
    let newLevel = 'Open Mic Rookie';
    
    if (gameState.totalMaterial >= 100) newLevel = 'Comedy Veteran';
    else if (gameState.totalMaterial >= 50) newLevel = 'Rising Comedian';
    else if (gameState.totalMaterial >= 20) newLevel = 'Regular Performer';
    else if (gameState.totalMaterial >= 10) newLevel = 'Open Mic Regular';
    
    if (newLevel !== gameState.careerLevel) {
        gameState.careerLevel = newLevel;
        logEvent(`Career advancement: ${newLevel}!`, 'success');
    }
}

function checkUnlocks() {
    // Unlock gigs
    if (!gameState.unlockedGigs && gameState.followers >= 50) {
        gameState.unlockedGigs = true;
        document.getElementById('apply-gigs-action').classList.remove('hidden');
        logEvent('New action unlocked: Apply for Gigs!', 'success');
    }
    
    // Unlock automation
    if (!gameState.unlockedAutomation && gameState.totalMaterial >= 20) {
        gameState.unlockedAutomation = true;
        gameState.gamePhase = 2;
        document.getElementById('automation-section').classList.remove('hidden');
        document.getElementById('upgrades-section').classList.remove('hidden');
        logEvent('Phase 2 unlocked: Automation available!', 'success');
        updateAutomationUI();
    }
    
    // Show reputation when relevant
    if (gameState.reputation >= 1) {
        document.getElementById('reputation-resource').classList.remove('hidden');
    }
}

// Game Loop
function gameLoop() {
    // Passive income
    gameState.money += gameState.moneyPerSec;
    gameState.freeTime += gameState.timePerSec;
    
    // Run automation
    runAutomation();
    
    updateDisplay();
}

// Job selection event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.job').forEach(job => {
job.addEventListener('click', () => {
    selectJob(job.dataset.job);
});
    });
});

// Save/Load
function saveGame() {
    gameState.lastSave = Date.now();
    localStorage.setItem('comedyIncremental', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('comedyIncremental');
    if (saved) {
        try {
            const loadedState = JSON.parse(saved);
            Object.assign(gameState, loadedState);
            
            // Update job selection
            selectJob(gameState.currentJob);
            
            // Restore UI state
            if (gameState.unlockedGigs) {
                document.getElementById('apply-gigs-action').classList.remove('hidden');
            }
            if (gameState.unlockedAutomation) {
                document.getElementById('automation-section').classList.remove('hidden');
                document.getElementById('upgrades-section').classList.remove('hidden');
                updateAutomationUI();
            }
            if (gameState.reputation >= 1) {
                document.getElementById('reputation-resource').classList.remove('hidden');
            }
            
            logEvent('Game loaded successfully', 'info');
        } catch (e) {
            logEvent('Save file corrupted, starting fresh', 'failure');
        }
    }
}

// Initialize game
function initGame() {
    loadGame();
    updateDisplay();
    
    // Start game loops
    setInterval(gameLoop, 1000); // Main loop every second
    setInterval(saveGame, 10000); // Auto-save every 10 seconds
    
    logEvent('Comedy Incremental started! Write some material to begin.', 'info');
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
