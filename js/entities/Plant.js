// Plant Base Class
class Plant {
    constructor(type, col, row) {
        this.type = type;
        this.col = col;
        this.row = row;
        this.position = gridToPixel(col, row);
        this.health = CONFIG.PLANT_STATS[type].health;
        this.maxHealth = CONFIG.PLANT_STATS[type].health;
        this.element = null;
        this.lastActionTime = 0;
        this.isAlive = true;
    }
    
    create() {
        const plantDiv = createElement('div', {
            class: 'plant',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        const img = createElement('img', {
            src: `assets/images/${this.type}.${this.type === 'peashooter' || this.type === 'repeater' || this.type === 'sunflower' || this.type === 'jalapeno' ? 'gif' : 'png'}`,
            alt: this.type
        });
        
        plantDiv.appendChild(img);
        this.element = plantDiv;
        
        return plantDiv;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
        this.updateHealthBar();
    }
    
    updateHealthBar() {
        // Health bar rendering is handled by the game engine
    }
    
    update(deltaTime, currentTime) {
        // Base update - override in subclasses
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Sunflower - produces sun
class Sunflower extends Plant {
    constructor(col, row) {
        super('sunflower', col, row);
        this.sunInterval = CONFIG.PLANT_STATS.sunflower.sunInterval;
        this.sunProduction = CONFIG.PLANT_STATS.sunflower.sunProduction;
    }
    
    update(deltaTime, currentTime) {
        if (currentTime - this.lastActionTime >= this.sunInterval) {
            this.produceSun();
            this.lastActionTime = currentTime;
        }
    }
    
    produceSun() {
        // Emit event for sun production
        if (window.gameEngine) {
            window.gameEngine.events.emit('sunProduced', {
                x: this.position.x + 25,
                y: this.position.y,
                value: this.sunProduction
            });
        }
    }
}

// PeaShooter - shoots peas at zombies
class PeaShooter extends Plant {
    constructor(col, row) {
        super('peashooter', col, row);
        this.shootInterval = CONFIG.PLANT_STATS.peashooter.shootInterval;
        this.damage = CONFIG.PLANT_STATS.peashooter.damage;
    }
    
    update(deltaTime, currentTime) {
        if (currentTime - this.lastActionTime >= this.shootInterval) {
            if (this.canShoot()) {
                this.shoot();
                this.lastActionTime = currentTime;
            }
        }
    }
    
    canShoot() {
        // Check if there's a zombie in this row
        if (window.gameEngine) {
            const zombiesInRow = window.gameEngine.zombies.filter(z => 
                z.row === this.row && z.position.x > this.position.x && z.isAlive
            );
            return zombiesInRow.length > 0;
        }
        return false;
    }
    
    shoot() {
        if (window.gameEngine) {
            window.gameEngine.events.emit('peaShot', {
                x: this.position.x + 60,
                y: this.position.y + 30,
                row: this.row,
                damage: this.damage
            });
        }
    }
}

// Repeater - shoots two peas
class Repeater extends Plant {
    constructor(col, row) {
        super('repeater', col, row);
        this.shootInterval = CONFIG.PLANT_STATS.repeater.shootInterval;
        this.damage = CONFIG.PLANT_STATS.repeater.damage;
        this.peas = CONFIG.PLANT_STATS.repeater.peas;
    }
    
    update(deltaTime, currentTime) {
        if (currentTime - this.lastActionTime >= this.shootInterval) {
            if (this.canShoot()) {
                this.shoot();
                this.lastActionTime = currentTime;
            }
        }
    }
    
    canShoot() {
        if (window.gameEngine) {
            const zombiesInRow = window.gameEngine.zombies.filter(z => 
                z.row === this.row && z.position.x > this.position.x && z.isAlive
            );
            return zombiesInRow.length > 0;
        }
        return false;
    }
    
    shoot() {
        if (window.gameEngine) {
            for (let i = 0; i < this.peas; i++) {
                setTimeout(() => {
                    window.gameEngine.events.emit('peaShot', {
                        x: this.position.x + 60,
                        y: this.position.y + 30,
                        row: this.row,
                        damage: this.damage
                    });
                }, i * 150);
            }
        }
    }
}

// Wallnut - defensive plant
class Wallnut extends Plant {
    constructor(col, row) {
        super('wallnut', col, row);
        this.currentState = 'full'; // Track current visual state
    }
    
    create() {
        const plantDiv = createElement('div', {
            class: 'plant',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        const img = createElement('img', {
            src: 'assets/images/walnut_full_life.gif',
            alt: 'wallnut'
        });
        
        plantDiv.appendChild(img);
        this.element = plantDiv;
        
        return plantDiv;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
        }
        this.updateHealthBar();
        this.updateAppearance();
    }
    
    updateAppearance() {
        if (!this.element) return;
        
        const img = this.element.querySelector('img');
        if (!img) return;
        
        const healthPercent = this.health / this.maxHealth;
        let newState = 'full';
        let newSrc = 'assets/images/walnut_full_life.gif';
        
        if (healthPercent <= 0.33) {
            newState = 'dying';
            newSrc = 'assets/images/walnut_dying.gif';
        } else if (healthPercent <= 0.66) {
            newState = 'half';
            newSrc = 'assets/images/walnut_half_life.gif';
        }
        
        // Only update if state changed to avoid reloading gif
        if (this.currentState !== newState) {
            this.currentState = newState;
            img.src = newSrc;
        }
    }
}

// Cherry Bomb - explodes after a delay
class CherryBomb extends Plant {
    constructor(col, row) {
        super('cherrybomb', col, row);
        this.fuseTime = CONFIG.PLANT_STATS.cherrybomb.fuseTime;
        this.damage = CONFIG.PLANT_STATS.cherrybomb.damage;
        this.range = CONFIG.PLANT_STATS.cherrybomb.range;
        this.hasExploded = false;
        this.createdTime = null;
    }
    
    update(deltaTime, currentTime) {
        if (!this.hasExploded) {
            if (this.createdTime === null) {
                this.createdTime = currentTime;
            }
            if (currentTime - this.createdTime >= this.fuseTime) {
                this.explode();
            }
        }
    }
    
    create() {
        const element = super.create();
        element.classList.add('cherry-bomb-fuse');
        return element;
    }
    
    explode() {
        this.hasExploded = true;
        console.log('Cherry Bomb exploding!');
        if (window.gameEngine) {
            window.gameEngine.events.emit('cherryBombExplode', {
                col: this.col,
                row: this.row,
                range: this.range,
                damage: this.damage
            });
        }
        this.isAlive = false;
        playSound('cherrybomb');
    }
}

// Jalapeno - destroys entire lane
class Jalapeno extends Plant {
    constructor(col, row) {
        super('jalapeno', col, row);
        this.fuseTime = CONFIG.PLANT_STATS.jalapeno.fuseTime;
        this.damage = CONFIG.PLANT_STATS.jalapeno.damage;
        this.hasExploded = false;
        this.createdTime = null;
    }
    
    update(deltaTime, currentTime) {
        if (!this.hasExploded) {
            if (this.createdTime === null) {
                this.createdTime = currentTime;
            }
            if (currentTime - this.createdTime >= this.fuseTime) {
                this.explode();
            }
        }
    }
    
    create() {
        const element = super.create();
        element.classList.add('jalapeno-fuse');
        return element;
    }
    
    explode() {
        this.hasExploded = true;
        console.log('Jalapeno exploding!');
        if (window.gameEngine) {
            window.gameEngine.events.emit('jalapenoExplode', {
                row: this.row,
                damage: this.damage
            });
        }
        this.isAlive = false;
        playSound('jalapeno');
    }
}

// Plant Factory
function createPlant(type, col, row) {
    switch(type) {
        case 'sunflower':
            return new Sunflower(col, row);
        case 'peashooter':
            return new PeaShooter(col, row);
        case 'repeater':
            return new Repeater(col, row);
        case 'wallnut':
            return new Wallnut(col, row);
        case 'cherrybomb':
            return new CherryBomb(col, row);
        case 'jalapeno':
            return new Jalapeno(col, row);
        default:
            return new Plant(type, col, row);
    }
}
