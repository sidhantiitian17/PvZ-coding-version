// Utility Functions

// Get a random integer between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get a random element from an array
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Check collision between two rectangles
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Clamp a value between min and max
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Convert grid position to pixel coordinates
// Uses CONFIG values that are dynamically updated by GameEngine.updateGridAlignment()
function gridToPixel(col, row) {
    const leftOffset = CONFIG.GRID_LEFT_OFFSET;
    const topOffset = CONFIG.GRID_TOP_OFFSET;
    const cellWidth = CONFIG.CELL_WIDTH;
    const cellHeight = CONFIG.CELL_HEIGHT;
    
    return {
        x: leftOffset + col * cellWidth + (cellWidth * 0.06), // Small offset to center plant
        y: topOffset + row * cellHeight + (cellHeight * 0.1)  // Small offset from top of cell
    };
}

// Convert pixel coordinates to grid position
function pixelToGrid(x, y) {
    const leftOffset = CONFIG.GRID_LEFT_OFFSET;
    const topOffset = CONFIG.GRID_TOP_OFFSET;
    const cellWidth = CONFIG.CELL_WIDTH;
    const cellHeight = CONFIG.CELL_HEIGHT;
    
    const col = Math.floor((x - leftOffset) / cellWidth);
    const row = Math.floor((y - topOffset) / cellHeight);
    
    // Clamp to valid grid bounds
    return { 
        col: Math.max(0, Math.min(col, CONFIG.GRID_COLS - 1)), 
        row: Math.max(0, Math.min(row, CONFIG.GRID_ROWS - 1))
    };
}

// Load image with promise
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// ============ BACKGROUND MUSIC MANAGER ============
const BackgroundMusic = {
    audio: null,
    normalVolume: 0.25,      // Medium-lower volume level
    duckedVolume: 0.08,      // Lowered volume when other sounds play
    duckDuration: 300,       // Time to duck (ms)
    duckRecovery: 500,       // Time to recover after sound ends (ms)
    isDucked: false,
    duckTimeout: null,
    isInitialized: false,
    
    init() {
        if (this.isInitialized) return;
        
        this.audio = new Audio('assets/images/background.wav');
        this.audio.loop = true;
        this.audio.volume = this.normalVolume;
        this.isInitialized = true;
        
        // Try to play immediately
        this.play();
        
        // Also try to play on first user interaction (for autoplay policy)
        const startOnInteraction = () => {
            this.play();
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('keydown', startOnInteraction);
        };
        document.addEventListener('click', startOnInteraction);
        document.addEventListener('keydown', startOnInteraction);
        
        console.log('Background music initialized');
    },
    
    play() {
        if (!this.audio) this.init();
        this.audio.play().catch(e => {
            console.log('Background music autoplay blocked, waiting for interaction');
        });
    },
    
    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    },
    
    setVolume(volume) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    },
    
    duck() {
        if (!this.audio || this.isDucked) return;
        
        this.isDucked = true;
        
        // Clear any pending recovery
        if (this.duckTimeout) {
            clearTimeout(this.duckTimeout);
        }
        
        // Smoothly lower volume
        this.animateVolume(this.audio.volume, this.duckedVolume, this.duckDuration);
    },
    
    unduck() {
        if (!this.audio) return;
        
        // Clear any pending recovery
        if (this.duckTimeout) {
            clearTimeout(this.duckTimeout);
        }
        
        // Delay before recovering volume
        this.duckTimeout = setTimeout(() => {
            this.isDucked = false;
            // Smoothly restore volume
            this.animateVolume(this.audio.volume, this.normalVolume, this.duckRecovery);
        }, 200);
    },
    
    animateVolume(from, to, duration) {
        const startTime = performance.now();
        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out curve
            const eased = 1 - Math.pow(1 - progress, 2);
            this.audio.volume = from + (to - from) * eased;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }
};

// Make BackgroundMusic globally accessible
window.BackgroundMusic = BackgroundMusic;

// Play sound effect with background music ducking
function playSound(soundName) {
    try {
        // Map sound names to actual file names
        const soundMap = {
            'pea_shoot': 'splat3',
            'sun_collect': 'plant',
            'zombiedeath': 'yuck',
            'chomp': 'chomp',
            'cherrybomb': 'cherrybomb',
            'jalapeno': 'jalapeno',
            'plant': 'plant',
            'shovel': 'chomp',
            'lawnmower': 'lawnmower',
            'splat': 'splat3',
            'select': 'plant',
            'groan': 'groan',
            'zombies_are_coming': 'zombies_are_coming',
            'gameover': 'crazydavescream'
        };
        
        const fileName = soundMap[soundName] || soundName;
        const audio = new Audio(`assets/sounds/${fileName}.wav`);
        audio.volume = 0.3;
        
        // Duck background music while this sound plays
        BackgroundMusic.duck();
        
        // Restore background music when sound ends
        audio.addEventListener('ended', () => {
            BackgroundMusic.unduck();
        });
        
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
        console.log('Sound loading failed:', e);
    }
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Deep clone object
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage helpers
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            return false;
        }
    },
    
    load(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            return null;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Failed to remove from localStorage:', e);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
            return false;
        }
    }
};

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create DOM element with attributes
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Animation frame helper
class AnimationLoop {
    constructor(callback) {
        this.callback = callback;
        this.isRunning = false;
        this.lastTime = 0;
        this.animationId = null;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    loop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.callback(deltaTime);
        this.animationId = requestAnimationFrame(() => this.loop());
    }
}

// Event emitter for game events
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(...args));
    }
    
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}
