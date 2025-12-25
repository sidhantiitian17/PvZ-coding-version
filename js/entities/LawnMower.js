// LawnMower Class
class LawnMower {
    constructor(row) {
        this.row = row;
        this.element = null;
        this.isActive = true;
        this.isTriggered = false;
        this.speed = 5;
        
        // Mower dimensions (from CSS)
        this.width = 60;
        this.height = 60;
        
        // Position will be set when create() is called, using latest CONFIG values
        this.position = { x: 0, y: 0 };
    }
    
    // Calculate position based on current CONFIG (called after grid alignment)
    calculatePosition() {
        // Position mower closer to the grid start (red line)
        const grassStartX = CONFIG.GRID_LEFT_OFFSET;
        const mowerX = grassStartX - CONFIG.CELL_WIDTH * 0.5;
        
        // Vertically center mower within its row
        const rowTopY = CONFIG.LANES[this.row];
        const cellHeight = CONFIG.CELL_HEIGHT;
        const mowerY = rowTopY + (cellHeight - this.height) / 2;
        
        this.position = { 
            x: Math.max(0, mowerX),  // Ensure not negative
            y: mowerY 
        };
        
        console.log(`Mower row ${this.row}: x=${this.position.x}, rightEdge=${this.position.x + this.width}, grassStartX=${grassStartX}`);
        
        return this.position;
    }
    
    create() {
        // Calculate position using current CONFIG values
        this.calculatePosition();
        
        const mowerDiv = createElement('div', {
            class: 'lawnmower',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        const img = createElement('img', {
            src: 'assets/images/lawnmowerIdle.gif',
            alt: 'Lawnmower'
        });
        
        mowerDiv.appendChild(img);
        this.element = mowerDiv;
        
        return mowerDiv;
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        if (!this.isTriggered) {
            this.checkZombieCollision();
        } else {
            this.move();
        }
    }
    
    checkZombieCollision() {
        if (!window.gameEngine) return;
        
        // Trigger when zombie reaches the lawn boundary (left edge of grid)
        const triggerX = CONFIG.GRID_LEFT_OFFSET + 10; // Small buffer inside grid
        
        const zombies = window.gameEngine.zombies.filter(z => 
            z.row === this.row && 
            z.isAlive &&
            z.position.x < triggerX &&
            z.type !== 'boss' // Boss zombies don't trigger lawnmower
        );
        
        if (zombies.length > 0) {
            this.trigger();
        }
    }
    
    trigger() {
        if (this.isTriggered) return;
        
        this.isTriggered = true;
        playSound('lawnmower');
    }
    
    move() {
        this.position.x += this.speed;
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
        }
        
        // Kill zombies in path
        if (window.gameEngine) {
            // Handle boss zombies separately - they take 50% damage per lawnmower hit
            const bossZombies = window.gameEngine.zombies.filter(z => 
                z.row === this.row && 
                z.isAlive &&
                z.type === 'boss' &&
                Math.abs(z.position.x - this.position.x) < 60
            );
            
            bossZombies.forEach(boss => {
                if (!boss.lawnmowerHitCount) {
                    boss.lawnmowerHitCount = 0;
                }
                boss.lawnmowerHitCount++;
                
                if (boss.lawnmowerHitCount >= 2) {
                    // Second hit - kill the boss
                    boss.health = 0;
                    boss.isAlive = false;
                    if (window.gameEngine) {
                        window.gameEngine.events.emit('zombieKilled', boss);
                        window.gameEngine.events.emit('bossKilled', boss);
                    }
                    playSound('zombiedeath');
                    console.log('Boss killed by second lawnmower hit!');
                    if (boss.laneHighlight) {
                        boss.laneHighlight.remove();
                    }
                } else {
                    // First hit - reduce to 50% health
                    boss.health = boss.maxHealth * 0.5;
                    boss.updateHealthBar();
                    console.log('Boss hit by lawnmower! Health reduced to 50%');
                }
            });
            
            // Regular zombies
            const zombies = window.gameEngine.zombies.filter(z => 
                z.row === this.row && 
                z.isAlive &&
                z.type !== 'boss' &&
                Math.abs(z.position.x - this.position.x) < 40
            );
            
            zombies.forEach(zombie => {
                zombie.takeDamage(10000); // Instant kill
            });
        }
        
        // Check if off screen
        if (this.position.x > 1024) {
            this.isActive = false;
        }
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
