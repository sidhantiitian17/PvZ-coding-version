// GameEngine Class - Main game loop and logic
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.lawnGrid = document.getElementById('lawn-grid');
        this.lawn = document.getElementById('lawn');
        
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.lawnmowers = [];
        
        this.sunCount = CONFIG.INITIAL_SUN;
        this.level = null;
        this.isRunning = false;
        this.isPaused = false;
        this.selectedPlant = null;
        this.selectedTool = null;
        this.bossActive = false; // Track if boss is on the field
        
        this.events = new EventEmitter();
        this.animationLoop = new AnimationLoop((dt) => this.update(dt));
        
        this.lastSunSpawn = 0;
        this.lastZombieSpawn = 0;
        this.gameStartTime = 0;
        this.lastDebugTime = 0;
        this.firstZombieSpawned = false; // Track if first zombie has spawned for sound
        
        this.grid = Array(CONFIG.GRID_ROWS).fill(null).map(() => Array(CONFIG.GRID_COLS).fill(null));
        
        // Autosave properties
        this.autosaveInterval = null;
        this.AUTOSAVE_KEY = 'pvz_autosave';
        this.AUTOSAVE_INTERVAL = 5000; // Save every 5 seconds
        
        // Initialize Coding Mode
        this.codingMode = null;
        if (typeof CodingMode !== 'undefined') {
            this.codingMode = new CodingMode(this);
        }
        
        this.setupEventListeners();
        this.initializeCanvas();
        this.setupAutosave();
        
        // Setup resize listener for dynamic grid alignment
        window.addEventListener('resize', () => this.updateGridAlignment());
    }
    
    // Dynamically calculate and update grid alignment based on lawn dimensions
    updateGridAlignment() {
        if (!this.lawn || !this.lawnGrid) return;
        
        const lawnRect = this.lawn.getBoundingClientRect();
        const lawnWidth = lawnRect.width;
        const lawnHeight = lawnRect.height;
        
        // Precise grass area measurements based on Lawn.jpg background
        // Adjusted to match where the visual grass actually starts
        // The grass in the background starts earlier than previously calculated
        
        const grassLeftRatio = 0.12;    // Grass starts at ~12% from left (shifted left by 1 grid)
        const grassTopRatio = 0.105;    // Grass starts at ~10.5% from top  
        const grassRightRatio = 0.66;   // Grass ends at ~66% from left (shifted left by 1 grid)
        const grassBottomRatio = 0.91;  // Grass ends at ~91% from top
        
        // Calculate actual pixel positions
        const gridLeft = Math.round(lawnWidth * grassLeftRatio);
        const gridTop = Math.round(lawnHeight * grassTopRatio);
        const gridRight = Math.round(lawnWidth * grassRightRatio);
        const gridBottom = Math.round(lawnHeight * grassBottomRatio);
        
        const gridWidth = gridRight - gridLeft;
        const gridHeight = gridBottom - gridTop;
        
        const cellWidth = Math.floor(gridWidth / CONFIG.GRID_COLS);
        const cellHeight = Math.floor(gridHeight / CONFIG.GRID_ROWS);
        
        // Update CSS variables on the lawn-grid element
        this.lawnGrid.style.setProperty('--grid-left', `${gridLeft}px`);
        this.lawnGrid.style.setProperty('--grid-top', `${gridTop}px`);
        this.lawnGrid.style.setProperty('--cell-width', `${cellWidth}px`);
        this.lawnGrid.style.setProperty('--cell-height', `${cellHeight}px`);
        
        // Update CONFIG for entity positioning
        CONFIG.CELL_WIDTH = cellWidth;
        CONFIG.CELL_HEIGHT = cellHeight;
        CONFIG.GRID_LEFT_OFFSET = gridLeft;
        CONFIG.GRID_TOP_OFFSET = gridTop;
        
        // Update LANES array for zombie/lawnmower positioning
        for (let i = 0; i < CONFIG.GRID_ROWS; i++) {
            CONFIG.LANES[i] = gridTop + (i * cellHeight);
        }
        
        console.log('Grid aligned:', { 
            lawnSize: { width: lawnWidth, height: lawnHeight },
            gridBounds: { left: gridLeft, top: gridTop, right: gridRight, bottom: gridBottom },
            cellSize: { width: cellWidth, height: cellHeight },
            lanes: CONFIG.LANES 
        });
    }
    
    // Add a visible debug line at the lawn boundary (lawnStartX)
    addDebugBoundaryLine() {
        // Remove existing debug line if any
        const existingLine = document.getElementById('debug-lawn-boundary');
        if (existingLine) existingLine.remove();
        
        // Create vertical line at GRID_LEFT_OFFSET (lawnStartX)
        const debugLine = document.createElement('div');
        debugLine.id = 'debug-lawn-boundary';
        debugLine.style.cssText = `
            position: absolute;
            left: ${CONFIG.GRID_LEFT_OFFSET}px;
            top: 0;
            width: 2px;
            height: 100%;
            background: red;
            z-index: 1000;
            pointer-events: none;
        `;
        
        if (this.lawn) {
            this.lawn.appendChild(debugLine);
        }
    }
    
    initializeCanvas() {
        if (this.canvas) {
            this.canvas.width = 900;
            this.canvas.height = 600;
        }
    }
    
    setupEventListeners() {
        // Plant production events
        this.events.on('sunProduced', (data) => this.spawnSun(data.x, data.y, data.value, false));
        this.events.on('peaShot', (data) => this.spawnProjectile(data));
        this.events.on('cherryBombExplode', (data) => this.handleCherryBombExplosion(data));
        this.events.on('jalapenoExplode', (data) => this.handleJalapenoExplosion(data));
        
        // Game events
        this.events.on('sunCollected', (value) => this.addSun(value));
        this.events.on('zombieKilled', (zombie) => this.handleZombieKilled(zombie));
        this.events.on('zombieReachedHouse', () => this.handleGameOver());
        
        // Grid click events - use lawn-grid directly
        if (this.lawnGrid) {
            this.lawnGrid.addEventListener('click', (e) => this.handleGridClick(e));
            console.log('Grid click handler attached to lawn-grid');
        }
        
        // Also add click handler to lawn as backup
        if (this.lawn) {
            this.lawn.addEventListener('click', (e) => {
                // Only handle if click is not on lawn-grid
                if (e.target === this.lawn || e.target.id === 'game-canvas') {
                    this.handleLawnClick(e);
                }
            });
        }
    }
    
    handleLawnClick(event) {
        // Calculate grid position from lawn click
        const rect = this.lawn.getBoundingClientRect();
        const x = event.clientX - rect.left - 30; // Offset for lawn-grid left position
        const y = event.clientY - rect.top - 20;  // Offset for lawn-grid top position
        
        const col = Math.floor(x / (CONFIG.CELL_WIDTH + 2));
        const row = Math.floor(y / (CONFIG.CELL_HEIGHT + 2));
        
        if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) {
            return;
        }
        
        if (this.selectedPlant) {
            this.placePlant(this.selectedPlant, col, row);
            this.selectedPlant = null;
            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        }
    }
    
    startLevel(levelNumber) {
        this.reset();
        this.level = new Level(levelNumber);
        this.isRunning = true;
        this.gameStartTime = performance.now();
        
        // Re-acquire DOM references (in case they were lost)
        this.lawn = document.getElementById('lawn');
        this.lawnGrid = document.getElementById('lawn-grid');
        
        // Calculate and apply grid alignment BEFORE positioning any entities
        this.updateGridAlignment();
        
        // Add debug line at lawnStartX (left edge of grid)
        this.addDebugBoundaryLine();
        
        // Reset challenge pool for unique challenges
        if (typeof resetChallengePool === 'function') {
            resetChallengePool();
        }
        
        // Initialize timestamps to current time
        const now = performance.now();
        this.lastSunSpawn = now;
        this.lastZombieSpawn = now;
        
        // Initialize lawnmowers (now using updated CONFIG.LANES)
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            const mower = new LawnMower(row);
            this.lawnmowers.push(mower);
            if (this.lawn) {
                const mowerElement = mower.create();
                this.lawn.appendChild(mowerElement);
            }
        }
        
        // Start the game loop
        this.animationLoop.start();
        
        // Update UI
        this.updateSunDisplay();
        
        // Spawn first zombie quickly (after 2 seconds)
        const zombieDelay = 2000;
        setTimeout(() => {
            if (this.isRunning && this.level && this.level.hasMoreZombies()) {
                this.spawnZombie();
                this.lastZombieSpawn = performance.now();
            }
        }, zombieDelay);
        
        // Spawn first sun quickly too (after 1 second)
        const sunDelay = 1000;
        setTimeout(() => {
            if (this.isRunning) {
                this.spawnFallingSun();
                this.lastSunSpawn = performance.now();
            }
        }, sunDelay);
        
        // Start autosave interval
        this.startAutosaveInterval();
    }
    
    reset() {
        // Clean up all entities
        this.plants.forEach(p => p.destroy());
        this.zombies.forEach(z => z.destroy());
        this.projectiles.forEach(p => p.destroy());
        this.suns.forEach(s => s.destroy());
        this.lawnmowers.forEach(m => m.destroy());
        
        this.plants = [];
        this.zombies = [];
        this.projectiles = [];
        this.suns = [];
        this.lawnmowers = [];
        
        this.sunCount = CONFIG.INITIAL_SUN;
        this.selectedPlant = null;
        this.selectedTool = null;
        this.firstZombieSpawned = false;
        this.grid = Array(CONFIG.GRID_ROWS).fill(null).map(() => Array(CONFIG.GRID_COLS).fill(null));
        
        this.lastSunSpawn = 0;
        this.lastZombieSpawn = 0;
    }
    
    update(deltaTime) {
        if (!this.isRunning || this.isPaused) return;
        
        const currentTime = performance.now();
        
        // Spawn falling suns
        if (currentTime - this.lastSunSpawn > CONFIG.SUN_FALL_INTERVAL) {
            this.spawnFallingSun();
            this.lastSunSpawn = currentTime;
        }
        
        // Spawn zombies
        const spawnInterval = (this.level && this.level.config.spawnInterval) || CONFIG.ZOMBIE_SPAWN_INTERVAL;
        if (currentTime - this.lastZombieSpawn > spawnInterval) {
            if (this.level && this.level.hasMoreZombies()) {
                // Check if we should spawn a boss
                if (this.level.shouldSpawnBoss()) {
                    this.spawnBossZombie();
                } else {
                    this.spawnZombie();
                }
                this.lastZombieSpawn = currentTime;
            }
        }
        
        // Update all entities
        this.plants.forEach(plant => plant.update(deltaTime, currentTime));
        this.zombies.forEach(zombie => zombie.update(deltaTime, currentTime));
        this.projectiles.forEach(projectile => projectile.update(deltaTime));
        this.suns.forEach(sun => sun.update(deltaTime, currentTime));
        this.lawnmowers.forEach(mower => mower.update(deltaTime));
        
        // Update coding mode (player code execution happens here)
        if (this.codingMode) {
            this.codingMode.update();
        }
        
        // Remove inactive entities
        this.cleanupDeadEntities();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Check win condition
        if (this.level && this.level.isComplete() && this.zombies.filter(z => z.isAlive).length === 0) {
            this.handleLevelComplete();
        }
    }
    
    spawnFallingSun() {
        // Spawn sun within the visible lawn area (after lawnmower area, before edge)
        const x = randomInt(150, 750);
        const y = 0;
        this.spawnSun(x, y, CONFIG.SUN_VALUE, true);
    }
    
    spawnSun(x, y, value, isFalling) {
        const sun = new Sun(x, y, value, isFalling);
        this.suns.push(sun);
        
        // Ensure lawn reference is current
        if (!this.lawn) {
            this.lawn = document.getElementById('lawn');
        }
        
        if (this.lawn) {
            const sunElement = sun.create();
            this.lawn.appendChild(sunElement);
        }
    }
    
    spawnZombie() {
        const zombieType = this.level.getNextZombie();
        if (zombieType !== null) {
            // Play "zombies are coming" sound for first zombie
            if (!this.firstZombieSpawned) {
                this.firstZombieSpawned = true;
                playSound('zombies_are_coming');
            }
            
            const row = randomInt(0, CONFIG.GRID_ROWS - 1);
            
            // Spawn zombie from the right edge of the lawn (off-screen)
            const lawnRect = this.lawn.getBoundingClientRect();
            const spawnX = lawnRect.width + 50; // Start just outside the right edge
            
            const zombie = createZombie(zombieType, row, spawnX);
            
            // Apply level health multiplier
            const healthMultiplier = this.level.config.healthMultiplier || 1.0;
            zombie.health = Math.round(zombie.health * healthMultiplier);
            zombie.maxHealth = zombie.health;
            
            // Apply level speed multiplier (slower in early levels for beginners)
            const speedMultiplier = this.level.config.speedMultiplier || 1.0;
            zombie.speed = zombie.speed * speedMultiplier;
            zombie.baseSpeed = zombie.speed;
            
            // If boss is active, slow down this zombie too
            if (this.bossActive) {
                zombie.speed = zombie.speed * 0.6;
                zombie.baseSpeed = zombie.speed;
                console.log(`Zombie spawned (BOSS ACTIVE - slowed) - Final speed: ${zombie.speed}`);
            } else {
                console.log(`Zombie spawned - Level ${this.level.currentLevel}, Speed multiplier: ${speedMultiplier}, Final speed: ${zombie.speed}`);
            }
            
            this.zombies.push(zombie);
            
            // Ensure lawn reference is current
            if (!this.lawn) {
                this.lawn = document.getElementById('lawn');
            }
            
            if (this.lawn) {
                const zombieElement = zombie.create();
                this.lawn.appendChild(zombieElement);
            }
        }
    }
    
    spawnBossZombie() {
        console.log('🔥🔥🔥 BOSS ZOMBIE INCOMING! 🔥🔥🔥');
        
        // Mark boss as spawned in level
        this.level.spawnBoss();
        
        // Mark that boss is active - slow down other zombies
        this.bossActive = true;
        
        // Slow down all existing zombies by 40%
        this.zombies.forEach(zombie => {
            if (zombie.type !== 'boss') {
                zombie.speed = zombie.speed * 0.6;
                zombie.baseSpeed = zombie.speed;
                console.log(`Slowed zombie to speed: ${zombie.speed}`);
            }
        });
        
        const row = Math.floor(CONFIG.GRID_ROWS / 2); // Boss spawns in middle lane
        
        // Spawn from right edge
        const lawnRect = this.lawn.getBoundingClientRect();
        const spawnX = lawnRect.width + 100; // Start further off screen
        
        const boss = createZombie('boss', row, spawnX);
        
        // Boss doesn't get multipliers - already has massive stats
        console.log(`BOSS spawned with ${boss.health} HP!`);
        
        this.zombies.push(boss);
        
        if (!this.lawn) {
            this.lawn = document.getElementById('lawn');
        }
        
        if (this.lawn) {
            const bossElement = boss.create();
            this.lawn.appendChild(bossElement);
        }
        
        // Show boss warning
        this.showBossWarning();
    }
    
    showBossWarning() {
        // Create boss warning overlay
        const warning = document.createElement('div');
        warning.className = 'boss-warning';
        warning.innerHTML = `
            <div class="boss-warning-text">
                ⚠️ BOSS INCOMING! ⚠️
                <br>
                <span>Solve the 🔥 CODING CHALLENGE to defeat!</span>
            </div>
        `;
        document.body.appendChild(warning);
        
        // Remove after animation
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }
    
    spawnProjectile(data) {
        const projectile = new Projectile(data.x, data.y, data.row, data.damage);
        this.projectiles.push(projectile);
        if (this.lawn) {
            this.lawn.appendChild(projectile.create());
        }
        playSound('pea_shoot');
    }
    
    handleCherryBombExplosion(data) {
        console.log('Cherry Bomb explosion at', data.col, data.row);
        
        // Create explosion visual effect
        this.createExplosionEffect(data.col, data.row, 'cherry-bomb');
        
        // Damage all zombies in range
        this.zombies.forEach(zombie => {
            const zombieCol = Math.floor((zombie.position.x - CONFIG.GRID_LEFT_OFFSET) / CONFIG.CELL_WIDTH);
            if (Math.abs(zombie.row - data.row) <= data.range &&
                Math.abs(zombieCol - data.col) <= data.range) {
                console.log('Damaging zombie at row', zombie.row);
                zombie.takeDamage(data.damage);
            }
        });
    }
    
    handleJalapenoExplosion(data) {
        console.log('Jalapeno explosion at row', data.row);
        
        // Create fire trail effect
        this.createExplosionEffect(0, data.row, 'jalapeno');
        
        // Damage all zombies in the row
        this.zombies.forEach(zombie => {
            if (zombie.row === data.row) {
                console.log('Damaging zombie at row', zombie.row);
                zombie.takeDamage(data.damage);
            }
        });
    }
    
    createExplosionEffect(col, row, type) {
        const effect = document.createElement('div');
        effect.className = `explosion-effect ${type}-explosion`;
        
        if (type === 'cherry-bomb') {
            const pos = gridToPixel(col, row);
            effect.style.left = `${pos.x - 40}px`;
            effect.style.top = `${pos.y - 40}px`;
        } else if (type === 'jalapeno') {
            const pos = gridToPixel(0, row);
            effect.style.left = `0px`;
            effect.style.top = `${pos.y}px`;
            effect.style.width = '100%';
        }
        
        if (this.lawn) {
            this.lawn.appendChild(effect);
            setTimeout(() => {
                if (effect.parentNode) {
                    effect.parentNode.removeChild(effect);
                }
            }, 1000);
        }
    }
    
    handleGridClick(event) {
        const rect = this.lawnGrid.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Grid has gap of 2px between cells
        const col = Math.floor(x / (CONFIG.CELL_WIDTH + 2));
        const row = Math.floor(y / (CONFIG.CELL_HEIGHT + 2));
        
        if (col < 0 || col >= CONFIG.GRID_COLS || row < 0 || row >= CONFIG.GRID_ROWS) {
            return;
        }
        
        // Handle shovel tool
        if (this.selectedTool === 'shovel') {
            this.removePlant(col, row);
            this.selectedTool = null;
            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
            return;
        }
        
        // Handle plant placement
        if (this.selectedPlant) {
            console.log('Attempting to place plant:', this.selectedPlant, 'at', col, row);
            this.placePlant(this.selectedPlant, col, row);
            this.selectedPlant = null;
            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        } else {
            console.log('No plant selected');
        }
    }
    
    placePlant(plantType, col, row) {
        console.log('placePlant called:', plantType, col, row);
        
        // Check if cell is empty
        if (this.grid[row] && this.grid[row][col]) {
            console.log('Cell already occupied');
            return;
        }
        
        // Check if player has enough sun
        const cost = CONFIG.PLANT_COSTS[plantType];
        console.log('Cost:', cost, 'Sun count:', this.sunCount);
        if (this.sunCount < cost) {
            console.log('Not enough sun');
            return;
        }
        
        // Place the plant
        const plant = createPlant(plantType, col, row);
        console.log('Created plant:', plant);
        this.plants.push(plant);
        this.grid[row][col] = plant;
        
        if (this.lawn) {
            const plantElement = plant.create();
            console.log('Plant element:', plantElement);
            this.lawn.appendChild(plantElement);
        }
        
        // Deduct sun cost
        this.addSun(-cost);
        
        // Play appropriate sound based on plant type
        if (plantType === 'cherrybomb') {
            playSound('cherrybomb');
        } else if (plantType === 'jalapeno') {
            playSound('jalapeno');
        } else {
            playSound('plant');
        }
        console.log('Plant placed successfully!');
    }
    
    removePlant(col, row) {
        const plant = this.grid[row][col];
        if (plant) {
            plant.isAlive = false;
            plant.destroy();
            this.grid[row][col] = null;
            this.plants = this.plants.filter(p => p !== plant);
            playSound('shovel');
        }
    }
    
    addSun(amount) {
        this.sunCount += amount;
        this.updateSunDisplay();
    }
    
    updateSunDisplay() {
        const sunDisplay = document.getElementById('sun-count');
        if (sunDisplay) {
            sunDisplay.textContent = this.sunCount;
        }
    }
    
    updateProgressBar() {
        if (!this.level) return;
        
        const progress = this.level.getProgress() * 100;
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }
    
    cleanupDeadEntities() {
        this.plants = this.plants.filter(p => {
            if (!p.isAlive) {
                p.destroy();
                const pos = pixelToGrid(p.position.x, p.position.y);
                if (pos.row >= 0 && pos.col >= 0) {
                    this.grid[pos.row][pos.col] = null;
                }
                return false;
            }
            return true;
        });
        
        this.zombies = this.zombies.filter(z => {
            if (!z.isAlive) {
                // Check if boss died
                if (z.type === 'boss') {
                    this.bossActive = false;
                    console.log('🎉 BOSS DEFEATED! Zombie speed returns to normal for new spawns.');
                }
                z.destroy();
                return false;
            }
            return true;
        });
        
        this.projectiles = this.projectiles.filter(p => {
            if (!p.isActive) {
                p.destroy();
                return false;
            }
            return true;
        });
        
        this.suns = this.suns.filter(s => {
            if (!s.isActive) {
                s.destroy();
                return false;
            }
            return true;
        });
        
        this.lawnmowers = this.lawnmowers.filter(m => {
            if (!m.isActive) {
                m.destroy();
                return false;
            }
            return true;
        });
    }
    
    handleZombieKilled(zombie) {
        if (this.level) {
            this.level.recordKill();
        }
    }
    
    handleLevelComplete() {
        this.isRunning = false;
        this.animationLoop.stop();
        this.stopAutosaveInterval();
        this.clearAutosave(); // Clear autosave on level complete
        
        const levelNumber = this.level ? this.level.levelNumber : 1;
        console.log('handleLevelComplete - levelNumber:', levelNumber);
        
        // Show win screen
        if (window.menuManager) {
            window.menuManager.showEndGame(true, levelNumber);
        }
    }
    
    handleGameOver() {
        this.isRunning = false;
        this.animationLoop.stop();
        this.stopAutosaveInterval();
        this.clearAutosave(); // Clear autosave on game over
        
        // Play game over scream sound
        playSound('gameover');
        
        // Show lose screen
        if (window.menuManager) {
            window.menuManager.showEndGame(false);
        }
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        this.isRunning = false;
        this.animationLoop.stop();
        this.stopAutosaveInterval();
        this.clearAutosave();
        
        // Cleanup coding mode
        if (this.codingMode) {
            this.codingMode.destroy();
        }
        
        this.reset();
    }
    
    // ============ AUTOSAVE SYSTEM ============
    
    setupAutosave() {
        // Save on page unload/refresh
        window.addEventListener('beforeunload', () => {
            if (this.isRunning) {
                this.performAutosave();
            }
        });
        
        // Also save on visibility change (tab switch, minimize)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isRunning) {
                this.performAutosave();
            }
        });
    }
    
    startAutosaveInterval() {
        this.stopAutosaveInterval(); // Clear any existing interval
        this.autosaveInterval = setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.performAutosave();
            }
        }, this.AUTOSAVE_INTERVAL);
    }
    
    stopAutosaveInterval() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
            this.autosaveInterval = null;
        }
    }
    
    performAutosave() {
        if (!this.level || !this.isRunning) return;
        
        const saveData = {
            timestamp: Date.now(),
            levelNumber: this.level.levelNumber,
            sunCount: this.sunCount,
            plants: this.plants.map(p => ({
                type: p.type,
                col: p.col,
                row: p.row,
                health: p.health
            })),
            zombies: this.zombies.filter(z => z.isAlive).map(z => ({
                type: z.type,
                row: z.row,
                x: z.x,
                health: z.health
            })),
            lawnmowersActive: this.lawnmowers.map(m => ({
                row: m.row,
                isActive: m.isActive,
                isTriggered: m.isTriggered
            })),
            levelProgress: {
                zombiesSpawned: this.level.zombiesSpawned,
                zombiesKilled: this.level.zombiesKilled
            },
            gameTime: performance.now() - this.gameStartTime
        };
        
        Storage.save(this.AUTOSAVE_KEY, saveData);
        console.log('Game autosaved at', new Date().toLocaleTimeString());
    }
    
    hasAutosave() {
        const saveData = Storage.load(this.AUTOSAVE_KEY);
        if (!saveData) return false;
        
        // Check if autosave is recent (within 24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        return (Date.now() - saveData.timestamp) < maxAge;
    }
    
    getAutosaveInfo() {
        return Storage.load(this.AUTOSAVE_KEY);
    }
    
    clearAutosave() {
        Storage.remove(this.AUTOSAVE_KEY);
        console.log('Autosave cleared');
    }
    
    restoreFromAutosave() {
        const saveData = Storage.load(this.AUTOSAVE_KEY);
        if (!saveData) {
            console.log('No autosave data found');
            return false;
        }
        
        console.log('Restoring from autosave:', saveData);
        
        // Reset and start the level
        this.reset();
        this.level = new Level(saveData.levelNumber);
        this.isRunning = true;
        this.gameStartTime = performance.now() - saveData.gameTime;
        
        // Re-acquire DOM references
        this.lawn = document.getElementById('lawn');
        this.lawnGrid = document.getElementById('lawn-grid');
        
        // Calculate and apply grid alignment
        this.updateGridAlignment();
        this.addDebugBoundaryLine();
        
        // Restore sun count
        this.sunCount = saveData.sunCount;
        this.updateSunDisplay();
        
        // Restore level progress
        if (saveData.levelProgress) {
            this.level.zombiesSpawned = saveData.levelProgress.zombiesSpawned;
            this.level.zombiesKilled = saveData.levelProgress.zombiesKilled;
        }
        
        // Initialize timestamps
        const now = performance.now();
        this.lastSunSpawn = now;
        this.lastZombieSpawn = now;
        
        // Restore lawnmowers
        for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
            const savedMower = saveData.lawnmowersActive.find(m => m.row === row);
            if (savedMower && savedMower.isActive && !savedMower.isTriggered) {
                const mower = new LawnMower(row);
                this.lawnmowers.push(mower);
                if (this.lawn) {
                    const mowerElement = mower.create();
                    this.lawn.appendChild(mowerElement);
                }
            }
        }
        
        // Restore plants
        saveData.plants.forEach(plantData => {
            const plant = createPlant(plantData.type, plantData.col, plantData.row, this.events);
            if (plant) {
                plant.health = plantData.health;
                this.plants.push(plant);
                this.grid[plantData.row][plantData.col] = plant;
                if (this.lawnGrid) {
                    const plantElement = plant.create();
                    this.lawnGrid.appendChild(plantElement);
                }
            }
        });
        
        // Restore zombies
        saveData.zombies.forEach(zombieData => {
            const zombie = createZombie(zombieData.type, zombieData.row, zombieData.x);
            if (zombie) {
                zombie.health = zombieData.health;
                this.zombies.push(zombie);
                if (this.lawn) {
                    const zombieElement = zombie.create();
                    this.lawn.appendChild(zombieElement);
                }
            }
        });
        
        // Start the game loop
        this.animationLoop.start();
        
        // Start autosave interval
        this.startAutosaveInterval();
        
        // Clear the autosave after successful restore
        this.clearAutosave();
        
        console.log('Game restored successfully');
        return true;
    }
}

// Make GameEngine globally accessible
window.GameEngine = GameEngine;
