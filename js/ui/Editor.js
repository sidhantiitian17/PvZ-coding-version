// Code Editor Manager
class EditorManager {
    constructor() {
        this.editor = null;
        this.isMonacoLoaded = false;
        this.currentCode = '';
        this.defaultCode = '// Write your JavaScript code here\n\n';
        
        this.initializeEditor();
    }
    
    initializeEditor() {
        // Try to load Monaco Editor
        if (typeof require !== 'undefined' && typeof require.config === 'function') {
            this.loadMonacoEditor();
        } else {
            // Fallback to simple textarea
            this.createSimpleEditor();
        }
    }
    
    loadMonacoEditor() {
        require.config({ 
            paths: { 
                'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' 
            } 
        });
        
        require(['vs/editor/editor.main'], () => {
            this.isMonacoLoaded = true;
            this.createMonacoEditor();
        });
    }
    
    createMonacoEditor() {
        const container = document.getElementById('code-editor');
        if (!container) return;
        
        this.editor = monaco.editor.create(container, {
            value: this.defaultCode,
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on'
        });
        
        this.currentCode = this.defaultCode;
        
        this.editor.onDidChangeModelContent(() => {
            this.currentCode = this.editor.getValue();
        });
    }
    
    createSimpleEditor() {
        const container = document.getElementById('code-editor');
        if (!container) return;
        
        const textarea = document.createElement('textarea');
        textarea.className = 'simple-editor';
        textarea.value = this.defaultCode;
        textarea.placeholder = 'Write your JavaScript code here...';
        
        textarea.addEventListener('input', (e) => {
            this.currentCode = e.target.value;
        });
        
        container.appendChild(textarea);
        this.editor = textarea;
        this.currentCode = this.defaultCode;
    }
    
    setCode(code) {
        this.currentCode = code;
        if (this.isMonacoLoaded && this.editor) {
            this.editor.setValue(code);
        } else if (this.editor && this.editor.tagName === 'TEXTAREA') {
            this.editor.value = code;
        }
    }
    
    getCode() {
        if (this.isMonacoLoaded && this.editor) {
            return this.editor.getValue();
        } else if (this.editor && this.editor.tagName === 'TEXTAREA') {
            return this.editor.value;
        }
        return this.currentCode;
    }
    
    reset() {
        this.setCode(this.defaultCode);
    }
    
    clear() {
        this.setCode('');
    }
}

// Make EditorManager globally accessible
window.EditorManager = EditorManager;
