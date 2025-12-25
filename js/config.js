// Game Configuration
const CONFIG = {
    // Grid settings - calculated relative to lawn grass area
    GRID_ROWS: 5,
    GRID_COLS: 9,
    CELL_WIDTH: 80,
    CELL_HEIGHT: 100,
    
    // Lawn grass area offsets (relative to lawn div)
    // These define where the playable grass area starts within the lawn element
    LAWN_GRASS_LEFT: 220,   // Where grass starts from left edge of lawn div
    LAWN_GRASS_TOP: 75,     // Where grass starts from top of lawn div  
    LAWN_GRASS_WIDTH: 720,  // Total width of grass area (9 columns)
    LAWN_GRASS_HEIGHT: 500, // Total height of grass area (5 rows)
    
    // Grid positioning (calculated from lawn grass area)
    GRID_LEFT_OFFSET: 220,  // Same as LAWN_GRASS_LEFT
    GRID_TOP_OFFSET: 75,    // Same as LAWN_GRASS_TOP
    
    // Lane positions (Y coordinates) - computed as GRID_TOP_OFFSET + row * CELL_HEIGHT
    LANES: [75, 175, 275, 375, 475],
    
    // Game settings
    INITIAL_SUN: 150,
    SUN_VALUE: 25,
    SUN_FALL_INTERVAL: 8000, // 8 seconds
    ZOMBIE_SPAWN_INTERVAL: 10000, // 10 seconds between zombies
    FIRST_ZOMBIE_DELAY: 3000, // First zombie after 3 seconds (reduced for testing)
    
    // Plant costs
    PLANT_COSTS: {
        sunflower: 50,
        peashooter: 100,
        repeater: 200,
        wallnut: 50,
        cherrybomb: 150,
        jalapeno: 125
    },
    
    // Plant stats
    PLANT_STATS: {
        sunflower: {
            health: 300,
            sunProduction: 25,
            sunInterval: 24000
        },
        peashooter: {
            health: 300,
            damage: 20,
            shootInterval: 1400
        },
        repeater: {
            health: 300,
            damage: 20,
            shootInterval: 1400,
            peas: 2
        },
        wallnut: {
            health: 4000
        },
        cherrybomb: {
            health: 300,
            damage: 1800,
            range: 1,
            fuseTime: 1000
        },
        jalapeno: {
            health: 300,
            damage: 1800,
            fuseTime: 1000
        }
    },
    
    // Base Zombie stats (modified by level multiplier)
    ZOMBIE_STATS: {
        normal: {
            health: 200,
            speed: 0.3,
            damage: 100
        },
        conehead: {
            health: 560,
            speed: 0.3,
            damage: 100
        },
        buckethead: {
            health: 1100,
            speed: 0.3,
            damage: 100
        },
        boss: {
            health: 50000,      // Extremely high HP - nearly invincible
            speed: 0.15,        // Slower but deadly
            damage: 150,        // Damage per attack (3 hits to kill plant, 5 for wallnut)
            laneChangeInterval: 15000,  // Change lane every 15 seconds
            roamInterval: 3000  // Roam to different grid positions
        }
    },
    
    // 10 Level configurations with increasing difficulty
    LEVELS: {
        1: {
            zombies: { normal: 5, conehead: 0, buckethead: 0 },
            total: 5,
            healthMultiplier: 1.0,
            speedMultiplier: 0.3,  // 30% speed - very slow for beginners
            spawnInterval: 15000   // 15 seconds between zombies
        },
        2: {
            zombies: { normal: 7, conehead: 2, buckethead: 0 },
            total: 9,
            healthMultiplier: 1.1,
            speedMultiplier: 0.4,  // 40% speed
            spawnInterval: 14000   // 14 seconds
        },
        3: {
            zombies: { normal: 8, conehead: 4, buckethead: 1 },
            total: 13,
            healthMultiplier: 1.2,
            speedMultiplier: 0.5,  // 50% speed
            spawnInterval: 12000   // 12 seconds
        },
        4: {
            zombies: { normal: 10, conehead: 5, buckethead: 2 },
            total: 17,
            healthMultiplier: 1.35,
            speedMultiplier: 0.6,  // 60% speed
            spawnInterval: 11000   // 11 seconds
        },
        5: {
            zombies: { normal: 10, conehead: 7, buckethead: 3 },
            total: 20,
            healthMultiplier: 1.5,
            speedMultiplier: 0.75, // 75% speed
            spawnInterval: 10000   // 10 seconds
        },
        6: {
            zombies: { normal: 12, conehead: 8, buckethead: 5 },
            total: 25,
            healthMultiplier: 1.7,
            speedMultiplier: 1.0,  // Full speed
            spawnInterval: 8500
        },
        7: {
            zombies: { normal: 12, conehead: 10, buckethead: 6 },
            total: 28,
            healthMultiplier: 1.9,
            speedMultiplier: 1.05, // Slightly faster
            spawnInterval: 8000
        },
        8: {
            zombies: { normal: 15, conehead: 12, buckethead: 8, boss: 1 },
            total: 36,
            healthMultiplier: 2.1,
            speedMultiplier: 1.1,  // 110% speed
            spawnInterval: 7500,
            hasBoss: true,
            bossSpawnAfter: 20  // Boss spawns after 20 zombies killed
        },
        9: {
            zombies: { normal: 15, conehead: 15, buckethead: 10, boss: 1 },
            total: 41,
            healthMultiplier: 2.4,
            speedMultiplier: 1.15, // 115% speed
            spawnInterval: 7000,
            hasBoss: true,
            bossSpawnAfter: 25  // Boss spawns after 25 zombies killed
        },
        10: {
            zombies: { normal: 20, conehead: 18, buckethead: 12, boss: 2 },
            total: 52,
            healthMultiplier: 3.0,
            speedMultiplier: 1.2,  // 120% speed - hardest
            spawnInterval: 6000,
            hasBoss: true,
            bossSpawnAfter: 30  // Boss spawns after 30 zombies killed
        }
    },
    
    // Animation settings
    FRAME_RATE: 60,
    
    // Projectile settings
    PEA_SPEED: 2,
    PEA_DAMAGE: 20
};
