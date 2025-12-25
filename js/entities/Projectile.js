// Projectile Class (Pea)
class Projectile {
    constructor(x, y, row, damage) {
        this.position = { x, y };
        this.row = row;
        this.damage = damage;
        this.speed = 400; // pixels per second
        this.element = null;
        this.isActive = true;
    }
    
    create() {
        const peaDiv = createElement('div', {
            class: 'projectile',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        this.element = peaDiv;
        return peaDiv;
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Move projectile using deltaTime for frame-rate independent movement
        this.position.x += this.speed * deltaTime;
        if (this.element) {
            this.element.style.left = `${this.position.x}px`;
        }
        
        // Check if off screen
        if (this.position.x > 1024) {
            this.isActive = false;
            return;
        }
        
        // Check for zombie collision
        this.checkZombieCollision();
    }
    
    checkZombieCollision() {
        if (!window.gameEngine) return;
        
        const zombies = window.gameEngine.zombies.filter(z => 
            z.row === this.row && 
            z.isAlive &&
            Math.abs(z.position.x - this.position.x) < 30
        );
        
        if (zombies.length > 0) {
            zombies[0].takeDamage(this.damage);
            this.isActive = false;
            playSound('splat');
        }
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
