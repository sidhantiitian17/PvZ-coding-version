// Challenge System
class ChallengeSystem {
    constructor(editorManager, gameState) {
        this.editorManager = editorManager;
        this.gameState = gameState;
        this.currentChallenge = null;
        this.sandbox = new CodeSandbox();
        
        this.challenges = [
            {
                id: 'basic-loop',
                title: 'Basic Loop',
                difficulty: 'Easy',
                description: 'Write a function that returns the sum of all numbers from 1 to n.',
                starterCode: 'function sumNumbers(n) {\n  // Your code here\n  \n}\n\n// Test: sumNumbers(5) should return 15',
                tests: [
                    { input: [5], expected: 15, description: 'sumNumbers(5) should return 15' },
                    { input: [10], expected: 55, description: 'sumNumbers(10) should return 55' },
                    { input: [1], expected: 1, description: 'sumNumbers(1) should return 1' }
                ],
                validator: (code) => {
                    try {
                        const func = new Function('n', code + '\nreturn sumNumbers(n);');
                        return { func, error: null };
                    } catch (e) {
                        return { func: null, error: e.message };
                    }
                }
            },
            {
                id: 'array-filter',
                title: 'Array Filtering',
                difficulty: 'Easy',
                description: 'Write a function that filters an array to only include even numbers.',
                starterCode: 'function filterEven(arr) {\n  // Your code here\n  \n}\n\n// Test: filterEven([1,2,3,4,5,6]) should return [2,4,6]',
                tests: [
                    { input: [[1,2,3,4,5,6]], expected: [2,4,6], description: 'filterEven([1,2,3,4,5,6]) should return [2,4,6]' },
                    { input: [[1,3,5]], expected: [], description: 'filterEven([1,3,5]) should return []' },
                    { input: [[2,4,8]], expected: [2,4,8], description: 'filterEven([2,4,8]) should return [2,4,8]' }
                ],
                validator: (code) => {
                    try {
                        const func = new Function('arr', code + '\nreturn filterEven(arr);');
                        return { func, error: null };
                    } catch (e) {
                        return { func: null, error: e.message };
                    }
                }
            },
            {
                id: 'fibonacci',
                title: 'Fibonacci Sequence',
                difficulty: 'Medium',
                description: 'Write a function that returns the nth Fibonacci number.',
                starterCode: 'function fibonacci(n) {\n  // Your code here\n  \n}\n\n// Test: fibonacci(7) should return 13',
                tests: [
                    { input: [0], expected: 0, description: 'fibonacci(0) should return 0' },
                    { input: [1], expected: 1, description: 'fibonacci(1) should return 1' },
                    { input: [7], expected: 13, description: 'fibonacci(7) should return 13' },
                    { input: [10], expected: 55, description: 'fibonacci(10) should return 55' }
                ],
                validator: (code) => {
                    try {
                        const func = new Function('n', code + '\nreturn fibonacci(n);');
                        return { func, error: null };
                    } catch (e) {
                        return { func: null, error: e.message };
                    }
                }
            },
            {
                id: 'palindrome',
                title: 'Palindrome Checker',
                difficulty: 'Medium',
                description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards).',
                starterCode: 'function isPalindrome(str) {\n  // Your code here\n  \n}\n\n// Test: isPalindrome("racecar") should return true',
                tests: [
                    { input: ['racecar'], expected: true, description: 'isPalindrome("racecar") should return true' },
                    { input: ['hello'], expected: false, description: 'isPalindrome("hello") should return false' },
                    { input: ['A man a plan a canal Panama'], expected: true, description: 'Should ignore case and spaces' }
                ],
                validator: (code) => {
                    try {
                        const func = new Function('str', code + '\nreturn isPalindrome(str);');
                        return { func, error: null };
                    } catch (e) {
                        return { func: null, error: e.message };
                    }
                }
            },
            {
                id: 'zombie-calculator',
                title: 'Zombie Damage Calculator',
                difficulty: 'Hard',
                description: 'Calculate total damage dealt by plants. Given an array of plants with their damage values and fire rates, calculate total damage over a time period.',
                starterCode: 'function calculateDamage(plants, seconds) {\n  // plants = [{ damage: 20, fireRate: 1.4 }, ...]\n  // Return total damage over time period\n  \n}\n\n// Test example in output',
                tests: [
                    { 
                        input: [[{ damage: 20, fireRate: 1.4 }], 10], 
                        expected: 140, 
                        description: 'One plant shooting for 10 seconds' 
                    },
                    { 
                        input: [[{ damage: 20, fireRate: 1.4 }, { damage: 20, fireRate: 1.4 }], 10], 
                        expected: 280, 
                        description: 'Two plants shooting for 10 seconds' 
                    }
                ],
                validator: (code) => {
                    try {
                        const func = new Function('plants', 'seconds', code + '\nreturn calculateDamage(plants, seconds);');
                        return { func, error: null };
                    } catch (e) {
                        return { func: null, error: e.message };
                    }
                }
            }
        ];
        
        this.setupEventListeners();
        this.populateChallengeList();
    }
    
    setupEventListeners() {
        document.getElementById('run-code-btn')?.addEventListener('click', () => {
            this.runCode();
        });
        
        document.getElementById('submit-code-btn')?.addEventListener('click', () => {
            this.submitCode();
        });
        
        document.getElementById('reset-code-btn')?.addEventListener('click', () => {
            this.resetCode();
        });
    }
    
    populateChallengeList() {
        const container = document.getElementById('challenge-list-items');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.challenges.forEach(challenge => {
            const isCompleted = this.gameState.isChallengeCompleted(challenge.id);
            
            const item = createElement('div', {
                class: `challenge-item${isCompleted ? ' completed' : ''}`,
                onClick: () => this.loadChallenge(challenge.id)
            }, [
                createElement('div', { class: 'challenge-item-title' }, [challenge.title]),
                createElement('div', { class: 'challenge-item-difficulty' }, [challenge.difficulty])
            ]);
            
            container.appendChild(item);
        });
    }
    
    loadChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        this.currentChallenge = challenge;
        
        // Update UI
        document.getElementById('challenge-title').textContent = challenge.title;
        document.getElementById('challenge-description').textContent = challenge.description;
        
        // Set starter code in editor
        this.editorManager.setCode(challenge.starterCode);
        
        // Clear output
        document.getElementById('output-content').textContent = '';
        
        // Highlight selected challenge
        document.querySelectorAll('.challenge-item').forEach((item, index) => {
            item.classList.remove('active');
            if (this.challenges[index].id === challengeId) {
                item.classList.add('active');
            }
        });
    }
    
    runCode() {
        if (!this.currentChallenge) {
            this.displayOutput('Please select a challenge first.', 'error');
            return;
        }
        
        const code = this.editorManager.getCode();
        const output = document.getElementById('output-content');
        
        // Clear previous output
        output.textContent = 'Running code...\n';
        
        // Run code in sandbox
        this.sandbox.execute(code, (result) => {
            if (result.error) {
                this.displayOutput(`Error: ${result.error}`, 'error');
            } else {
                this.displayOutput('Code executed successfully!\nUse Submit to test against all test cases.', 'success');
            }
        });
    }
    
    submitCode() {
        if (!this.currentChallenge) {
            this.displayOutput('Please select a challenge first.', 'error');
            return;
        }
        
        const code = this.editorManager.getCode();
        const output = document.getElementById('output-content');
        
        output.textContent = 'Testing code...\n\n';
        
        const { func, error } = this.currentChallenge.validator(code);
        
        if (error) {
            this.displayOutput(`Compilation Error: ${error}`, 'error');
            return;
        }
        
        let allPassed = true;
        const results = [];
        
        this.currentChallenge.tests.forEach((test, index) => {
            try {
                const result = func(...test.input);
                const passed = JSON.stringify(result) === JSON.stringify(test.expected);
                
                results.push({
                    passed,
                    description: test.description,
                    expected: test.expected,
                    actual: result
                });
                
                if (!passed) allPassed = false;
            } catch (e) {
                results.push({
                    passed: false,
                    description: test.description,
                    error: e.message
                });
                allPassed = false;
            }
        });
        
        this.displayTestResults(results, allPassed);
        
        if (allPassed) {
            this.gameState.completeChallenge(this.currentChallenge.id);
            this.populateChallengeList();
        }
    }
    
    resetCode() {
        if (this.currentChallenge) {
            this.editorManager.setCode(this.currentChallenge.starterCode);
            document.getElementById('output-content').textContent = '';
        }
    }
    
    displayOutput(message, type = 'info') {
        const output = document.getElementById('output-content');
        output.textContent = message;
        output.className = `output-${type}`;
    }
    
    displayTestResults(results, allPassed) {
        const output = document.getElementById('output-content');
        output.className = '';
        
        let text = allPassed ? '✓ All tests passed!\n\n' : '✗ Some tests failed:\n\n';
        
        results.forEach((result, index) => {
            const status = result.passed ? '✓' : '✗';
            text += `${status} Test ${index + 1}: ${result.description}\n`;
            
            if (!result.passed) {
                if (result.error) {
                    text += `  Error: ${result.error}\n`;
                } else {
                    text += `  Expected: ${JSON.stringify(result.expected)}\n`;
                    text += `  Actual: ${JSON.stringify(result.actual)}\n`;
                }
            }
            text += '\n';
        });
        
        output.textContent = text;
        output.className = allPassed ? 'output-success' : 'output-error';
    }
}

// Make ChallengeSystem globally accessible
window.ChallengeSystem = ChallengeSystem;
