// In-Game Coding System - Player Code Augmentation
class CodingMode {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isEnabled = false;
        this.isRunning = false;
        this.playerCode = '';
        this.currentRow = 0;
        this.selectedZombieIndex = -1;
        this.selectedZombie = null;
        this.codeExecutionInterval = null;
        this.executionDelay = 100; // ms between code ticks
        this.hints = [];
        
        // Challenge panel state (NOT popup - game keeps running)
        this.challengePanelOpen = false;
        this.currentChallengeZombie = null;
        
        // Language selection
        this.currentLanguage = 'javascript';
        
        // Player code API context
        this.playerContext = {
            currentRow: 0,
            selectedZombie: null,
            lastAction: null,
            actionHistory: []
        };
        
        this.setupUI();
        this.setupKeyboardControls();
        this.setupChallengePanel();
    }
    
    setupChallengePanel() {
        // Event listeners for side panel challenge UI
        document.getElementById('panel-run-code')?.addEventListener('click', () => {
            this.runChallengeCode();
        });
        
        document.getElementById('panel-submit-code')?.addEventListener('click', () => {
            this.submitChallengeCode();
        });
        
        document.getElementById('panel-close')?.addEventListener('click', () => {
            this.closeChallengePanel();
        });
        
        // Language selector
        document.getElementById('language-select')?.addEventListener('change', (e) => {
            this.currentLanguage = e.target.value;
            // Update code in panel if challenge is open
            if (this.challengePanelOpen && this.currentChallengeZombie) {
                this.updateChallengeCode();
            }
        });
    }
    
    openZombieChallenge(zombie) {
        console.log('openZombieChallenge called', zombie);
        if (!zombie || !zombie.isAlive || zombie.challengeSolved) {
            console.log('Zombie not valid:', { zombie, isAlive: zombie?.isAlive, challengeSolved: zombie?.challengeSolved });
            return;
        }
        
        this.currentChallengeZombie = zombie;
        this.challengePanelOpen = true;
        
        // DO NOT pause the game - it continues running!
        // Player must solve while the game is live
        
        // Expand the coding palette if minimized
        const palette = document.getElementById('coding-palette');
        if (palette) {
            palette.classList.remove('minimized');
        }
        
        const panel = document.getElementById('zombie-challenge-panel');
        const title = document.getElementById('panel-challenge-title');
        const difficulty = document.getElementById('panel-difficulty');
        const description = document.getElementById('panel-challenge-description');
        const codeEditor = document.getElementById('panel-code-editor');
        const output = document.getElementById('panel-output');
        
        console.log('Panel elements:', { panel, title, difficulty, description, codeEditor, output });
        
        if (!panel || !title || !difficulty || !description || !codeEditor || !output) {
            console.error('Missing panel elements!');
            return;
        }
        
        title.textContent = `🧟 ${zombie.challenge.title}`;
        difficulty.textContent = zombie.challenge.difficulty;
        difficulty.className = `challenge-difficulty ${zombie.challenge.difficulty.toLowerCase()}`;
        description.textContent = zombie.challenge.description;
        
        // Use language-specific starter code - generate if not available
        const starterCode = this.getStarterCode(zombie.challenge, this.currentLanguage);
        codeEditor.value = starterCode;
        output.textContent = 'Run your code to test it!';
        
        // Make panel visible - explicitly set display and remove hidden
        panel.classList.remove('hidden');
        panel.classList.add('active');
        panel.style.display = 'block';
        
        console.log('Panel classes after update:', panel.className, 'display:', panel.style.display);
        
        // Highlight the target zombie
        zombie.element?.classList.add('selected');
        console.log('Challenge panel opened successfully');
    }
    
    updateChallengeCode() {
        if (!this.currentChallengeZombie) return;
        
        const codeEditor = document.getElementById('panel-code-editor');
        const starterCode = this.getStarterCode(this.currentChallengeZombie.challenge, this.currentLanguage);
        codeEditor.value = starterCode;
    }
    
    // Generate starter code for any language based on JavaScript template
    getStarterCode(challenge, language) {
        // If the challenge has specific starter code for this language, use it
        if (challenge.starterCode[language]) {
            return challenge.starterCode[language];
        }
        
        // Get JavaScript starter code as base
        const jsCode = challenge.starterCode.javascript || 'function solve() {\n  // Your code here\n}';
        
        // Extract function signature info from JS code
        const funcMatch = jsCode.match(/function\s+solve\s*\(([^)]*)\)/);
        const params = funcMatch ? funcMatch[1] : '';
        const comment = challenge.description || 'Solve the problem';
        
        // Generate starter code for each language with return statement ready
        switch (language) {
            case 'python':
                return `def solve(${params}):\n    # ${comment}\n    return `;
            
            case 'java':
                return `public class Solution {\n    public static Object solve(${this.javaParams(params)}) {\n        // ${comment}\n        return ;\n    }\n}`;
            
            case 'csharp':
                return `public class Solution {\n    public static object Solve(${this.csharpParams(params)}) {\n        // ${comment}\n        return ;\n    }\n}`;
            
            case 'cpp':
                return `#include <iostream>\nusing namespace std;\n\nauto solve(${this.cppParams(params)}) {\n    // ${comment}\n    return ;\n}`;
            
            case 'ruby':
                return `def solve(${params})\n  # ${comment}\n  return \nend`;
            
            case 'go':
                return `package main\n\nfunc solve(${this.goParams(params)}) interface{} {\n    // ${comment}\n    return \n}`;
            
            case 'rust':
                return `fn solve(${this.rustParams(params)}) -> i32 {\n    // ${comment}\n    return ;\n}`;
            
            case 'typescript':
                return `function solve(${this.tsParams(params)}): any {\n    // ${comment}\n    return ;\n}`;
            
            case 'php':
                return `<?php\nfunction solve(${this.phpParams(params)}) {\n    // ${comment}\n    return ;\n}`;
            
            default:
                return jsCode;
        }
    }
    
    // Helper methods for parameter type conversion
    javaParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `int ${p.trim()}`).join(', ');
    }
    
    csharpParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `int ${p.trim()}`).join(', ');
    }
    
    cppParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `int ${p.trim()}`).join(', ');
    }
    
    goParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `${p.trim()} int`).join(', ');
    }
    
    rustParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `${p.trim()}: i32`).join(', ');
    }
    
    tsParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `${p.trim()}: number`).join(', ');
    }
    
    phpParams(params) {
        if (!params) return '';
        return params.split(',').map(p => `$${p.trim()}`).join(', ');
    }
    
    closeChallengePanel() {
        const panel = document.getElementById('zombie-challenge-panel');
        panel.classList.add('hidden');
        panel.classList.remove('active');
        panel.style.display = 'none';
        this.challengePanelOpen = false;
        
        // Remove zombie highlight
        if (this.currentChallengeZombie) {
            this.currentChallengeZombie.element?.classList.remove('selected');
        }
        this.currentChallengeZombie = null;
    }
    
    runChallengeCode() {
        if (!this.currentChallengeZombie) return;
        
        const code = document.getElementById('panel-code-editor').value;
        const output = document.getElementById('panel-output');
        const challenge = this.currentChallengeZombie.challenge;
        
        // Check if zombie is still alive
        if (!this.currentChallengeZombie.isAlive) {
            output.textContent = '⚠️ Zombie was killed! Find another target.';
            setTimeout(() => this.closeChallengePanel(), 1500);
            return;
        }
        
        try {
            // Convert code to JavaScript for execution based on language
            const jsCode = this.convertToJavaScript(code, this.currentLanguage);
            
            if (jsCode === null) {
                output.textContent = `⚠️ ${this.currentLanguage.toUpperCase()} is shown for syntax only.\nPlease use JavaScript or Python for testing.`;
                return;
            }
            
            // Execute the JavaScript code
            const func = new Function('return ' + jsCode)();
            
            let allPassed = true;
            let results = [];
            
            for (const test of challenge.tests) {
                try {
                    const result = func(...test.input);
                    const passed = JSON.stringify(result) === JSON.stringify(test.expected);
                    results.push({
                        input: JSON.stringify(test.input),
                        expected: JSON.stringify(test.expected),
                        got: JSON.stringify(result),
                        passed
                    });
                    if (!passed) allPassed = false;
                } catch (e) {
                    results.push({
                        input: JSON.stringify(test.input),
                        expected: JSON.stringify(test.expected),
                        got: 'Error: ' + e.message,
                        passed: false
                    });
                    allPassed = false;
                }
            }
            
            // Display results (compact for side panel)
            let outputText = results.map((r, i) => 
                `${r.passed ? '✅' : '❌'} Test ${i + 1}: ${r.input} → ${r.got}`
            ).join('\n');
            
            if (allPassed) {
                outputText += '\n\n🎉 All passed! Click Kill!';
            }
            
            output.textContent = outputText;
        } catch (e) {
            output.textContent = '❌ Error: ' + e.message;
        }
    }
    
    // Convert code from various languages to JavaScript for execution
    convertToJavaScript(code, language) {
        try {
            switch (language) {
                case 'javascript':
                    return code;
                
                case 'typescript':
                    return this.typescriptToJs(code);
                
                case 'python':
                    return this.pythonToJs(code);
                
                case 'java':
                    return this.javaToJs(code);
                
                case 'csharp':
                    return this.csharpToJs(code);
                
                case 'cpp':
                    return this.cppToJs(code);
                
                case 'ruby':
                    return this.rubyToJs(code);
                
                case 'go':
                    return this.goToJs(code);
                
                case 'rust':
                    return this.rustToJs(code);
                
                case 'php':
                    return this.phpToJs(code);
                
                default:
                    return code;
            }
        } catch (e) {
            console.error('Transpilation error:', e);
            return null;
        }
    }
    
    // Helper: strip type annotations from function parameters
    stripTypesFromParams(params) {
        if (!params || !params.trim()) return '';
        return params.split(',').map(p => {
            const trimmed = p.trim();
            // Handle different formats:
            // "int a" -> "a"
            // "a: int" -> "a"  (Rust style)
            // "$a" -> "a" (PHP style)
            // "a int" -> "a" (Go style)
            if (trimmed.includes(':')) {
                // Rust-style: "a: i32"
                return trimmed.split(':')[0].trim().replace(/^\$/, '');
            } else if (trimmed.includes(' ')) {
                // Java/C++/Go style - take the last word as variable name
                const parts = trimmed.split(/\s+/);
                return parts[parts.length - 1].replace(/^\$/, '');
            }
            // Already just the variable name
            return trimmed.replace(/^\$/, '');
        }).join(', ');
    }
    
    typescriptToJs(code) {
        // TypeScript is mostly compatible, just strip type annotations
        return code
            .replace(/:\s*(any|number|string|boolean|object|void|null|undefined|never|unknown|Array<[^>]+>|\[[^\]]+\]|{[^}]+})\s*(?=[,)=\n{])/g, '')
            .replace(/<[^>]+>/g, '') // Remove generics
            .replace(/\bas\s+\w+/g, ''); // Remove type assertions
    }
    
    pythonToJs(code) {
        // Basic Python to JS conversion
        let jsCode = code
            .replace(/def solve\((.*?)\):/g, 'function solve($1) {')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false')
            .replace(/None/g, 'null')
            .replace(/len\((.*?)\)/g, '$1.length')
            .replace(/str\((.*?)\)/g, 'String($1)')
            .replace(/int\((.*?)\)/g, 'parseInt($1)')
            .replace(/float\((.*?)\)/g, 'parseFloat($1)')
            .replace(/abs\((.*?)\)/g, 'Math.abs($1)')
            .replace(/max\((.*?)\)/g, 'Math.max($1)')
            .replace(/min\((.*?)\)/g, 'Math.min($1)')
            .replace(/\.upper\(\)/g, '.toUpperCase()')
            .replace(/\.lower\(\)/g, '.toLowerCase()')
            .replace(/\.append\((.*?)\)/g, '.push($1)')
            .replace(/if (.*?):/g, 'if ($1) {')
            .replace(/elif (.*?):/g, '} else if ($1) {')
            .replace(/else:/g, '} else {')
            .replace(/for (.*?) in range\((.*?)\):/g, 'for (let $1 = 0; $1 < $2; $1++) {')
            .replace(/for (.*?) in (.*?):/g, 'for (let $1 of $2) {')
            .replace(/while (.*?):/g, 'while ($1) {')
            .replace(/#.*$/gm, '')
            .replace(/    /g, '  ')
            .replace(/pass/g, '')
            .replace(/and/g, '&&')
            .replace(/or/g, '||')
            .replace(/not /g, '!');
        
        // Add closing braces
        return this.addClosingBraces(jsCode);
    }
    
    javaToJs(code) {
        // Extract the solve method body and convert to JS
        let jsCode = code
            .replace(/public\s+class\s+\w+\s*\{/g, '');
        
        // Handle function signature - extract params and strip types
        jsCode = jsCode.replace(/public\s+static\s+\w+\s+solve\s*\(([^)]*)\)\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/Object\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/int\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/String\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/boolean\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/double\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/float\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/long\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/\.length\(\)/g, '.length')
            .replace(/\.equals\((.*?)\)/g, ' === $1')
            .replace(/System\.out\.println/g, 'console.log')
            .replace(/Math\.abs/g, 'Math.abs')
            .replace(/Math\.max/g, 'Math.max')
            .replace(/Math\.min/g, 'Math.min')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/null/g, 'null')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Remove trailing class brace
        jsCode = jsCode.replace(/\}\s*$/, '');
        
        return jsCode.trim();
    }
    
    csharpToJs(code) {
        // Convert C# to JS
        let jsCode = code
            .replace(/public\s+class\s+\w+\s*\{/g, '');
        
        // Handle function signature - extract params and strip types
        jsCode = jsCode.replace(/public\s+static\s+\w+\s+Solve\s*\(([^)]*)\)\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/object\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/int\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/string\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/bool\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/double\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/float\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/var\s+(\w+)/g, 'let $1')
            .replace(/\.Length/g, '.length')
            .replace(/\.ToUpper\(\)/g, '.toUpperCase()')
            .replace(/\.ToLower\(\)/g, '.toLowerCase()')
            .replace(/Console\.WriteLine/g, 'console.log')
            .replace(/Math\.Abs/g, 'Math.abs')
            .replace(/Math\.Max/g, 'Math.max')
            .replace(/Math\.Min/g, 'Math.min')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/null/g, 'null')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        jsCode = jsCode.replace(/\}\s*$/, '');
        
        return jsCode.trim();
    }
    
    cppToJs(code) {
        // Convert C++ to JS
        let jsCode = code
            .replace(/#include\s*<.*?>/g, '')
            .replace(/using\s+namespace\s+\w+;/g, '');
        
        // Handle function signature - extract params and strip types
        jsCode = jsCode.replace(/(?:auto|int|double|float|bool|string|void)\s+solve\s*\(([^)]*)\)\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/auto\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/int\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/string\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/bool\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/double\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/float\s+(\w+)\s*=/g, 'let $1 =')
            .replace(/cout\s*<<\s*(.*?)\s*<<\s*endl/g, 'console.log($1)')
            .replace(/cout\s*<<\s*(.*?);/g, 'console.log($1);')
            .replace(/\.length\(\)/g, '.length')
            .replace(/\.size\(\)/g, '.length')
            .replace(/abs\(/g, 'Math.abs(')
            .replace(/max\(/g, 'Math.max(')
            .replace(/min\(/g, 'Math.min(')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/nullptr/g, 'null')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        return jsCode.trim();
    }
    
    rubyToJs(code) {
        // Convert Ruby to JS
        let jsCode = code
            .replace(/def solve\((.*?)\)/g, 'function solve($1) {')
            .replace(/end/g, '}')
            .replace(/puts\s+(.*)/g, 'console.log($1)')
            .replace(/\.length/g, '.length')
            .replace(/\.upcase/g, '.toUpperCase()')
            .replace(/\.downcase/g, '.toLowerCase()')
            .replace(/\.push\((.*?)\)/g, '.push($1)')
            .replace(/\.abs/g, 'Math.abs')
            .replace(/if (.*?)$/gm, 'if ($1) {')
            .replace(/elsif (.*?)$/gm, '} else if ($1) {')
            .replace(/else$/gm, '} else {')
            .replace(/while (.*?)$/gm, 'while ($1) {')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/nil/g, 'null')
            .replace(/&&/g, '&&')
            .replace(/\|\|/g, '||')
            .replace(/#.*$/gm, '');
        
        return jsCode.trim();
    }
    
    goToJs(code) {
        // Convert Go to JS
        let jsCode = code
            .replace(/package\s+\w+/g, '');
        
        // Handle function signature - extract params and strip types (Go: "a int, b int")
        jsCode = jsCode.replace(/func solve\s*\(([^)]*)\)\s*\w*\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/:=/g, '= ')
            .replace(/var\s+(\w+)\s+\w+\s*=/g, 'let $1 =')
            .replace(/fmt\.Println/g, 'console.log')
            .replace(/len\((.*?)\)/g, '$1.length')
            .replace(/strings\.ToUpper\((.*?)\)/g, '$1.toUpperCase()')
            .replace(/strings\.ToLower\((.*?)\)/g, '$1.toLowerCase()')
            .replace(/math\.Abs/g, 'Math.abs')
            .replace(/math\.Max/g, 'Math.max')
            .replace(/math\.Min/g, 'Math.min')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/nil/g, 'null')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        return jsCode.trim();
    }
    
    rustToJs(code) {
        // Convert Rust to JS
        let jsCode = code;
        
        // Handle function signature - extract params and strip types (Rust: "a: i32, b: i32")
        jsCode = jsCode.replace(/fn solve\s*\(([^)]*)\)\s*(?:->\s*\w+)?\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/let\s+mut\s+/g, 'let ')
            .replace(/let\s+/g, 'let ')
            .replace(/println!\((.*?)\)/g, 'console.log($1)')
            .replace(/\.len\(\)/g, '.length')
            .replace(/\.to_uppercase\(\)/g, '.toUpperCase()')
            .replace(/\.to_lowercase\(\)/g, '.toLowerCase()')
            .replace(/\.abs\(\)/g, '')
            .replace(/i32::abs\((.*?)\)/g, 'Math.abs($1)')
            .replace(/std::cmp::max/g, 'Math.max')
            .replace(/std::cmp::min/g, 'Math.min')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/None/g, 'null')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        return jsCode.trim();
    }
    
    phpToJs(code) {
        // Convert PHP to JS
        let jsCode = code
            .replace(/<\?php/g, '')
            .replace(/\?>/g, '');
        
        // Handle function signature - extract params and strip $ prefix
        jsCode = jsCode.replace(/function solve\s*\(([^)]*)\)\s*\{/g, (match, params) => {
            const cleanParams = this.stripTypesFromParams(params);
            return `function solve(${cleanParams}) {`;
        });
        
        jsCode = jsCode
            .replace(/\$(\w+)/g, '$1') // Remove $ from variables
            .replace(/echo\s+(.*?);/g, 'console.log($1);')
            .replace(/strlen\((.*?)\)/g, '$1.length')
            .replace(/strtoupper\((.*?)\)/g, '$1.toUpperCase()')
            .replace(/strtolower\((.*?)\)/g, '$1.toLowerCase()')
            .replace(/abs\((.*?)\)/g, 'Math.abs($1)')
            .replace(/max\((.*?)\)/g, 'Math.max($1)')
            .replace(/min\((.*?)\)/g, 'Math.min($1)')
            .replace(/array_push\((.*?),\s*(.*?)\)/g, '$1.push($2)')
            .replace(/count\((.*?)\)/g, '$1.length')
            .replace(/true/g, 'true')
            .replace(/false/g, 'false')
            .replace(/null/g, 'null')
            .replace(/\./g, '+') // String concat to +
            .replace(/===/g, '===')
            .replace(/==/g, '==')
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        
        return jsCode.trim();
    }
    
    addClosingBraces(jsCode) {
        // Add closing braces for Python-style code
        const lines = jsCode.split('\n');
        let result = '';
        let indent = 0;
        
        for (const line of lines) {
            const stripped = line.trim();
            if (stripped.endsWith('{')) {
                result += line + '\n';
                indent++;
            } else {
                result += line + '\n';
            }
        }
        
        // Add closing braces
        for (let i = 0; i < indent; i++) {
            result += '}\n';
        }
        
        return result;
    }
    
    submitChallengeCode() {
        if (!this.currentChallengeZombie) return;
        
        // Check if zombie is still alive
        if (!this.currentChallengeZombie.isAlive) {
            const output = document.getElementById('panel-output');
            output.textContent = '⚠️ Zombie was killed! Find another target.';
            setTimeout(() => this.closeChallengePanel(), 1500);
            return;
        }
        
        const code = document.getElementById('panel-code-editor').value;
        const output = document.getElementById('panel-output');
        const challenge = this.currentChallengeZombie.challenge;
        
        try {
            // Convert code to JavaScript for execution
            const jsCode = this.convertToJavaScript(code, this.currentLanguage);
            
            if (jsCode === null) {
                output.textContent = `⚠️ Cannot execute ${this.currentLanguage.toUpperCase()}.\nSwitch to JavaScript or Python to submit.`;
                return;
            }
            
            const func = new Function('return ' + jsCode)();
            let allPassed = true;
            
            for (const test of challenge.tests) {
                try {
                    const result = func(...test.input);
                    if (JSON.stringify(result) !== JSON.stringify(test.expected)) {
                        allPassed = false;
                        break;
                    }
                } catch (e) {
                    allPassed = false;
                    break;
                }
            }
            
            if (allPassed) {
                output.textContent = '🎉 SUCCESS! Zombie eliminated!';
                
                // Kill the zombie!
                this.currentChallengeZombie.instantKill();
                
                // Close panel after short delay
                setTimeout(() => {
                    this.closeChallengePanel();
                }, 1000);
            } else {
                output.textContent = '❌ Tests failed. Keep trying!';
            }
        } catch (e) {
            output.textContent = '❌ Error: ' + e.message;
        }
    }
    
    setupUI() {
        // Toggle coding mode button
        document.getElementById('toggle-coding-mode')?.addEventListener('click', () => {
            this.toggleCodingMode();
        });
        
        // Minimize palette
        document.getElementById('minimize-palette')?.addEventListener('click', () => {
            const palette = document.getElementById('coding-palette');
            palette?.classList.toggle('minimized');
        });
        
        // Run code button
        document.getElementById('run-player-code')?.addEventListener('click', () => {
            this.runPlayerCode();
        });
        
        // Pause code button
        document.getElementById('pause-player-code')?.addEventListener('click', () => {
            this.pausePlayerCode();
        });
        
        // Clear code button
        document.getElementById('clear-player-code')?.addEventListener('click', () => {
            this.clearPlayerCode();
        });
        
        // Code input
        document.getElementById('player-code')?.addEventListener('input', (e) => {
            this.playerCode = e.target.value;
        });
    }
    
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;
            
            // TAB - cycle through zombies in current row
            if (e.key === 'Tab') {
                e.preventDefault();
                this.cycleZombies();
            }
            
            // Arrow Up - switch to row above
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.switchRow('up');
            }
            
            // Arrow Down - switch to row below
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.switchRow('down');
            }
            
            // Space - quick attack selected zombie
            if (e.key === ' ' && this.selectedZombie) {
                e.preventDefault();
                this.quickAttack();
            }
        });
    }
    
    toggleCodingMode() {
        this.isEnabled = !this.isEnabled;
        const statusText = document.getElementById('coding-mode-status');
        if (statusText) {
            statusText.textContent = this.isEnabled ? 'ON' : 'OFF';
            statusText.style.color = this.isEnabled ? '#4caf50' : '#757575';
        }
        
        this.updateStatus(this.isEnabled ? 'Coding mode enabled' : 'Coding mode disabled');
    }
    
    cycleZombies() {
        const zombiesInRow = this.gameEngine.zombies.filter(z => 
            z.row === this.currentRow && z.isAlive
        );
        
        if (zombiesInRow.length === 0) {
            this.updateHint('No zombies in this row');
            return;
        }
        
        // Deselect current zombie
        if (this.selectedZombie) {
            this.selectedZombie.element?.classList.remove('selected');
        }
        
        // Cycle to next zombie
        this.selectedZombieIndex = (this.selectedZombieIndex + 1) % zombiesInRow.length;
        this.selectedZombie = zombiesInRow[this.selectedZombieIndex];
        this.selectedZombie.element?.classList.add('selected');
        
        this.playerContext.selectedZombie = this.selectedZombie;
        this.updateSelectedZombieInfo();
        playSound('select');
    }
    
    switchRow(direction) {
        if (direction === 'up') {
            this.currentRow = Math.max(0, this.currentRow - 1);
        } else if (direction === 'down') {
            this.currentRow = Math.min(CONFIG.GRID_ROWS - 1, this.currentRow + 1);
        }
        
        this.playerContext.currentRow = this.currentRow;
        this.selectedZombieIndex = -1;
        
        if (this.selectedZombie) {
            this.selectedZombie.element?.classList.remove('selected');
            this.selectedZombie = null;
        }
        
        this.updateHint(`Switched to row ${this.currentRow + 1}`);
        this.updateSelectedZombieInfo();
    }
    
    quickAttack() {
        if (!this.selectedZombie || !this.selectedZombie.isAlive) {
            this.updateHint('No valid target selected');
            return;
        }
        
        // Visual feedback - flash effect
        this.addFlashEffect(this.selectedZombie.element);
        
        // Accelerated damage - code-powered attack
        const damage = 100; // Higher than normal pea damage
        this.selectedZombie.takeDamage(damage);
        this.playerContext.lastAction = 'attack';
        this.playerContext.actionHistory.push({
            action: 'attack',
            target: this.selectedZombie.type,
            damage: damage,
            timestamp: performance.now()
        });
        
        this.updateHint(`Dealt ${damage} damage to ${this.selectedZombie.type} zombie!`);
        playSound('splat');
    }
    
    runPlayerCode() {
        if (this.isRunning) {
            this.updateHint('Code is already running');
            return;
        }
        
        const code = document.getElementById('player-code')?.value || '';
        if (!code.trim()) {
            this.updateHint('No code to execute');
            return;
        }
        
        this.playerCode = code;
        this.isRunning = true;
        
        // Enable pause button, disable run button
        const runBtn = document.getElementById('run-player-code');
        const pauseBtn = document.getElementById('pause-player-code');
        if (runBtn) runBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        
        this.updateStatus('Running', 'running');
        this.executePlayerCodeLoop();
    }
    
    pausePlayerCode() {
        this.isRunning = false;
        
        if (this.codeExecutionInterval) {
            clearTimeout(this.codeExecutionInterval);
            this.codeExecutionInterval = null;
        }
        
        // Enable run button, disable pause button
        const runBtn = document.getElementById('run-player-code');
        const pauseBtn = document.getElementById('pause-player-code');
        if (runBtn) runBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        
        this.updateStatus('Paused', 'idle');
    }
    
    clearPlayerCode() {
        const codeInput = document.getElementById('player-code');
        if (codeInput) {
            codeInput.value = '';
            this.playerCode = '';
        }
        this.pausePlayerCode();
        this.updateHint('Code cleared');
    }
    
    executePlayerCodeLoop() {
        if (!this.isRunning) return;
        
        try {
            // Execute player code with API
            this.executePlayerCode();
            
            // Schedule next execution
            this.codeExecutionInterval = setTimeout(() => {
                this.executePlayerCodeLoop();
            }, this.executionDelay);
        } catch (error) {
            this.handleCodeError(error);
        }
    }
    
    executePlayerCode() {
        // Create safe execution context with game API
        const api = this.createGameAPI();
        
        try {
            // Simple eval with timeout protection
            const startTime = performance.now();
            const maxExecutionTime = 10; // 10ms max per tick
            
            // Infinite loop detection - inject iteration counter
            let iterationCount = 0;
            const maxIterations = 10000; // Prevent runaway loops
            
            const checkIteration = () => {
                if (++iterationCount > maxIterations) {
                    throw new Error('Infinite loop detected - code terminated');
                }
            };
            
            // Wrap code in function with API available
            const wrappedCode = `
                (function() {
                    const {
                        selectZombie,
                        switchRow,
                        attackZombie,
                        getZombieSpeed,
                        getZombieHealth,
                        getZombieTimer,
                        pauseZombieTimer,
                        wait,
                        currentRow,
                        zombieCount
                    } = api;
                    
                    ${this.playerCode}
                })();
            `;
            
            // Execute with limited scope
            const func = new Function('api', 'checkIteration', wrappedCode);
            func(api, checkIteration);
            
            const executionTime = performance.now() - startTime;
            if (executionTime > maxExecutionTime) {
                this.updateHint(`⚠️ Code took ${executionTime.toFixed(1)}ms (limit: ${maxExecutionTime}ms)`);
            }
        } catch (error) {
            throw error;
        }
    }
    
    createGameAPI() {
        const self = this;
        
        return {
            // Select a specific zombie
            selectZombie: (row, index) => {
                if (row < 0 || row >= CONFIG.GRID_ROWS) {
                    throw new Error(`Invalid row: ${row}`);
                }
                
                const zombiesInRow = this.gameEngine.zombies.filter(z => 
                    z.row === row && z.isAlive
                );
                
                if (index < 0 || index >= zombiesInRow.length) {
                    throw new Error(`Invalid zombie index: ${index}`);
                }
                
                // Clear current selection
                if (self.selectedZombie) {
                    self.selectedZombie.element?.classList.remove('selected');
                }
                
                self.currentRow = row;
                self.selectedZombieIndex = index;
                self.selectedZombie = zombiesInRow[index];
                self.selectedZombie.element?.classList.add('selected');
                self.playerContext.selectedZombie = self.selectedZombie;
                
                self.updateSelectedZombieInfo();
                return true;
            },
            
            // Switch to a different row
            switchRow: (direction) => {
                self.switchRow(direction);
                return self.currentRow;
            },
            
            // Attack the selected zombie with accelerated damage
            attackZombie: () => {
                if (!self.selectedZombie || !self.selectedZombie.isAlive) {
                    return false;
                }
                
                self.quickAttack();
                return true;
            },
            
            // Get speed of selected zombie or zombies in row
            getZombieSpeed: (row = null) => {
                if (row !== null) {
                    const zombiesInRow = this.gameEngine.zombies.filter(z => 
                        z.row === row && z.isAlive
                    );
                    if (zombiesInRow.length > 0) {
                        return zombiesInRow[0].speed;
                    }
                    return 0;
                }
                
                return self.selectedZombie ? self.selectedZombie.speed : 0;
            },
            
            // Get health of selected zombie
            getZombieHealth: () => {
                return self.selectedZombie ? self.selectedZombie.health : 0;
            },
            
            // NEW: Get timer of selected zombie or specific zombie
            getZombieTimer: (row = null, index = 0) => {
                if (row !== null) {
                    const zombiesInRow = this.gameEngine.zombies.filter(z => 
                        z.row === row && z.isAlive
                    );
                    if (zombiesInRow.length > index) {
                        return zombiesInRow[index].getTimer();
                    }
                    return 0;
                }
                return self.selectedZombie ? self.selectedZombie.getTimer() : 0;
            },
            
            // NEW: Pause timer of selected zombie
            pauseZombieTimer: (ms) => {
                if (!self.selectedZombie || !self.selectedZombie.isAlive) {
                    return false;
                }
                self.selectedZombie.pauseTimer(ms);
                return true;
            },
            
            // Wait for specified milliseconds (async simulation)
            wait: (ms) => {
                // In real implementation, this would be handled differently
                // For now, it's a no-op as the execution loop handles timing
                return ms;
            },
            
            // Get current row
            get currentRow() {
                return self.currentRow;
            },
            
            // Get zombie count in current or specific row
            zombieCount: (row = null) => {
                const targetRow = row !== null ? row : self.currentRow;
                return this.gameEngine.zombies.filter(z => 
                    z.row === targetRow && z.isAlive
                ).length;
            }
        };
    }
    
    handleCodeError(error) {
        this.isRunning = false;
        this.updateStatus('Error', 'error');
        this.updateHint(`❌ Error: ${error.message}`);
        
        // Auto-pause on error
        this.pausePlayerCode();
        
        // Provide helpful suggestion
        this.suggestFix(error);
    }
    
    suggestFix(error) {
        const message = error.message.toLowerCase();
        let suggestion = '';
        
        if (message.includes('undefined')) {
            suggestion = 'Tip: Make sure you\'re using the correct API function names';
        } else if (message.includes('invalid row')) {
            suggestion = 'Tip: Row numbers range from 0 to 4';
        } else if (message.includes('invalid zombie')) {
            suggestion = 'Tip: Use zombieCount() to check how many zombies are in a row';
        } else {
            suggestion = 'Tip: Check your code syntax and logic';
        }
        
        setTimeout(() => {
            this.updateHint(`💡 ${suggestion}`);
        }, 2000);
    }
    
    updateStatus(text, type = 'idle') {
        const statusText = document.getElementById('code-status-text');
        const statusDot = document.querySelector('.status-dot');
        
        if (statusText) {
            statusText.textContent = text;
        }
        
        if (statusDot) {
            statusDot.className = `status-dot ${type}`;
        }
    }
    
    updateSelectedZombieInfo() {
        const info = document.getElementById('selected-zombie-info');
        if (!info) return;
        
        if (this.selectedZombie && this.selectedZombie.isAlive) {
            const timer = this.selectedZombie.getTimer();
            const timerSeconds = Math.ceil(timer / 1000);
            info.innerHTML = `
                Row ${this.currentRow + 1} | 
                ${this.selectedZombie.type} | 
                HP: ${Math.round(this.selectedZombie.health)} | 
                Timer: ${timerSeconds}s
            `;
        } else {
            info.textContent = `Row ${this.currentRow + 1} | No zombie selected`;
        }
    }
    
    addFlashEffect(element) {
        if (!element) return;
        
        // Add flash class
        element.classList.add('attacked');
        
        // Remove after animation
        setTimeout(() => {
            element.classList.remove('attacked');
        }, 300);
    }
    
    updateHint(text) {
        const hints = document.getElementById('code-hints');
        if (hints) {
            hints.innerHTML = `<div class="hint-text">💡 ${text}</div>`;
        }
    }
    
    // Called from game loop to update state
    update() {
        // Clean up dead zombie references
        if (this.selectedZombie && !this.selectedZombie.isAlive) {
            this.selectedZombie.element?.classList.remove('selected');
            this.selectedZombie = null;
            this.selectedZombieIndex = -1;
            this.updateSelectedZombieInfo();
        }
        
        // Check if the challenge zombie died while the panel is open
        if (this.challengePanelOpen && this.currentChallengeZombie && !this.currentChallengeZombie.isAlive) {
            const output = document.getElementById('panel-output');
            if (output) {
                output.textContent = '⚠️ Target zombie was killed! Pick another.';
            }
            // Auto-close after a moment
            setTimeout(() => {
                if (this.challengePanelOpen && (!this.currentChallengeZombie || !this.currentChallengeZombie.isAlive)) {
                    this.closeChallengePanel();
                }
            }, 2000);
        }
    }
    
    // Cleanup
    destroy() {
        this.pausePlayerCode();
        if (this.selectedZombie) {
            this.selectedZombie.element?.classList.remove('selected');
        }
    }
}

// Make CodingMode globally accessible
window.CodingMode = CodingMode;
