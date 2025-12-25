// GameState Class - Handles save/load functionality
class GameState {
    constructor() {
        this.currentLevel = 1;
        this.unlockedLevels = 1; // Only first level unlocked by default
        this.completedChallenges = [];
        this.savedGames = this.loadSavedGames();
        this.loadProgress(); // Load saved progress on initialization
    }
    
    loadSavedGames() {
        const saved = Storage.load('pvz_saved_games') || [];
        return saved;
    }
    
    saveSavedGames() {
        Storage.save('pvz_saved_games', this.savedGames);
    }
    
    saveGame(gameData) {
        const saveId = generateId();
        const saveData = {
            id: saveId,
            level: gameData.level,
            sunCount: gameData.sunCount,
            plants: gameData.plants.map(p => ({
                type: p.type,
                col: p.col,
                row: p.row,
                health: p.health
            })),
            zombiesKilled: gameData.zombiesKilled,
            timestamp: Date.now(),
            date: new Date().toLocaleString()
        };
        
        this.savedGames.push(saveData);
        this.saveSavedGames();
        return saveId;
    }
    
    loadGame(saveId) {
        const save = this.savedGames.find(s => s.id === saveId);
        if (save) {
            return save;
        }
        return null;
    }
    
    deleteSave(saveId) {
        this.savedGames = this.savedGames.filter(s => s.id !== saveId);
        this.saveSavedGames();
    }
    
    clearAllSaves() {
        this.savedGames = [];
        this.saveSavedGames();
    }
    
    unlockLevel(level) {
        console.log('unlockLevel called with:', level, 'current:', this.unlockedLevels);
        if (level > this.unlockedLevels && level <= 10) {
            this.unlockedLevels = level;
            this.saveProgress();
            console.log('Level unlocked! New unlockedLevels:', this.unlockedLevels);
        }
    }
    
    completeChallenge(challengeId) {
        if (!this.completedChallenges.includes(challengeId)) {
            this.completedChallenges.push(challengeId);
            this.saveProgress();
        }
    }
    
    isChallengeCompleted(challengeId) {
        return this.completedChallenges.includes(challengeId);
    }
    
    saveProgress() {
        Storage.save('pvz_progress', {
            unlockedLevels: this.unlockedLevels,
            completedChallenges: this.completedChallenges
        });
    }
    
    loadProgress() {
        const progress = Storage.load('pvz_progress');
        if (progress) {
            this.unlockedLevels = progress.unlockedLevels || 1;
            this.completedChallenges = progress.completedChallenges || [];
        }
    }
}
