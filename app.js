// Main Application Logic
class ObscuraApp {
    constructor() {
        this.version = '2.0.0';
        this.isElectron = typeof require !== 'undefined';
        
        this.initializeApp();
    }
    
    initializeApp() {
        console.log(`🚀 Obscura Vault v${this.version} - Lightning Edition`);
        console.log('🔐 Hammad Malik\'s Secure Vault Initialized');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.onDOMReady();
            });
        } else {
            this.onDOMReady();
        }
    }
    
    onDOMReady() {
        console.log('✅ DOM Ready - Initializing components...');
        
        // Initialize keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Setup window event listeners
        this.setupWindowEventListeners();
        
        // Setup development features
        if (this.isDevelopment()) {
            this.setupDevelopmentFeatures();
        }
        
        // Show welcome message
        this.showWelcomeMessage();
        
        console.log('🎉 Obscura App fully initialized!');
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + L: Lock vault
            if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
                e.preventDefault();
                if (window.authManager && window.authManager.isAuthenticated) {
                    window.authManager.handleLock();
                }
            }
            
            // Ctrl/Cmd + F: Focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('search-input');
                if (searchInput && window.authManager && window.authManager.isAuthenticated) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Ctrl/Cmd + N: Add new entry (show quick menu)
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                if (window.authManager && window.authManager.isAuthenticated) {
                    this.showQuickAddMenu();
                }
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                }
            }
            
            // Enter: Submit forms
            if (e.key === 'Enter') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    const submitBtn = activeModal.querySelector('#save-btn');
                    if (submitBtn && e.target.type !== 'textarea') {
                        e.preventDefault();
                        submitBtn.click();
                    }
                }
            }
        });
    }
    
    setupWindowEventListeners() {
        // Handle window focus for security
        window.addEventListener('focus', () => {
            if (window.authManager) {
                window.authManager.resetAutoLockTimer();
            }
        });
        
        // Handle window blur for security
        window.addEventListener('blur', () => {
            // Could implement additional security measures here
            console.log('🔒 Window lost focus - security monitoring active');
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Responsive adjustments could go here
            console.log('📐 Window resized');
        });
        
        // Handle before unload
        window.addEventListener('beforeunload', (e) => {
            if (window.authManager && window.authManager.isAuthenticated) {
                // Lock vault on exit
                window.authManager.handleLock();
            }
        });
    }
    
    showQuickAddMenu() {
        // Create quick add context menu
        const menu = document.createElement('div');
        menu.className = 'quick-add-menu';
        menu.innerHTML = `
            <div class="quick-add-header">Quick Add Entry</div>
            <div class="quick-add-options">
                <button class="quick-add-option" data-type="api_key">🔑 API Key</button>
                <button class="quick-add-option" data-type="password">🔒 Password</button>
                <button class="quick-add-option" data-type="debit_card">💰 Debit Card</button>
                <button class="quick-add-option" data-type="bank_details">🏦 Banking</button>
                <button class="quick-add-option" data-type="secure_note">📝 Note</button>
            </div>
        `;
        
        // Style the menu
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--secondary-bg);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 1rem;
            z-index: 2000;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            animation: modalSlide 0.3s ease forwards;
        `;
        
        document.body.appendChild(menu);
        
        // Add event listeners
        menu.querySelectorAll('.quick-add-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const entryType = e.target.getAttribute('data-type');
                if (window.vaultManager) {
                    window.vaultManager.showAddEntryModal(entryType);
                }
                document.body.removeChild(menu);
            });
        });
        
        // Close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeQuickMenu(e) {
                if (!menu.contains(e.target)) {
                    if (document.body.contains(menu)) {
                        document.body.removeChild(menu);
                    }
                    document.removeEventListener('click', closeQuickMenu);
                }
            });
        }, 100);
    }
    
    setupDevelopmentFeatures() {
        console.log('🔧 Development mode detected');
        
        // Add debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff41;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border: 1px solid #333;
        `;
        debugPanel.innerHTML = `
            <div>🔧 DEV MODE</div>
            <div>Vault: ${window.authManager ? (window.authManager.isAuthenticated ? 'UNLOCKED' : 'LOCKED') : 'LOADING'}</div>
            <div>Entries: ${window.vaultManager ? window.vaultManager.entries.length : 0}</div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Update debug panel every second
        setInterval(() => {
            if (debugPanel.parentNode) {
                debugPanel.innerHTML = `
                    <div>🔧 DEV MODE</div>
                    <div>Vault: ${window.authManager ? (window.authManager.isAuthenticated ? 'UNLOCKED' : 'LOCKED') : 'LOADING'}</div>
                    <div>Entries: ${window.vaultManager ? window.vaultManager.entries.length : 0}</div>
                    <div>Time: ${new Date().toLocaleTimeString()}</div>
                `;
            }
        }, 1000);
        
        // Add keyboard shortcut to toggle debug panel
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                debugPanel.style.display = debugPanel.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    showWelcomeMessage() {
        // Show a brief welcome message for first-time users
        setTimeout(() => {
            if (!window.authManager || !window.authManager.isAuthenticated) {
                console.log('👋 Welcome to Obscura - Hammad Malik\'s Secure Vault');
                
                // Check if this is first run
                const hasShownWelcome = localStorage.getItem('obscura-welcome-shown');
                if (!hasShownWelcome) {
                    this.showFirstTimeWelcome();
                    localStorage.setItem('obscura-welcome-shown', 'true');
                }
            }
        }, 2000);
    }
    
    showFirstTimeWelcome() {
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'toast welcome-toast';
        welcomeToast.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-dark));
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            max-width: 350px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            z-index: 3000;
            animation: toastSlide 0.5s ease forwards;
        `;
        
        welcomeToast.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">
                🎉 Welcome to Obscura!
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 1rem;">
                Your lightning-fast, secure vault is ready. All data is encrypted with AES-256.
            </div>
            <div style="font-size: 0.8rem; opacity: 0.7;">
                <div>💡 Tips:</div>
                <div>• Ctrl+L to lock vault</div>
                <div>• Ctrl+F to search</div>
                <div>• Ctrl+N to add entry</div>
            </div>
        `;
        
        document.body.appendChild(welcomeToast);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (welcomeToast.parentNode) {
                welcomeToast.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (welcomeToast.parentNode) {
                        document.body.removeChild(welcomeToast);
                    }
                }, 500);
            }
        }, 10000);
    }
    
    isDevelopment() {
        return process && process.env && process.env.NODE_ENV === 'development';
    }
    
    // Utility methods
    static formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } catch (error) {
            return dateString;
        }
    }
    
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    static debounce(func, wait) {
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
}

// Add some CSS for the quick add menu
const quickAddStyles = document.createElement('style');
quickAddStyles.textContent = `
    .quick-add-menu {
        background: var(--secondary-bg);
        border: 1px solid var(--accent-primary);
        border-radius: 12px;
        padding: 1rem;
        min-width: 200px;
    }
    
    .quick-add-header {
        font-weight: 600;
        color: var(--accent-primary);
        margin-bottom: 1rem;
        text-align: center;
    }
    
    .quick-add-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .quick-add-option {
        padding: 0.75rem;
        background: var(--tertiary-bg);
        border: none;
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: left;
        font-size: 0.9rem;
    }
    
    .quick-add-option:hover {
        background: var(--accent-primary);
        color: white;
        transform: translateX(5px);
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(quickAddStyles);

// Initialize the main application
const app = new ObscuraApp();

// Make it globally available for debugging
window.obscuraApp = app;

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

console.log('🚀 Obscura Lightning Edition - Fully Loaded!');