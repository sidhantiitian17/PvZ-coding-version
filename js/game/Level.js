// Level Class
class Level {
    constructor(levelNumber) {
        this.levelNumber = levelNumber;
        this.config = CONFIG.LEVELS[levelNumber];
        this.zombieQueue = [];
        this.zombiesSpawned = 0;
        this.zombiesKilled = 0;
        this.totalZombies = this.config.total;
        
        // Boss tracking
        this.hasBoss = this.config.hasBoss || false;
        this.bossSpawnAfter = this.config.bossSpawnAfter || 20;
        this.bossCount = this.config.zombies.boss || 0;
        this.bossesSpawned = 0;
        this.bossSpawned = false;
        
        this.initializeZombieQueue();
    }
    
    initializeZombieQueue() {
        // Create array of zombie types based on level config
        const zombies = [];
        
        // Add normal zombies
        for (let i = 0; i < this.config.zombies.normal; i++) {
            zombies.push(0); // 0 = normal
        }
        
        // Add conehead zombies
        for (let i = 0; i < this.config.zombies.conehead; i++) {
            zombies.push(1); // 1 = conehead
        }
        
        // Add buckethead zombies
        for (let i = 0; i < this.config.zombies.buckethead; i++) {
            zombies.push(2); // 2 = buckethead
        }
        
        // Boss zombies are NOT added to queue - they spawn separately based on kills
        
        // Shuffle the zombie queue
        this.zombieQueue = shuffleArray(zombies);
    }
    
    getNextZombie() {
        if (this.zombiesSpawned < this.zombieQueue.length) {
            const zombieType = this.zombieQueue[this.zombiesSpawned];
            this.zombiesSpawned++;
            return zombieType;
        }
        return null;
    }
    
    // Check if boss should spawn
    shouldSpawnBoss() {
        if (!this.hasBoss) return false;
        if (this.bossesSpawned >= this.bossCount) return false;
        
        // TESTING: Spawn boss immediately at the start
        return true;
        
        // Original logic - uncomment after testing:
        // if (this.zombiesKilled < this.bossSpawnAfter) return false;
        // Spawn boss after required kills
        // For multiple bosses, spawn them spaced out
        // const killsPerBoss = Math.floor((this.totalZombies - this.bossCount) / (this.bossCount + 1));
        // const nextBossThreshold = this.bossSpawnAfter + (this.bossesSpawned * killsPerBoss);
        // return this.zombiesKilled >= nextBossThreshold && this.bossesSpawned < this.bossCount;
    }
    
    spawnBoss() {
        this.bossesSpawned++;
        this.bossSpawned = true;
        return 'boss';
    }
    
    hasMoreZombies() {
        // Include boss in the count
        const regularRemaining = this.zombiesSpawned < this.zombieQueue.length;
        const bossRemaining = this.hasBoss && this.bossesSpawned < this.bossCount;
        return regularRemaining || bossRemaining;
    }
    
    getProgress() {
        return this.zombiesKilled / this.totalZombies;
    }
    
    isComplete() {
        return this.zombiesKilled >= this.totalZombies;
    }
    
    recordKill() {
        this.zombiesKilled++;
    }
}
