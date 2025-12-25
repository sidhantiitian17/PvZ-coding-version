// Main Application Entry Point
(function() {
    'use strict';
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Plants vs Zombies - Web Edition');
        console.log('Initializing game...');
        
        try {
            // Initialize core systems
            const gameState = new GameState();
            gameState.loadProgress();
            
            const gameEngine = new GameEngine();
            window.gameEngine = gameEngine;
            
            const menuManager = new MenuManager(gameEngine, gameState);
            window.menuManager = menuManager;
            
            const editorManager = new EditorManager();
            window.editorManager = editorManager;
            
            const challengeSystem = new ChallengeSystem(editorManager, gameState);
            window.challengeSystem = challengeSystem;
            
            console.log('Game initialized successfully!');
            
            // Setup grid for clicking
            setupLawnGrid();
            
            // Add keyboard shortcuts
            setupKeyboardShortcuts();
            
            // Handle window resize
            window.addEventListener('resize', debounce(handleResize, 250));
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
            showErrorMessage('Failed to initialize game. Please refresh the page.');
        }
    }
    
    function setupLawnGrid() {
        const lawnGrid = document.getElementById('lawn-grid');
        if (!lawnGrid) return;
        
        // Clear existing cells
        lawnGrid.innerHTML = '';
        
        // Create grid cells
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            for (let col = 0; col < CONFIG.GRID_COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // Add click handler directly on cell
                cell.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const clickedRow = parseInt(cell.dataset.row);
                    const clickedCol = parseInt(cell.dataset.col);
                    console.log('Cell clicked:', clickedRow, clickedCol);
                    
                    if (window.gameEngine) {
                        if (window.gameEngine.selectedTool === 'shovel') {
                            window.gameEngine.removePlant(clickedCol, clickedRow);
                            window.gameEngine.selectedTool = null;
                            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
                        } else if (window.gameEngine.selectedPlant) {
                            window.gameEngine.placePlant(window.gameEngine.selectedPlant, clickedCol, clickedRow);
                            window.gameEngine.selectedPlant = null;
                            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
                        }
                    }
                });
                
                lawnGrid.appendChild(cell);
            }
        }
        console.log('Lawn grid setup complete with', CONFIG.GRID_ROWS * CONFIG.GRID_COLS, 'cells');
    }
    
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape - deselect plant/tool
            if (e.key === 'Escape') {
                if (window.gameEngine) {
                    window.gameEngine.selectedPlant = null;
                    window.gameEngine.selectedTool = null;
                    document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
                }
            }
            
            // P - pause/resume game
            if (e.key === 'p' || e.key === 'P') {
                if (window.gameEngine && window.gameEngine.isRunning) {
                    if (window.gameEngine.isPaused) {
                        window.gameEngine.resume();
                        console.log('Game resumed');
                    } else {
                        window.gameEngine.pause();
                        console.log('Game paused');
                    }
                }
            }
            
            // Number keys 1-6 for plant selection
            if (e.key >= '1' && e.key <= '6') {
                const plantCards = document.querySelectorAll('.plant-card:not(.shovel-card)');
                const index = parseInt(e.key) - 1;
                if (plantCards[index]) {
                    plantCards[index].click();
                }
            }
            
            // S for shovel
            if (e.key === 's' || e.key === 'S') {
                const shovel = document.getElementById('shovel-tool');
                if (shovel) {
                    shovel.click();
                }
            }
        });
    }
    
    function handleResize() {
        // Update canvas size if needed
        if (window.gameEngine && window.gameEngine.canvas) {
            const lawn = document.getElementById('lawn');
            if (lawn) {
                const rect = lawn.getBoundingClientRect();
                window.gameEngine.canvas.width = rect.width;
                window.gameEngine.canvas.height = rect.height;
            }
        }
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.95);
            color: white;
            padding: 30px;
            border-radius: 10px;
            font-size: 1.2em;
            z-index: 10000;
            text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    // Expose utility for debugging
    window.PVZ = {
        getGameEngine: () => window.gameEngine,
        getMenuManager: () => window.menuManager,
        getGameState: () => window.gameState,
        getChallengeSystem: () => window.challengeSystem,
        debug: {
            addSun: (amount) => {
                if (window.gameEngine) {
                    window.gameEngine.addSun(amount);
                    console.log('Added sun:', amount, 'Total:', window.gameEngine.sunCount);
                }
            },
            spawnZombie: (type = 'normal', row = 2) => {
                if (window.gameEngine && window.gameEngine.lawn) {
                    const zombie = createZombie(type, row);
                    window.gameEngine.zombies.push(zombie);
                    window.gameEngine.lawn.appendChild(zombie.create());
                    console.log('Spawned zombie:', type, 'at row:', row);
                }
            },
            clearZombies: () => {
                if (window.gameEngine) {
                    window.gameEngine.zombies.forEach(z => z.destroy());
                    window.gameEngine.zombies = [];
                    console.log('Cleared all zombies');
                }
            },
            selectPlant: (type) => {
                if (window.gameEngine) {
                    window.gameEngine.selectedPlant = type;
                    console.log('Selected plant:', type);
                }
            },
            placePlant: (type, col, row) => {
                if (window.gameEngine) {
                    window.gameEngine.placePlant(type, col, row);
                }
            },
            status: () => {
                if (window.gameEngine) {
                    console.log('isRunning:', window.gameEngine.isRunning);
                    console.log('isPaused:', window.gameEngine.isPaused);
                    console.log('sunCount:', window.gameEngine.sunCount);
                    console.log('plants:', window.gameEngine.plants.length);
                    console.log('zombies:', window.gameEngine.zombies.length);
                    console.log('selectedPlant:', window.gameEngine.selectedPlant);
                    console.log('level:', window.gameEngine.level);
                }
            }
        }
    };
    
    console.log('Plants vs Zombies loaded! Use PVZ.debug for testing:');
    console.log('  PVZ.debug.status() - Show game status');
    console.log('  PVZ.debug.spawnZombie() - Spawn a zombie');
    console.log('  PVZ.debug.addSun(100) - Add sun');
    console.log('  PVZ.debug.selectPlant("peashooter") - Select plant');
    
})();
