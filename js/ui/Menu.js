// Menu Manager Class
class MenuManager {
    constructor(gameEngine, gameState) {
        this.gameEngine = gameEngine;
        this.gameState = gameState;
        this.currentScreen = 'main-menu';
        this.menuMusic = null;
        
        this.screens = {
            'main-menu': document.getElementById('main-menu'),
            'level-select': document.getElementById('level-select'),
            'game-screen': document.getElementById('game-screen'),
            'challenge-screen': document.getElementById('challenge-screen'),
            'load-game-screen': document.getElementById('load-game-screen'),
            'almanac-screen': document.getElementById('almanac-screen'),
            'end-game-screen': document.getElementById('end-game-screen'),
            'tutorial-screen': document.getElementById('tutorial-screen')
        };
        
        this.setupEventListeners();
        this.initializePlantSelector();
        
        // Initialize level buttons on startup
        this.updateLevelButtons();
        
        // Start menu music when initially loaded
        this.startMenuMusic();
        
        // Check for autosave and prompt user
        this.checkForAutosave();
    }
    
    checkForAutosave() {
        // Slight delay to ensure game engine is fully initialized
        setTimeout(() => {
            if (this.gameEngine.hasAutosave()) {
                this.showAutosavePrompt();
            }
        }, 500);
    }
    
    showAutosavePrompt() {
        const saveInfo = this.gameEngine.getAutosaveInfo();
        if (!saveInfo) return;
        
        const saveDate = new Date(saveInfo.timestamp).toLocaleString();
        
        // Create autosave prompt overlay
        const overlay = document.createElement('div');
        overlay.id = 'autosave-prompt';
        overlay.className = 'autosave-prompt-overlay';
        overlay.innerHTML = `
            <div class="autosave-prompt-box">
                <h2>🎮 Game Found!</h2>
                <p>You have an unsaved game in progress:</p>
                <div class="autosave-info">
                    <p><strong>Level:</strong> ${saveInfo.levelNumber}</p>
                    <p><strong>Sun:</strong> ${saveInfo.sunCount} ☀️</p>
                    <p><strong>Plants:</strong> ${saveInfo.plants.length} 🌻</p>
                    <p><strong>Saved:</strong> ${saveDate}</p>
                </div>
                <p>Would you like to continue where you left off?</p>
                <div class="autosave-buttons">
                    <button class="wooden-btn autosave-continue" id="autosave-continue">
                        <span class="btn-text">Continue</span>
                    </button>
                    <button class="wooden-btn autosave-new" id="autosave-new">
                        <span class="btn-text">Start Fresh</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('autosave-continue').addEventListener('click', () => {
            overlay.remove();
            this.restoreAutosave();
        });
        
        document.getElementById('autosave-new').addEventListener('click', () => {
            overlay.remove();
            this.gameEngine.clearAutosave();
        });
    }
    
    restoreAutosave() {
        // Show game screen first
        this.showScreen('game-screen');
        
        // Restore the game
        if (this.gameEngine.restoreFromAutosave()) {
            console.log('Game restored from autosave');
        } else {
            console.log('Failed to restore autosave');
            this.showScreen('main-menu');
        }
    }
    
    startMenuMusic() {
        // Use global BackgroundMusic manager instead of separate menu music
        // Background music plays continuously on all screens
        if (window.BackgroundMusic) {
            window.BackgroundMusic.init();
        }
    }
    
    stopMenuMusic() {
        // Don't stop background music anymore - it plays on all screens
        // This method is kept for compatibility but does nothing now
    }
    
    setupEventListeners() {
        // Main menu buttons
        document.getElementById('new-game-btn')?.addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        document.getElementById('load-game-btn')?.addEventListener('click', () => {
            this.showLoadGame();
        });
        
        document.getElementById('challenges-btn')?.addEventListener('click', () => {
            this.showChallenges();
        });
        
        document.getElementById('almanac-btn')?.addEventListener('click', () => {
            this.showAlmanac();
        });
        
        // Tutorial button
        document.getElementById('tutorial-btn')?.addEventListener('click', () => {
            this.showScreen('tutorial-screen');
        });
        
        document.getElementById('tutorial-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        // Level select
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Get the button element (even if click was on child element)
                const button = e.target.closest('.level-btn');
                if (!button) return;
                
                const level = parseInt(button.dataset.level);
                console.log('Level button clicked:', level, 'unlockedLevels:', this.gameState.unlockedLevels);
                
                // Only allow playing if level is unlocked
                if (level <= this.gameState.unlockedLevels) {
                    console.log('Starting level', level);
                    this.startLevel(level);
                } else {
                    // Show locked message
                    console.log('Level locked, showing message');
                    this.showLockedMessage(level);
                }
            });
        });
        
        document.getElementById('level-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        // Game screen
        document.getElementById('game-menu-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
            this.gameEngine.stop();
        });
        
        // Other back buttons
        document.getElementById('challenge-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('load-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('almanac-back-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        // End game screen
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            if (this.currentLevel) {
                this.startLevel(this.currentLevel);
            }
        });
        
        document.getElementById('main-menu-btn')?.addEventListener('click', () => {
            this.showScreen('main-menu');
        });
    }
    
    initializePlantSelector() {
        document.querySelectorAll('.plant-card').forEach(card => {
            if (!card.classList.contains('shovel-card')) {
                card.addEventListener('click', (e) => {
                    const plantType = e.currentTarget.dataset.plant;
                    const cost = parseInt(e.currentTarget.dataset.cost);
                    
                    if (this.gameEngine.sunCount >= cost) {
                        this.selectPlant(plantType, e.currentTarget);
                    }
                });
            }
        });
        
        // Shovel tool
        document.getElementById('shovel-tool')?.addEventListener('click', (e) => {
            this.selectShovel(e.currentTarget);
        });
    }
    
    selectPlant(plantType, element) {
        // Deselect all cards
        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        
        // Select this card
        element.classList.add('selected');
        this.gameEngine.selectedPlant = plantType;
        this.gameEngine.selectedTool = null;
    }
    
    selectShovel(element) {
        // Deselect all cards
        document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        
        // Select shovel
        element.classList.add('selected');
        this.gameEngine.selectedTool = 'shovel';
        this.gameEngine.selectedPlant = null;
    }
    
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
            this.currentScreen = screenName;
        }
        
        // Background music now plays continuously on all screens
        // No need to stop/start based on screen changes
    }
    
    showLevelSelect() {
        console.log('showLevelSelect called - unlockedLevels:', this.gameState.unlockedLevels);
        this.showScreen('level-select');
        this.updateLevelButtons();
    }
    
    updateLevelButtons() {
        console.log('updateLevelButtons - unlockedLevels:', this.gameState.unlockedLevels);
        document.querySelectorAll('.level-btn').forEach(btn => {
            const level = parseInt(btn.dataset.level);
            const levelConfig = CONFIG.LEVELS[level];
            const isUnlocked = level <= this.gameState.unlockedLevels;
            
            console.log('Level', level, 'isUnlocked:', isUnlocked);
            
            // Add/remove locked class
            if (isUnlocked) {
                btn.classList.remove('locked');
                btn.disabled = false;
            } else {
                btn.classList.add('locked');
                btn.disabled = false; // Keep clickable to show message
            }
            
            // Set button content
            if (levelConfig) {
                const zombieCount = levelConfig.total;
                const healthMult = levelConfig.healthMultiplier;
                btn.title = isUnlocked 
                    ? `${zombieCount} zombies | Health: ${(healthMult * 100).toFixed(0)}%`
                    : `Complete Level ${level - 1} to unlock`;
                
                if (isUnlocked) {
                    btn.innerHTML = `<span class="level-text">Level ${level}</span><span class="level-info">${zombieCount} 🧟</span>`;
                } else {
                    btn.innerHTML = `<span class="lock-icon">🔒</span><span class="level-text">Level ${level}</span><span class="level-info">Locked</span>`;
                }
            }
        });
    }
    
    showLockedMessage(level) {
        // Create or update locked message popup
        let popup = document.getElementById('locked-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'locked-popup';
            popup.className = 'locked-popup';
            document.body.appendChild(popup);
        }
        
        popup.innerHTML = `
            <div class="locked-popup-content">
                <span class="lock-big">🔒</span>
                <h3>Level ${level} Locked!</h3>
                <p>Complete Level ${level - 1} first to unlock this level.</p>
                <button class="popup-close-btn" onclick="this.parentElement.parentElement.classList.remove('show')">OK</button>
            </div>
        `;
        popup.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => popup.classList.remove('show'), 3000);
    }
    
    startLevel(level) {
        this.currentLevel = level;
        this.showScreen('game-screen');
        this.gameEngine.startLevel(level);
    }
    
    showLoadGame() {
        this.showScreen('load-game-screen');
        this.populateSavedGames();
    }
    
    populateSavedGames() {
        const container = document.getElementById('saved-games-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        const savedGames = this.gameState.savedGames;
        
        if (savedGames.length === 0) {
            container.innerHTML = '<p style="text-align: center; padding: 20px;">No saved games found</p>';
            return;
        }
        
        savedGames.forEach(save => {
            const item = createElement('div', { class: 'saved-game-item' }, [
                createElement('div', { class: 'saved-game-info' }, [
                    createElement('div', {}, [`Level ${save.level} - ${save.date}`]),
                    createElement('div', { style: { fontSize: '0.9em', color: '#aaa' } }, [`Sun: ${save.sunCount}, Zombies Killed: ${save.zombiesKilled}`])
                ]),
                createElement('div', { class: 'saved-game-actions' }, [
                    createElement('button', {
                        class: 'load-btn',
                        onClick: () => this.loadSavedGame(save.id)
                    }, ['Load']),
                    createElement('button', {
                        class: 'delete-btn',
                        onClick: () => this.deleteSavedGame(save.id)
                    }, ['Delete'])
                ])
            ]);
            
            container.appendChild(item);
        });
    }
    
    loadSavedGame(saveId) {
        const save = this.gameState.loadGame(saveId);
        if (save) {
            // TODO: Implement game loading from save data
            console.log('Loading game:', save);
            this.startLevel(save.level);
        }
    }
    
    deleteSavedGame(saveId) {
        if (confirm('Are you sure you want to delete this save?')) {
            this.gameState.deleteSave(saveId);
            this.populateSavedGames();
        }
    }
    
    showChallenges() {
        this.showScreen('challenge-screen');
    }
    
    showAlmanac() {
        this.showScreen('almanac-screen');
        this.populateAlmanac();
    }
    
    populateAlmanac() {
        const plantsContainer = document.getElementById('almanac-plants');
        const zombiesContainer = document.getElementById('almanac-zombies');
        if (!plantsContainer || !zombiesContainer) return;
        
        plantsContainer.innerHTML = '';
        zombiesContainer.innerHTML = '';
        
        // Plant data with detailed info
        const plantData = [
            { 
                name: 'Sunflower', 
                img: 'sunflower.png',
                almanacImg: 'almanac/su.png',
                desc: 'Sunflowers are essential for collecting sun to plant more plants.',
                stats: { cost: 50, recharge: 'Fast', toughness: 'Normal' },
                flavor: 'Sunflower can\'t help but sing. She\'s just that happy about herself and her sunny disposition.'
            },
            { 
                name: 'Peashooter', 
                img: 'peashooter.gif',
                almanacImg: 'almanac/pee.png',
                desc: 'Shoots peas at attacking zombies.',
                stats: { cost: 100, recharge: 'Fast', damage: 'Normal' },
                flavor: 'How can a single plant grow and shoot so many peas? Peashooter prefers not to talk about it.'
            },
            { 
                name: 'Repeater', 
                img: 'repeater.gif',
                almanacImg: 'almanac/rep.png',
                desc: 'Shoots two peas at a time for double damage.',
                stats: { cost: 200, recharge: 'Fast', damage: 'Normal (x2)' },
                flavor: 'Repeater is fierce. He\'s from the streets. He doesn\'t take no guff from nobody.'
            },
            { 
                name: 'Wall-nut', 
                img: 'wallnut.png',
                almanacImg: 'almanac/wal.png',
                desc: 'Wall-nuts have hard shells which you can use to protect your plants.',
                stats: { cost: 50, recharge: 'Slow', toughness: 'High' },
                flavor: 'Wall-nut wonders if he\'s crazy or if it\'s just part of being a nut.'
            },
            { 
                name: 'Cherry Bomb', 
                img: 'cherrybomb.png',
                almanacImg: 'almanac/cher.png',
                desc: 'Explodes, destroying all zombies in a 3x3 area.',
                stats: { cost: 150, recharge: 'Very Slow', damage: 'Massive', range: '3x3' },
                flavor: '"I wanna explode," says Cherry #1. "No, let\'s detonate instead," says Cherry #2.'
            },
            { 
                name: 'Jalapeno', 
                img: 'jalapeno.png',
                almanacImg: 'almanac/jal.png',
                desc: 'Destroys all zombies in a lane with a wall of fire.',
                stats: { cost: 125, recharge: 'Very Slow', damage: 'Massive', range: 'Entire lane' },
                flavor: 'Jalapeno is quite the hot head. He\'s been known to clear entire rooms at parties.'
            }
        ];
        
        // Zombie data with detailed info
        const zombieData = [
            { 
                name: 'Normal Zombie', 
                img: 'normalzombie.gif',
                almanacImg: 'almanac/nor.png',
                desc: 'A basic zombie with average health and speed.',
                stats: { toughness: 'Low', speed: 'Basic' },
                flavor: 'This zombie loves brains. He can\'t get enough. Brains, brains, brains.'
            },
            { 
                name: 'Conehead Zombie', 
                img: 'coneheadzombie.gif',
                almanacImg: 'almanac/con.png',
                desc: 'His roadcone makes him twice as tough as normal zombies.',
                stats: { toughness: 'Medium', speed: 'Basic', weakness: 'Magnet-shroom' },
                flavor: 'Conehead Zombie finished second in the Zombie Cone-Wearing Contest.'
            },
            { 
                name: 'Buckethead Zombie', 
                img: 'bucketheadzombie.gif',
                almanacImg: 'almanac/buc.png',
                desc: 'His bucket hat makes him extremely resistant to damage.',
                stats: { toughness: 'High', speed: 'Basic', weakness: 'Magnet-shroom' },
                flavor: 'Buckethead Zombie always wore a bucket. Part of it was to assert his uniqueness. Mostly he just forgot it was there.'
            }
        ];
        
        // Create plant cards
        plantData.forEach((plant, index) => {
            const card = this.createAlmanacCard(plant, 'plant', index);
            plantsContainer.appendChild(card);
        });
        
        // Create zombie cards
        zombieData.forEach((zombie, index) => {
            const card = this.createAlmanacCard(zombie, 'zombie', index);
            zombiesContainer.appendChild(card);
        });
        
        // Store data for detail view
        this.almanacData = { plants: plantData, zombies: zombieData };
        
        // Reset detail panel
        this.showAlmanacDetail(null);
    }
    
    createAlmanacCard(data, type, index) {
        const card = createElement('div', { 
            class: `almanac-card ${type === 'zombie' ? 'zombie-card' : ''}`,
            'data-type': type,
            'data-index': index
        });
        
        const img = createElement('img', {
            src: `assets/images/${data.img}`,
            alt: data.name
        });
        
        card.appendChild(img);
        card.addEventListener('click', () => {
            // Remove selected from all cards
            document.querySelectorAll('.almanac-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            this.showAlmanacDetail(data);
        });
        
        return card;
    }
    
    showAlmanacDetail(data) {
        const detailImage = document.getElementById('detail-image');
        const detailName = document.getElementById('detail-name');
        const detailDesc = document.getElementById('detail-description');
        const detailStats = document.getElementById('detail-stats');
        const detailFlavor = document.getElementById('detail-flavor');
        
        if (!data) {
            detailImage.src = '';
            detailImage.style.display = 'none';
            detailName.textContent = 'Select an item';
            detailDesc.textContent = 'Click on a plant or zombie to see details.';
            detailStats.innerHTML = '';
            detailFlavor.textContent = '';
            return;
        }
        
        detailImage.src = `assets/images/${data.almanacImg || data.img}`;
        detailImage.style.display = 'block';
        detailName.textContent = data.name;
        detailDesc.textContent = data.desc;
        
        // Build stats HTML
        let statsHtml = '';
        if (data.stats) {
            for (const [key, value] of Object.entries(data.stats)) {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                statsHtml += `<p><strong>${label}:</strong> ${value}</p>`;
            }
        }
        detailStats.innerHTML = statsHtml;
        
        detailFlavor.textContent = data.flavor || '';
    }
    
    showEndGame(won, level = 1) {
        const endGameScreen = document.getElementById('end-game-screen');
        
        const title = document.getElementById('end-game-title');
        const message = document.getElementById('end-game-message');
        
        console.log('showEndGame called - won:', won, 'level:', level);
        
        if (won) {
            // Show full-screen level complete image
            this.showLevelCompleteImage(level);
        } else {
            this.showScreen('end-game-screen');
            endGameScreen.classList.remove('victory');
            title.textContent = 'Game Over';
            message.textContent = 'The zombies ate your brains!';
        }
    }
    
    showLevelCompleteImage(level) {
        // Remove existing overlay if any
        const existingOverlay = document.getElementById('level-complete-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        
        // Create full-screen overlay with level complete image
        const overlay = document.createElement('div');
        overlay.id = 'level-complete-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: url('assets/images/level%20complete.png') center center / cover no-repeat;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.5s ease-out;
        `;
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.cssText = `
            position: absolute;
            bottom: 15%;
            display: flex;
            gap: 30px;
            z-index: 10001;
        `;
        
        // Restart button
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Restart Level';
        restartBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 24px;
            font-family: 'Creepster', cursive;
            background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
            border: 4px solid #3d2914;
            border-radius: 10px;
            color: #f5deb3;
            cursor: pointer;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            box-shadow: 0 6px 0 #3d2914, 0 8px 15px rgba(0,0,0,0.4);
            transition: all 0.1s ease;
        `;
        restartBtn.onmouseover = () => restartBtn.style.transform = 'scale(1.05)';
        restartBtn.onmouseout = () => restartBtn.style.transform = 'scale(1)';
        restartBtn.onclick = () => {
            overlay.remove();
            document.getElementById('restart-btn').click();
        };
        
        // Main Menu button
        const menuBtn = document.createElement('button');
        menuBtn.textContent = 'Main Menu';
        menuBtn.style.cssText = `
            padding: 15px 40px;
            font-size: 24px;
            font-family: 'Creepster', cursive;
            background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
            border: 4px solid #3d2914;
            border-radius: 10px;
            color: #f5deb3;
            cursor: pointer;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            box-shadow: 0 6px 0 #3d2914, 0 8px 15px rgba(0,0,0,0.4);
            transition: all 0.1s ease;
        `;
        menuBtn.onmouseover = () => menuBtn.style.transform = 'scale(1.05)';
        menuBtn.onmouseout = () => menuBtn.style.transform = 'scale(1)';
        menuBtn.onclick = () => {
            overlay.remove();
            document.getElementById('main-menu-btn').click();
        };
        
        buttonsContainer.appendChild(restartBtn);
        buttonsContainer.appendChild(menuBtn);
        overlay.appendChild(buttonsContainer);
        
        document.body.appendChild(overlay);
        
        // Unlock next level
        const nextLevel = level + 1;
        console.log('Unlocking next level:', nextLevel, 'Current unlockedLevels:', this.gameState.unlockedLevels);
        this.gameState.unlockLevel(nextLevel);
        console.log('After unlock - unlockedLevels:', this.gameState.unlockedLevels);
    }
}

// Make MenuManager globally accessible
window.MenuManager = MenuManager;
