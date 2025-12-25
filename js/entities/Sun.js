// Sun Token Class
class Sun {
    constructor(x, y, value = CONFIG.SUN_VALUE, isFalling = true) {
        this.position = { x, y };
        this.value = value;
        this.isFalling = isFalling;
        this.targetY = isFalling ? y + randomInt(150, 400) : y;
        this.fallSpeed = 60; // pixels per second
        this.element = null;
        this.isActive = true;
        this.lifetime = 10000; // 10 seconds before disappearing
        this.createdAt = performance.now();
    }
    
    create() {
        const sunDiv = createElement('div', {
            class: 'sun-token',
            style: {
                left: `${this.position.x}px`,
                top: `${this.position.y}px`
            }
        });
        
        const img = createElement('img', {
            src: 'assets/images/sun.png',
            alt: 'Sun'
        });
        
        sunDiv.appendChild(img);
        sunDiv.addEventListener('click', () => this.collect());
        
        this.element = sunDiv;
        return sunDiv;
    }
    
    update(deltaTime, currentTime) {
        if (!this.isActive) return;
        
        // Check lifetime
        if (currentTime - this.createdAt > this.lifetime) {
            this.isActive = false;
            return;
        }
        
        // Fall if needed (using deltaTime for smooth animation)
        if (this.isFalling && this.position.y < this.targetY) {
            this.position.y += this.fallSpeed * deltaTime;
            if (this.element) {
                this.element.style.top = `${this.position.y}px`;
            }
        } else {
            this.isFalling = false;
        }
    }
    
    collect() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (window.gameEngine) {
            window.gameEngine.events.emit('sunCollected', this.value);
        }
        playSound('sun_collect');
        this.destroy();
    }
    
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
