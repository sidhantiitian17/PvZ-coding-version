// Code Sandbox - Safe execution environment for user code
class CodeSandbox {
    constructor() {
        this.timeoutDuration = 5000; // 5 seconds max execution time
    }
    
    execute(code, callback) {
        // Create a sandboxed execution context
        try {
            // Use Web Worker for better isolation if available
            if (typeof Worker !== 'undefined') {
                this.executeInWorker(code, callback);
            } else {
                // Fallback to iframe sandbox
                this.executeInIframe(code, callback);
            }
        } catch (error) {
            callback({ error: error.message, output: null });
        }
    }
    
    executeInWorker(code, callback) {
        // Create inline worker
        const workerCode = `
            self.onmessage = function(e) {
                const code = e.data;
                let output = [];
                
                // Override console.log to capture output
                const console = {
                    log: (...args) => {
                        output.push(args.map(a => String(a)).join(' '));
                    }
                };
                
                try {
                    // Execute the code
                    const func = new Function('console', code);
                    func(console);
                    
                    self.postMessage({
                        error: null,
                        output: output.join('\\n')
                    });
                } catch (error) {
                    self.postMessage({
                        error: error.message,
                        output: output.join('\\n')
                    });
                }
            };
        `;
        
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        
        try {
            const worker = new Worker(workerUrl);
            
            // Set timeout
            const timeout = setTimeout(() => {
                worker.terminate();
                callback({ error: 'Execution timeout (5 seconds)', output: null });
            }, this.timeoutDuration);
            
            worker.onmessage = (e) => {
                clearTimeout(timeout);
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                callback(e.data);
            };
            
            worker.onerror = (error) => {
                clearTimeout(timeout);
                worker.terminate();
                URL.revokeObjectURL(workerUrl);
                callback({ error: error.message, output: null });
            };
            
            worker.postMessage(code);
        } catch (error) {
            URL.revokeObjectURL(workerUrl);
            callback({ error: error.message, output: null });
        }
    }
    
    executeInIframe(code, callback) {
        // Create sandboxed iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.sandbox = 'allow-same-origin allow-scripts';
        
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Inject code into iframe
        const script = iframeDoc.createElement('script');
        
        const wrappedCode = `
            (function() {
                let output = [];
                const originalLog = console.log;
                
                console.log = function(...args) {
                    output.push(args.map(a => String(a)).join(' '));
                };
                
                try {
                    ${code}
                    
                    window.parent.postMessage({
                        type: 'sandbox-result',
                        error: null,
                        output: output.join('\\n')
                    }, '*');
                } catch (error) {
                    window.parent.postMessage({
                        type: 'sandbox-result',
                        error: error.message,
                        output: output.join('\\n')
                    }, '*');
                }
            })();
        `;
        
        script.textContent = wrappedCode;
        
        // Set timeout
        const timeout = setTimeout(() => {
            document.body.removeChild(iframe);
            window.removeEventListener('message', messageHandler);
            callback({ error: 'Execution timeout (5 seconds)', output: null });
        }, this.timeoutDuration);
        
        // Listen for result
        const messageHandler = (event) => {
            if (event.data && event.data.type === 'sandbox-result') {
                clearTimeout(timeout);
                window.removeEventListener('message', messageHandler);
                document.body.removeChild(iframe);
                callback({
                    error: event.data.error,
                    output: event.data.output
                });
            }
        };
        
        window.addEventListener('message', messageHandler);
        
        try {
            iframeDoc.body.appendChild(script);
        } catch (error) {
            clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
            document.body.removeChild(iframe);
            callback({ error: error.message, output: null });
        }
    }
    
    // Validate code for basic security issues
    validateCode(code) {
        const dangerousPatterns = [
            /eval\s*\(/,
            /Function\s*\(/,
            /XMLHttpRequest/,
            /fetch\s*\(/,
            /import\s+/,
            /require\s*\(/,
            /<script/i,
            /document\./,
            /window\./,
            /localStorage/,
            /sessionStorage/,
            /cookie/i
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(code)) {
                return {
                    valid: false,
                    error: `Potentially dangerous code detected: ${pattern.source}`
                };
            }
        }
        
        return { valid: true, error: null };
    }
    
    // Safe execution with limited scope
    executeSafe(code) {
        const validation = this.validateCode(code);
        if (!validation.valid) {
            throw new Error(validation.error);
        }
        
        // Create isolated scope
        const sandbox = {
            console: {
                log: (...args) => console.log('[Sandbox]', ...args)
            },
            Math: Math,
            Date: Date,
            JSON: JSON,
            Array: Array,
            Object: Object,
            String: String,
            Number: Number,
            Boolean: Boolean
        };
        
        // Execute in limited context
        const func = new Function(...Object.keys(sandbox), code);
        return func(...Object.values(sandbox));
    }
}

// Make CodeSandbox globally accessible
window.CodeSandbox = CodeSandbox;
