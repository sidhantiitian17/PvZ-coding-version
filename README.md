# Plants vs Zombies - Web Edition

A complete web-based reimplementation of Plants vs Zombies with integrated code challenges for learning JavaScript and an innovative **Coding Mode** that lets you augment gameplay with custom code.

![Game Over Screen](assets/images/game%20over.gif)

## Features

### 🎮 Core Game Features
- **10 Levels** with progressive difficulty scaling
- **Level Progression System** - Levels are locked until you complete the previous one
- **6 Plant Types**: Sunflower, Peashooter, Repeater, Wallnut, Cherry Bomb, Jalapeno
- **4 Zombie Types**: Normal, Conehead, Buckethead, and Boss Zombie
- **Lawnmowers** - Last line of defense for each row
- **Responsive Design** - Works on desktop and mobile browsers

### 💾 Save System
- **Manual Save/Load** - Save your progress and return later
- **Autosave** - Game automatically saves every 5 seconds during gameplay
- **Restore on Refresh** - If you accidentally close or refresh the page, you'll be prompted to continue where you left off
- **Progress Persistence** - Unlocked levels are saved permanently

### 🔊 Sound System
- **Background Music** - Continuous atmospheric music on all screens
- **Audio Ducking** - Background music automatically lowers when sound effects play
- **Dynamic Sound Effects**:
  - "Zombies are coming!" announcement when first zombie spawns
  - Unique sounds for Cherry Bomb and Jalapeno placement
  - Lawnmower activation sound
  - Game over scream
  - Plant placement, sun collection, and combat sounds

### 🎯 In-Game Coding Mode
Transform your gameplay with code! The **Coding Mode** allows you to:
- **Write Live Code** - Control game actions with JavaScript during gameplay
- **Hybrid Gameplay** - Traditional plant mechanics + code-powered enhancements run simultaneously
- **Quick Zombie Selection** - Press TAB to cycle through zombies, arrow keys to switch rows
- **Accelerated Attacks** - Code-triggered attacks deal faster damage than default plants
- **Real-time API** - Access game state and control actions through a safe API
- **Compact Editor** - 20% screen footprint with inline code palette
- **Fail-Safe Design** - Game continues normally if code crashes or is empty

#### Coding Mode API
```javascript
// Available functions in player code:
selectZombie(row, index)  // Target a specific zombie
switchRow(direction)      // Move focus up/down ('up' or 'down')
attackZombie()           // Deal accelerated damage (100 HP)
getZombieSpeed()         // Get zombie speed in current/specified row
getZombieHealth()        // Get selected zombie's health
getZombieTimer()         // Get zombie's countdown timer (ms)
pauseZombieTimer(ms)     // Pause zombie's timer for specified duration
zombieCount(row)         // Count zombies in row
currentRow               // Current row number (0-4)

// Example: Auto-target and attack
if (zombieCount() > 0) {
  selectZombie(currentRow, 0);
  attackZombie();
}

// Example: Pause timer of low-health zombies
if (zombieCount() > 0) {
  selectZombie(currentRow, 0);
  if (getZombieHealth() < 100) {
    pauseZombieTimer(2000); // Pause for 2 seconds
  }
}
```

### 💻 Code Challenge System
- **Integrated Code Editor** - Monaco Editor (VS Code's editor) built into the game
- **Programming Challenges** - Learn JavaScript by solving coding challenges
- **Safe Code Execution** - Sandboxed execution environment using Web Workers
- **Real-time Validation** - Test your code against predefined test cases
- **Progress Tracking** - Track completed challenges

### 📖 Almanac
- View detailed information about all plants and zombies
- Learn about abilities, costs, and strategies

## How to Play

### Running the Game

The game works with any local web server. Choose your preferred method:

1. **VS Code Live Server (Recommended)**:
   - Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
   - Right-click on `web/index.html` and select "Open with Live Server"
   - Game opens automatically in your browser at `http://127.0.0.1:5500/web/`

2. **Using the included start script**:
   ```bash
   cd web
   ./start.sh
   ```
   Then open `http://localhost:8000` in your browser.

3. **Python HTTP Server**:
   ```bash
   cd web
   python3 -m http.server 8000
   ```
   Then open `http://localhost:8000` in your browser.

4. **Node.js HTTP Server**:
   ```bash
   npx http-server web -p 8000
   ```

### Game Controls

#### Traditional Mode
| Key | Action |
|-----|--------|
| **Mouse Click** | Select plants, place on lawn, collect sun |
| **1-6** | Quick select plants |
| **S** | Select shovel |
| **P** | Pause/Resume game |
| **ESC** | Deselect plant/tool |

#### Coding Mode Controls
| Key | Action |
|-----|--------|
| **TAB** | Cycle through zombies in current row |
| **↑/↓** | Switch between rows |
| **Space** | Quick attack selected zombie |
| **Toggle Button** | Enable/disable coding mode |

### Plant Costs

| Plant | Cost | Description |
|-------|------|-------------|
| 🌻 Sunflower | 50 sun | Produces sun over time |
| 🌱 Peashooter | 100 sun | Shoots peas at zombies |
| 🌱🌱 Repeater | 200 sun | Shoots two peas at a time |
| 🥜 Wallnut | 50 sun | Blocks zombies with high health |
| 🍒 Cherry Bomb | 150 sun | Explodes in 3x3 area |
| 🌶️ Jalapeno | 125 sun | Burns entire row of zombies |

### Level Progression

- **Level 1** is unlocked by default
- Complete a level to unlock the next one
- Each level increases in difficulty with:
  - More zombies
  - Faster spawn rates
  - Tougher zombie types
  - Health and speed multipliers

## Code Challenges

The game includes a built-in code challenge system to help you learn JavaScript:

1. Click "Code Challenges" from the main menu
2. Select a challenge from the list
3. Write your JavaScript solution in the editor
4. Click "Run Code" to test it
5. Click "Submit" to validate against all test cases
6. Complete challenges to unlock achievements

### Challenge Difficulty Levels

- **Easy** - Basic loops and array operations
- **Medium** - Algorithms like Fibonacci, palindrome checking
- **Hard** - Complex calculations and game-related logic

## Technology Stack

- **HTML5** - Structure and layout
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Game logic and interactivity
- **Monaco Editor** - Code editor component
- **Canvas API** - Rendering (optional enhancement)
- **Web Workers** - Safe code execution
- **LocalStorage** - Save game data and progress

## File Structure

```
web/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Base styles and menu styles
│   ├── game.css            # Game screen styles
│   └── editor.css          # Code editor styles
├── js/
│   ├── config.js           # Game configuration
│   ├── utils.js            # Utility functions & audio system
│   ├── main.js             # Application entry point
│   ├── entities/           # Game entities
│   │   ├── Plant.js
│   │   ├── Zombie.js
│   │   ├── Projectile.js
│   │   ├── Sun.js
│   │   └── LawnMower.js
│   ├── game/               # Game logic
│   │   ├── Level.js
│   │   ├── GameState.js    # Save/load & level unlocking
│   │   ├── GameEngine.js   # Main game loop & autosave
│   │   └── CodingMode.js   # Coding mode system
│   ├── ui/                 # UI components
│   │   ├── Menu.js
│   │   └── Editor.js
│   └── challenges/         # Challenge system
│       ├── ChallengeSystem.js
│       └── Sandbox.js
└── assets/
    ├── images/             # Game sprites, GIFs, and background music
    └── sounds/             # Sound effects (.wav files)
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Game runs at 60 FPS
- Optimized entity management
- Efficient collision detection
- Canvas rendering for game elements
- Autosave every 5 seconds (non-blocking)

## Security

The code execution environment is sandboxed to prevent:
- Access to DOM manipulation
- Network requests (XHR, fetch)
- LocalStorage/SessionStorage access
- Dangerous functions (eval, Function constructor in user code)
- Cookie access

## Recent Updates

- ✅ **Level Locking System** - Progressive level unlocking
- ✅ **Autosave Feature** - Never lose progress on page refresh
- ✅ **Game Over Animation** - Animated GIF background on game over screen
- ✅ **Enhanced Sound System** - Background music with audio ducking
- ✅ **Dynamic Sound Effects** - Contextual sounds for all game events

## Future Enhancements

- [ ] More plant and zombie types
- [ ] Power-ups and special abilities
- [ ] Multiplayer mode
- [ ] More coding challenges
- [ ] Achievement system
- [ ] Mobile touch controls optimization
- [ ] Tutorial mode
- [ ] Night levels

## Credits

Original game concept by PopCap Games.
Web implementation and code challenge system created as an educational project.

## License

GPL-3.0 License - See LICENSE file for details.
