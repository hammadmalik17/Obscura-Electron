// // Enhanced Authentication Module with Vault Animations
// class VaultAnimationManager {
//     constructor() {
//         this.createAnimationOverlay();
//         this.audioContext = null;
//         this.initAudio();
//     }
    
//     async initAudio() {
//         try {
//             this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
//         } catch (error) {
//             console.log('Audio not available:', error);
//         }
//     }
    
//     createAnimationOverlay() {
//         // Create the animation overlay HTML
//         const overlay = document.createElement('div');
//         overlay.id = 'vault-animation-overlay';
//         overlay.innerHTML = `
//             <div class="vault-opening-overlay">
//                 <div class="security-grid"></div>
//                 <div class="particles" id="particles-container"></div>
                
//                 <div class="vault-door-container">
//                     <div class="vault-door" id="vault-door">
//                         <div class="tumbler tumbler-1"></div>
//                         <div class="tumbler tumbler-2"></div>
//                         <div class="tumbler tumbler-3"></div>
//                         <div class="tumbler tumbler-4"></div>
//                         <div class="vault-lock" id="vault-lock"></div>
//                     </div>
//                     <div class="vault-interior" id="vault-interior">🔓</div>
//                 </div>
                
//                 <div class="vault-status" id="vault-status">Initializing</div>
                
//                 <div class="progress-bar">
//                     <div class="progress-fill" id="progress-fill"></div>
//                 </div>
                
//                 <div class="sound-waves" id="sound-waves">
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                     <div class="wave"></div>
//                 </div>
//             </div>
//         `;
        
//         document.body.appendChild(overlay);
//         this.addAnimationStyles();
        
//         // Get references
//         this.overlay = overlay.querySelector('.vault-opening-overlay');
//         this.door = document.getElementById('vault-door');
//         this.lock = document.getElementById('vault-lock');
//         this.interior = document.getElementById('vault-interior');
//         this.status = document.getElementById('vault-status');
//         this.progress = document.getElementById('progress-fill');
//         this.soundWaves = document.getElementById('sound-waves');
//         this.grid = this.overlay.querySelector('.security-grid');
//         this.particlesContainer = document.getElementById('particles-container');
//     }
    
//     addAnimationStyles() {
//         const styles = document.createElement('style');
//         styles.textContent = `
//             /* Vault Animation Styles */
//             .vault-opening-overlay {
//                 position: fixed;
//                 top: 0;
//                 left: 0;
//                 width: 100%;
//                 height: 100%;
//                 background: radial-gradient(circle, rgba(10, 10, 10, 0.95), rgba(0, 0, 0, 1));
//                 z-index: 10000;
//                 display: flex;
//                 flex-direction: column;
//                 align-items: center;
//                 justify-content: center;
//                 opacity: 0;
//                 visibility: hidden;
//                 transition: all 0.5s ease;
//             }

//             .vault-opening-overlay.active {
//                 opacity: 1;
//                 visibility: visible;
//             }

//             .vault-door-container {
//                 position: relative;
//                 width: 400px;
//                 height: 400px;
//                 margin-bottom: 2rem;
//             }

//             .vault-door {
//                 width: 100%;
//                 height: 100%;
//                 border: 8px solid #444;
//                 border-radius: 50%;
//                 background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
//                 position: relative;
//                 transform: perspective(1000px) rotateY(0deg);
//                 transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
//                 box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(149, 113, 221, 0.3);
//             }

//             .vault-door.opening {
//                 transform: perspective(1000px) rotateY(-90deg);
//                 opacity: 0.3;
//             }

//             .vault-door.closing {
//                 transform: perspective(1000px) rotateY(90deg);
//                 opacity: 0.3;
//             }

//             .vault-interior {
//                 position: absolute;
//                 top: 50%;
//                 left: 50%;
//                 transform: translate(-50%, -50%);
//                 width: 300px;
//                 height: 300px;
//                 background: radial-gradient(circle, #9571dd, #4c249d);
//                 border-radius: 50%;
//                 opacity: 0;
//                 transition: all 1.5s ease;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 3rem;
//                 animation: pulseGlow 2s infinite alternate;
//             }

//             .vault-interior.visible {
//                 opacity: 1;
//             }

//             @keyframes pulseGlow {
//                 0% { box-shadow: 0 0 20px rgba(149, 113, 221, 0.5); }
//                 100% { box-shadow: 0 0 50px rgba(149, 113, 221, 0.8); }
//             }

//             .vault-lock {
//                 position: absolute;
//                 top: 50%;
//                 left: 50%;
//                 transform: translate(-50%, -50%);
//                 width: 100px;
//                 height: 100px;
//                 border: 6px solid #666;
//                 border-radius: 50%;
//                 background: linear-gradient(145deg, #333, #222);
//                 transition: all 2s ease;
//             }

//             .vault-lock::before {
//                 content: '';
//                 position: absolute;
//                 top: 50%;
//                 left: 50%;
//                 transform: translate(-50%, -50%);
//                 width: 60px;
//                 height: 60px;
//                 border: 4px solid #9571dd;
//                 border-radius: 50%;
//                 transition: all 2s ease;
//             }

//             .vault-lock.unlocking {
//                 transform: translate(-50%, -50%) rotate(720deg);
//                 border-color: #00ff41;
//             }

//             .vault-lock.locking {
//                 transform: translate(-50%, -50%) rotate(-720deg);
//                 border-color: #ff4444;
//             }

//             .tumbler {
//                 position: absolute;
//                 border: 2px solid #555;
//                 border-radius: 50%;
//                 background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
//             }

//             .tumbler-1 {
//                 top: 20%;
//                 left: 20%;
//                 width: 40px;
//                 height: 40px;
//                 animation: spin1 3s linear infinite;
//             }

//             .tumbler-2 {
//                 top: 20%;
//                 right: 20%;
//                 width: 35px;
//                 height: 35px;
//                 animation: spin2 2.5s linear infinite reverse;
//             }

//             .tumbler-3 {
//                 bottom: 20%;
//                 left: 20%;
//                 width: 30px;
//                 height: 30px;
//                 animation: spin3 2s linear infinite;
//             }

//             .tumbler-4 {
//                 bottom: 20%;
//                 right: 20%;
//                 width: 25px;
//                 height: 25px;
//                 animation: spin4 1.8s linear infinite reverse;
//             }

//             @keyframes spin1 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//             @keyframes spin2 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//             @keyframes spin3 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//             @keyframes spin4 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

//             .vault-status {
//                 font-size: 2rem;
//                 font-weight: 700;
//                 text-align: center;
//                 margin-bottom: 1rem;
//                 text-transform: uppercase;
//                 letter-spacing: 0.2em;
//                 opacity: 0;
//                 transform: translateY(20px);
//                 transition: all 1s ease;
//             }

//             .vault-status.visible {
//                 opacity: 1;
//                 transform: translateY(0);
//             }

//             .vault-status.decrypting {
//                 color: #ff9800;
//                 animation: textPulse 1s infinite;
//             }

//             .vault-status.access-granted {
//                 color: #00ff41;
//                 text-shadow: 0 0 20px #00ff41;
//             }

//             .vault-status.access-denied {
//                 color: #ff4444;
//                 text-shadow: 0 0 20px #ff4444;
//                 animation: shake 0.5s ease-in-out;
//             }

//             .vault-status.securing {
//                 color: #ff4444;
//                 animation: textPulse 1s infinite;
//             }

//             .vault-status.secured {
//                 color: #9571dd;
//                 text-shadow: 0 0 20px #9571dd;
//             }

//             @keyframes textPulse {
//                 0%, 100% { opacity: 1; }
//                 50% { opacity: 0.5; }
//             }

//             @keyframes shake {
//                 0%, 100% { transform: translateX(0); }
//                 25% { transform: translateX(-10px); }
//                 75% { transform: translateX(10px); }
//             }

//             .progress-bar {
//                 width: 300px;
//                 height: 4px;
//                 background: rgba(255, 255, 255, 0.1);
//                 border-radius: 2px;
//                 overflow: hidden;
//                 margin-top: 2rem;
//             }

//             .progress-fill {
//                 height: 100%;
//                 background: linear-gradient(90deg, #9571dd, #c5aff3);
//                 width: 0%;
//                 transition: width 0.3s ease;
//                 position: relative;
//             }

//             .progress-fill::after {
//                 content: '';
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 right: 0;
//                 bottom: 0;
//                 background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
//                 animation: shimmer 2s infinite;
//             }

//             @keyframes shimmer {
//                 0% { transform: translateX(-100%); }
//                 100% { transform: translateX(100%); }
//             }

//             .security-grid {
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 width: 100%;
//                 height: 100%;
//                 background: 
//                     linear-gradient(rgba(149, 113, 221, 0.1) 1px, transparent 1px),
//                     linear-gradient(90deg, rgba(149, 113, 221, 0.1) 1px, transparent 1px);
//                 background-size: 50px 50px;
//                 animation: gridPulse 3s ease-in-out infinite;
//                 opacity: 0;
//                 transition: opacity 1s ease;
//             }

//             .security-grid.active {
//                 opacity: 1;
//             }

//             @keyframes gridPulse {
//                 0%, 100% { opacity: 0.1; }
//                 50% { opacity: 0.3; }
//             }

//             .sound-waves {
//                 display: flex;
//                 align-items: center;
//                 gap: 5px;
//                 margin-top: 1rem;
//                 opacity: 0;
//                 transition: opacity 0.5s ease;
//             }

//             .sound-waves.active {
//                 opacity: 1;
//             }

//             .wave {
//                 width: 4px;
//                 background: #9571dd;
//                 border-radius: 2px;
//                 animation: wave 1.5s ease-in-out infinite;
//             }

//             .wave:nth-child(1) { height: 20px; animation-delay: 0s; }
//             .wave:nth-child(2) { height: 35px; animation-delay: 0.1s; }
//             .wave:nth-child(3) { height: 25px; animation-delay: 0.2s; }
//             .wave:nth-child(4) { height: 40px; animation-delay: 0.3s; }
//             .wave:nth-child(5) { height: 30px; animation-delay: 0.4s; }
//             .wave:nth-child(6) { height: 45px; animation-delay: 0.5s; }
//             .wave:nth-child(7) { height: 35px; animation-delay: 0.6s; }

//             @keyframes wave {
//                 0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
//                 50% { transform: scaleY(1); opacity: 1; }
//             }

//             .particles {
//                 position: absolute;
//                 top: 0;
//                 left: 0;
//                 width: 100%;
//                 height: 100%;
//                 pointer-events: none;
//             }

//             .particle {
//                 position: absolute;
//                 width: 4px;
//                 height: 4px;
//                 background: #9571dd;
//                 border-radius: 50%;
//                 animation: float 3s ease-in-out infinite;
//             }

//             @keyframes float {
//                 0%, 100% { 
//                     transform: translateY(0) scale(0);
//                     opacity: 0;
//                 }
//                 50% { 
//                     transform: translateY(-200px) scale(1);
//                     opacity: 1;
//                 }
//             }
//         `;
//         document.head.appendChild(styles);
//     }
    
//     playTone(frequency, duration, volume = 0.1) {
//         if (!this.audioContext) return;
        
//         const oscillator = this.audioContext.createOscillator();
//         const gainNode = this.audioContext.createGain();
        
//         oscillator.connect(gainNode);
//         gainNode.connect(this.audioContext.destination);
        
//         oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
//         oscillator.type = 'sine';
        
//         gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
//         gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
//         gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
//         oscillator.start(this.audioContext.currentTime);
//         oscillator.stop(this.audioContext.currentTime + duration);
//     }
    
//     speakText(text) {
//         if ('speechSynthesis' in window) {
//             const utterance = new SpeechSynthesisUtterance(text);
//             utterance.rate = 0.8;
//             utterance.pitch = 0.9;
//             utterance.volume = 0.7;
//             speechSynthesis.speak(utterance);
//         }
//     }
    
//     createParticles() {
//         for (let i = 0; i < 20; i++) {
//             setTimeout(() => {
//                 const particle = document.createElement('div');
//                 particle.className = 'particle';
//                 particle.style.left = Math.random() * 100 + '%';
//                 particle.style.animationDelay = Math.random() * 2 + 's';
//                 this.particlesContainer.appendChild(particle);
                
//                 setTimeout(() => {
//                     if (particle.parentNode) {
//                         particle.parentNode.removeChild(particle);
//                     }
//                 }, 3000);
//             }, i * 100);
//         }
//     }
    
//     async animateVaultOpening() {
//         return new Promise((resolve) => {
//             this.overlay.classList.add('active');
//             this.grid.classList.add('active');
            
//             this.status.textContent = 'Authenticating...';
//             this.status.className = 'vault-status visible decrypting';
            
//             let progress = 0;
//             const progressInterval = setInterval(() => {
//                 progress += Math.random() * 15;
//                 if (progress > 100) progress = 100;
//                 this.progress.style.width = progress + '%';
                
//                 if (progress >= 100) {
//                     clearInterval(progressInterval);
//                 }
//             }, 200);
            
//             this.playTone(800, 0.3);
            
//             setTimeout(() => {
//                 this.status.textContent = 'Decrypting Data...';
//                 this.soundWaves.classList.add('active');
//                 this.playTone(1000, 0.5);
//             }, 1000);
            
//             setTimeout(() => {
//                 this.status.textContent = 'Unlocking Vault...';
//                 this.lock.classList.add('unlocking');
//                 this.playTone(1200, 0.8);
//             }, 2500);
            
//             setTimeout(() => {
//                 this.door.classList.add('opening');
//                 this.playTone(600, 1.5);
//                 this.createParticles();
//             }, 3500);
            
//             setTimeout(() => {
//                 this.interior.classList.add('visible');
//                 this.status.textContent = 'Access Granted';
//                 this.status.className = 'vault-status visible access-granted';
//                 this.playTone(1500, 1);
//                 this.speakText('Access Granted. Welcome to Obscura Vault.');
//             }, 4500);
            
//             setTimeout(() => {
//                 this.overlay.classList.remove('active');
//                 resolve();
//             }, 6000);
//         });
//     }
    
//     async animateVaultClosing() {
//         return new Promise((resolve) => {
//             this.overlay.classList.add('active');
//             this.grid.classList.add('active');
            
//             // Reset states
//             this.door.classList.remove('opening');
//             this.lock.classList.remove('unlocking');
//             this.interior.classList.remove('visible');
//             this.soundWaves.classList.remove('active');
//             this.progress.style.width = '0%';
            
//             this.status.textContent = 'Securing Vault...';
//             this.status.className = 'vault-status visible securing';
            
//             let progress = 0;
//             const progressInterval = setInterval(() => {
//                 progress += Math.random() * 20;
//                 if (progress > 100) progress = 100;
//                 this.progress.style.width = progress + '%';
                
//                 if (progress >= 100) {
//                     clearInterval(progressInterval);
//                 }
//             }, 150);
            
//             this.playTone(800, 0.3);
            
//             setTimeout(() => {
//                 this.status.textContent = 'Encrypting Data...';
//                 this.soundWaves.classList.add('active');
//                 this.playTone(600, 0.8);
//             }, 800);
            
//             setTimeout(() => {
//                 this.door.classList.add('closing');
//                 this.lock.classList.add('locking');
//                 this.playTone(400, 1.2);
//                 this.createParticles();
//             }, 2000);
            
//             setTimeout(() => {
//                 this.status.textContent = 'Vault Secured';
//                 this.status.className = 'vault-status visible secured';
//                 this.playTone(200, 1);
//                 this.speakText('Vault secured. All data encrypted.');
//             }, 3500);
            
//             setTimeout(() => {
//                 this.overlay.classList.remove('active');
//                 this.door.classList.remove('closing');
//                 this.lock.classList.remove('locking');
//                 this.grid.classList.remove('active');
//                 this.soundWaves.classList.remove('active');
//                 resolve();
//             }, 5000);
//         });
//     }
    
//     async animateAccessDenied() {
//         return new Promise((resolve) => {
//             this.overlay.classList.add('active');
            
//             this.status.textContent = 'Access Denied';
//             this.status.className = 'vault-status visible access-denied';
            
//             this.playTone(300, 0.2);
//             setTimeout(() => this.playTone(250, 0.2), 200);
//             setTimeout(() => this.playTone(200, 0.3), 400);
            
//             this.speakText('Access denied. Invalid credentials.');
            
//             setTimeout(() => {
//                 this.overlay.classList.remove('active');
//                 resolve();
//             }, 2500);
//         });
//     }
// }

// // Enhanced Authentication Module
// class AuthManager {
//     constructor() {
//         this.isAuthenticated = false;
//         this.sessionStartTime = null;
//         this.autoLockTimer = null;
//         this.vaultAnimator = new VaultAnimationManager();
        
//         this.initializeEventListeners();
//         this.checkVaultStatus();
//     }
    
//     initializeEventListeners() {
//         const passwordInput = document.getElementById('master-password');
//         const unlockBtn = document.getElementById('unlock-btn');
//         const lockBtn = document.getElementById('lock-btn');
        
//         // Enter key to unlock
//         passwordInput?.addEventListener('keypress', (e) => {
//             if (e.key === 'Enter') {
//                 this.handleUnlock();
//             }
//         });
        
//         // Unlock button
//         unlockBtn?.addEventListener('click', () => {
//             this.handleUnlock();
//         });
        
//         // Lock button
//         lockBtn?.addEventListener('click', () => {
//             this.handleLock();
//         });
        
//         // Auto-focus password input
//         passwordInput?.focus();
//     }
    
//     async checkVaultStatus() {
//         try {
//             // Check if vault exists by looking for .obscura folder
//             const fs = require('fs');
//             const path = require('path');
//             const vaultPath = path.join(__dirname, '..', '.obscura');
            
//             if (fs.existsSync(vaultPath)) {
//                 console.log('✅ Existing vault found');
//                 this.showLoginScreen();
//             } else {
//                 console.log('🆕 No vault found, will create new one');
//                 this.showLoginScreen(); // For now, still show login screen
//             }
//         } catch (error) {
//             console.error('Error checking vault status:', error);
//             this.showLoginScreen();
//         }
//     }
    
//     showLoginScreen() {
//         const authScreen = document.getElementById('auth-screen');
//         const vaultScreen = document.getElementById('vault-screen');
        
//         if (authScreen && vaultScreen) {
//             authScreen.classList.add('active');
//             vaultScreen.classList.remove('active');
//         }
//     }
    
//     showVaultScreen() {
//         const authScreen = document.getElementById('auth-screen');
//         const vaultScreen = document.getElementById('vault-screen');
        
//         if (authScreen && vaultScreen) {
//             authScreen.classList.remove('active');
//             vaultScreen.classList.add('active');
//         }
        
//         // Start session timer
//         this.sessionStartTime = new Date();
//         this.startAutoLockTimer();
//         this.updateSessionTimer();
        
//         // Load vault entries
//         if (window.vaultManager) {
//             window.vaultManager.loadEntries();
//         }
//     }
    
//     async handleUnlock() {
//         const passwordInput = document.getElementById('master-password');
//         const unlockBtn = document.getElementById('unlock-btn');
//         const buttonText = unlockBtn.querySelector('.button-text');
//         const buttonLoading = unlockBtn.querySelector('.button-loading');
        
//         const password = passwordInput.value.trim();
        
//         if (!password) {
//             await this.vaultAnimator.animateAccessDenied();
//             passwordInput.focus();
//             return;
//         }
        
//         // Show loading state
//         buttonText.classList.add('hidden');
//         buttonLoading.classList.remove('hidden');
//         unlockBtn.disabled = true;
        
//         try {
//             // For demo purposes, accept these test passwords
//             const testPasswords = ['demo123', 'SuperSecure123!', 'admin123', 'test', 'password'];
            
//             // Simulate authentication delay
//             await new Promise(resolve => setTimeout(resolve, 1500));
            
//             if (testPasswords.includes(password) || password.length >= 6) {
//                 this.isAuthenticated = true;
                
//                 // Play vault opening animation
//                 await this.vaultAnimator.animateVaultOpening();
                
//                 // Switch to vault screen
//                 this.showVaultScreen();
                
//             } else {
//                 throw new Error('Invalid password');
//             }
            
//         } catch (error) {
//             console.error('Authentication failed:', error);
//             await this.vaultAnimator.animateAccessDenied();
//             passwordInput.value = '';
//             passwordInput.focus();
            
//         } finally {
//             // Reset button state
//             buttonText.classList.remove('hidden');
//             buttonLoading.classList.add('hidden');
//             unlockBtn.disabled = false;
//         }
//     }
    
//     async handleLock() {
//         if (confirm('Are you sure you want to lock the vault?')) {
//             this.isAuthenticated = false;
//             this.sessionStartTime = null;
//             this.clearAutoLockTimer();
            
//             // Play vault closing animation
//             await this.vaultAnimator.animateVaultClosing();
            
//             // Clear password input
//             const passwordInput = document.getElementById('master-password');
//             if (passwordInput) {
//                 passwordInput.value = '';
//             }
            
//             this.showLoginScreen();
            
//             // Clear any sensitive data from memory
//             if (window.vaultManager) {
//                 window.vaultManager.clearData();
//             }
//         }
//     }
    
//     startAutoLockTimer() {
//         this.clearAutoLockTimer();
        
//         // Auto-lock after 30 minutes of inactivity
//         this.autoLockTimer = setTimeout(() => {
//             if (confirm('Vault has been idle for 30 minutes.\nLock vault for security?')) {
//                 this.handleLock();
//             } else {
//                 // Restart timer if user chooses not to lock
//                 this.startAutoLockTimer();
//             }
//         }, 30 * 60 * 1000); // 30 minutes
//     }
    
//     clearAutoLockTimer() {
//         if (this.autoLockTimer) {
//             clearTimeout(this.autoLockTimer);
//             this.autoLockTimer = null;
//         }
//     }
    
//     resetAutoLockTimer() {
//         if (this.isAuthenticated) {
//             this.startAutoLockTimer();
//         }
//     }
    
//     updateSessionTimer() {
//         if (!this.isAuthenticated || !this.sessionStartTime) return;
        
//         const now = new Date();
//         const diff = now - this.sessionStartTime;
//         const minutes = Math.floor(diff / 60000);
//         const seconds = Math.floor((diff % 60000) / 1000);
        
//         const sessionTimeElement = document.getElementById('session-time');
//         if (sessionTimeElement) {
//             sessionTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//         }
        
//         // Update every second
//         setTimeout(() => this.updateSessionTimer(), 1000);
//     }
    
//     showToast(message, type = 'info') {
//         const toastContainer = document.getElementById('toast-container');
//         if (!toastContainer) return;
        
//         const toast = document.createElement('div');
//         toast.className = `toast ${type}`;
//         toast.textContent = message;
        
//         toastContainer.appendChild(toast);
        
//         // Remove toast after 5 seconds
//         setTimeout(() => {
//             if (toast.parentNode) {
//                 toast.parentNode.removeChild(toast);
//             }
//         }, 5000);
//     }
    
//     // Activity detection for auto-lock reset
//     setupActivityDetection() {
//         const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
//         events.forEach(event => {
//             document.addEventListener(event, () => {
//                 this.resetAutoLockTimer();
//             }, { passive: true });
//         });
//     }
// }

// // Initialize authentication when DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
//     window.authManager = new AuthManager();
//     window.authManager.setupActivityDetection();
// });


// Enhanced Authentication Module with Real Python Backend Integration
class VaultAnimationManager {
    constructor() {
        this.createAnimationOverlay();
        this.audioContext = null;
        this.initAudio();
    }
    
    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio not available:', error);
        }
    }
    
    createAnimationOverlay() {
        // Create the animation overlay HTML
        const overlay = document.createElement('div');
        overlay.id = 'vault-animation-overlay';
        overlay.innerHTML = `
            <div class="vault-opening-overlay">
                <div class="security-grid"></div>
                <div class="particles" id="particles-container"></div>
                
                <div class="vault-door-container">
                    <div class="vault-door" id="vault-door">
                        <div class="tumbler tumbler-1"></div>
                        <div class="tumbler tumbler-2"></div>
                        <div class="tumbler tumbler-3"></div>
                        <div class="tumbler tumbler-4"></div>
                        <div class="vault-lock" id="vault-lock"></div>
                    </div>
                    <div class="vault-interior" id="vault-interior">🔓</div>
                </div>
                
                <div class="vault-status" id="vault-status">Initializing</div>
                
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                
                <div class="sound-waves" id="sound-waves">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.addAnimationStyles();
        
        // Get references
        this.overlay = overlay.querySelector('.vault-opening-overlay');
        this.door = document.getElementById('vault-door');
        this.lock = document.getElementById('vault-lock');
        this.interior = document.getElementById('vault-interior');
        this.status = document.getElementById('vault-status');
        this.progress = document.getElementById('progress-fill');
        this.soundWaves = document.getElementById('sound-waves');
        this.grid = this.overlay.querySelector('.security-grid');
        this.particlesContainer = document.getElementById('particles-container');
    }
    
    addAnimationStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Vault Animation Styles */
            .vault-opening-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(10, 10, 10, 0.95), rgba(0, 0, 0, 1));
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.5s ease;
            }

            .vault-opening-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .vault-door-container {
                position: relative;
                width: 400px;
                height: 400px;
                margin-bottom: 2rem;
            }

            .vault-door {
                width: 100%;
                height: 100%;
                border: 8px solid #444;
                border-radius: 50%;
                background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                position: relative;
                transform: perspective(1000px) rotateY(0deg);
                transition: all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(149, 113, 221, 0.3);
            }

            .vault-door.opening {
                transform: perspective(1000px) rotateY(-90deg);
                opacity: 0.3;
            }

            .vault-door.closing {
                transform: perspective(1000px) rotateY(90deg);
                opacity: 0.3;
            }

            .vault-interior {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, #9571dd, #4c249d);
                border-radius: 50%;
                opacity: 0;
                transition: all 1.5s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                animation: pulseGlow 2s infinite alternate;
            }

            .vault-interior.visible {
                opacity: 1;
            }

            @keyframes pulseGlow {
                0% { box-shadow: 0 0 20px rgba(149, 113, 221, 0.5); }
                100% { box-shadow: 0 0 50px rgba(149, 113, 221, 0.8); }
            }

            .vault-lock {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                border: 6px solid #666;
                border-radius: 50%;
                background: linear-gradient(145deg, #333, #222);
                transition: all 2s ease;
            }

            .vault-lock::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 60px;
                height: 60px;
                border: 4px solid #9571dd;
                border-radius: 50%;
                transition: all 2s ease;
            }

            .vault-lock.unlocking {
                transform: translate(-50%, -50%) rotate(720deg);
                border-color: #00ff41;
            }

            .vault-lock.locking {
                transform: translate(-50%, -50%) rotate(-720deg);
                border-color: #ff4444;
            }

            .tumbler {
                position: absolute;
                border: 2px solid #555;
                border-radius: 50%;
                background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            }

            .tumbler-1 {
                top: 20%;
                left: 20%;
                width: 40px;
                height: 40px;
                animation: spin1 3s linear infinite;
            }

            .tumbler-2 {
                top: 20%;
                right: 20%;
                width: 35px;
                height: 35px;
                animation: spin2 2.5s linear infinite reverse;
            }

            .tumbler-3 {
                bottom: 20%;
                left: 20%;
                width: 30px;
                height: 30px;
                animation: spin3 2s linear infinite;
            }

            .tumbler-4 {
                bottom: 20%;
                right: 20%;
                width: 25px;
                height: 25px;
                animation: spin4 1.8s linear infinite reverse;
            }

            @keyframes spin1 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes spin2 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes spin3 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            @keyframes spin4 { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

            .vault-status {
                font-size: 2rem;
                font-weight: 700;
                text-align: center;
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                opacity: 0;
                transform: translateY(20px);
                transition: all 1s ease;
            }

            .vault-status.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .vault-status.decrypting {
                color: #ff9800;
                animation: textPulse 1s infinite;
            }

            .vault-status.access-granted {
                color: #00ff41;
                text-shadow: 0 0 20px #00ff41;
            }

            .vault-status.access-denied {
                color: #ff4444;
                text-shadow: 0 0 20px #ff4444;
                animation: shake 0.5s ease-in-out;
            }

            .vault-status.securing {
                color: #ff4444;
                animation: textPulse 1s infinite;
            }

            .vault-status.secured {
                color: #9571dd;
                text-shadow: 0 0 20px #9571dd;
            }

            @keyframes textPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }

            .progress-bar {
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                margin-top: 2rem;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #9571dd, #c5aff3);
                width: 0%;
                transition: width 0.3s ease;
                position: relative;
            }

            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }

            .security-grid {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    linear-gradient(rgba(149, 113, 221, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(149, 113, 221, 0.1) 1px, transparent 1px);
                background-size: 50px 50px;
                animation: gridPulse 3s ease-in-out infinite;
                opacity: 0;
                transition: opacity 1s ease;
            }

            .security-grid.active {
                opacity: 1;
            }

            @keyframes gridPulse {
                0%, 100% { opacity: 0.1; }
                50% { opacity: 0.3; }
            }

            .sound-waves {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 1rem;
                opacity: 0;
                transition: opacity 0.5s ease;
            }

            .sound-waves.active {
                opacity: 1;
            }

            .wave {
                width: 4px;
                background: #9571dd;
                border-radius: 2px;
                animation: wave 1.5s ease-in-out infinite;
            }

            .wave:nth-child(1) { height: 20px; animation-delay: 0s; }
            .wave:nth-child(2) { height: 35px; animation-delay: 0.1s; }
            .wave:nth-child(3) { height: 25px; animation-delay: 0.2s; }
            .wave:nth-child(4) { height: 40px; animation-delay: 0.3s; }
            .wave:nth-child(5) { height: 30px; animation-delay: 0.4s; }
            .wave:nth-child(6) { height: 45px; animation-delay: 0.5s; }
            .wave:nth-child(7) { height: 35px; animation-delay: 0.6s; }

            @keyframes wave {
                0%, 100% { transform: scaleY(0.5); opacity: 0.3; }
                50% { transform: scaleY(1); opacity: 1; }
            }

            .particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #9571dd;
                border-radius: 50%;
                animation: float 3s ease-in-out infinite;
            }

            @keyframes float {
                0%, 100% { 
                    transform: translateY(0) scale(0);
                    opacity: 0;
                }
                50% { 
                    transform: translateY(-200px) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    playTone(frequency, duration, volume = 0.1) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    speakText(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 0.9;
            utterance.volume = 0.7;
            speechSynthesis.speak(utterance);
        }
    }
    
    createParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 2 + 's';
                this.particlesContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 3000);
            }, i * 100);
        }
    }
    
    async animateVaultOpening() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            this.grid.classList.add('active');
            
            this.status.textContent = 'Authenticating...';
            this.status.className = 'vault-status visible decrypting';
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                this.progress.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 200);
            
            this.playTone(800, 0.3);
            
            setTimeout(() => {
                this.status.textContent = 'Decrypting AES-256...';
                this.soundWaves.classList.add('active');
                this.playTone(1000, 0.5);
            }, 1000);
            
            setTimeout(() => {
                this.status.textContent = 'Unlocking Vault...';
                this.lock.classList.add('unlocking');
                this.playTone(1200, 0.8);
            }, 2500);
            
            setTimeout(() => {
                this.door.classList.add('opening');
                this.playTone(600, 1.5);
                this.createParticles();
            }, 3500);
            
            setTimeout(() => {
                this.interior.classList.add('visible');
                this.status.textContent = 'Access Granted';
                this.status.className = 'vault-status visible access-granted';
                this.playTone(1500, 1);
                this.speakText('Access Granted. Welcome to Obscura Vault.');
            }, 4500);
            
            setTimeout(() => {
                this.overlay.classList.remove('active');
                resolve();
            }, 6000);
        });
    }
    
    async animateVaultClosing() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            this.grid.classList.add('active');
            
            // Reset states
            this.door.classList.remove('opening');
            this.lock.classList.remove('unlocking');
            this.interior.classList.remove('visible');
            this.soundWaves.classList.remove('active');
            this.progress.style.width = '0%';
            
            this.status.textContent = 'Securing Vault...';
            this.status.className = 'vault-status visible securing';
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 100) progress = 100;
                this.progress.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 150);
            
            this.playTone(800, 0.3);
            
            setTimeout(() => {
                this.status.textContent = 'Encrypting Data...';
                this.soundWaves.classList.add('active');
                this.playTone(600, 0.8);
            }, 800);
            
            setTimeout(() => {
                this.door.classList.add('closing');
                this.lock.classList.add('locking');
                this.playTone(400, 1.2);
                this.createParticles();
            }, 2000);
            
            setTimeout(() => {
                this.status.textContent = 'Vault Secured';
                this.status.className = 'vault-status visible secured';
                this.playTone(200, 1);
                this.speakText('Vault secured. All data encrypted.');
            }, 3500);
            
            setTimeout(() => {
                this.overlay.classList.remove('active');
                this.door.classList.remove('closing');
                this.lock.classList.remove('locking');
                this.grid.classList.remove('active');
                this.soundWaves.classList.remove('active');
                resolve();
            }, 5000);
        });
    }
    
    async animateAccessDenied() {
        return new Promise((resolve) => {
            this.overlay.classList.add('active');
            
            this.status.textContent = 'Access Denied';
            this.status.className = 'vault-status visible access-denied';
            
            this.playTone(300, 0.2);
            setTimeout(() => this.playTone(250, 0.2), 200);
            setTimeout(() => this.playTone(200, 0.3), 400);
            
            this.speakText('Access denied. Invalid credentials.');
            
            setTimeout(() => {
                this.overlay.classList.remove('active');
                resolve();
            }, 2500);
        });
    }
}

// Enhanced Authentication Module with Real Python Backend
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.sessionStartTime = null;
        this.autoLockTimer = null;
        this.vaultAnimator = new VaultAnimationManager();
        this.vaultInitialized = false;
        
        this.initializeEventListeners();
        this.checkVaultStatus();
    }
    
    initializeEventListeners() {
        const passwordInput = document.getElementById('master-password');
        const unlockBtn = document.getElementById('unlock-btn');
        const lockBtn = document.getElementById('lock-btn');
        
        // Enter key to unlock
        passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUnlock();
            }
        });
        
        // Unlock button
        unlockBtn?.addEventListener('click', () => {
            this.handleUnlock();
        });
        
        // Lock button
        lockBtn?.addEventListener('click', () => {
            this.handleLock();
        });
        
        // Auto-focus password input
        passwordInput?.focus();
    }
    
    async checkVaultStatus() {
        try {
            console.log('🔍 Checking vault status...');
            
            // Check if we're in Electron environment
            if (typeof require === 'undefined') {
                console.log('⚠️ Not in Electron environment, using demo mode');
                this.showLoginScreen();
                return;
            }
            
            const { ipcRenderer } = require('electron');
            const result = await ipcRenderer.invoke('vault-check');
            
            if (result.success && result.data.initialized) {
                this.vaultInitialized = true;
                console.log('✅ Vault found and initialized');
                this.showLoginScreen();
            } else {
                console.log('🆕 No vault found, will create on first login');
                this.vaultInitialized = false;
                this.showLoginScreen(true); // Show as new vault
            }
            
        } catch (error) {
            console.error('❌ Error checking vault status:', error);
            this.showToast('Error connecting to vault backend', 'error');
            this.showLoginScreen();
        }
    }
    
    showLoginScreen(isNewVault = false) {
        const authScreen = document.getElementById('auth-screen');
        const vaultScreen = document.getElementById('vault-screen');
        const welcomeText = document.querySelector('.welcome-text h2');
        const welcomeDesc = document.querySelector('.welcome-text p');
        
        if (authScreen && vaultScreen) {
            authScreen.classList.add('active');
            vaultScreen.classList.remove('active');
        }
        
        // Update UI based on vault status
        if (isNewVault) {
            welcomeText.textContent = 'Welcome to Obscura, Hammad Malik';
            welcomeDesc.textContent = 'Create your master password to initialize your encrypted vault';
            this.showToast('🆕 Setting up new vault with AES-256 encryption', 'info');
        } else {
            welcomeText.textContent = 'Welcome Back, Hammad Malik';
            welcomeDesc.textContent = 'Enter your master password to access your encrypted vault';
        }
    }
    
    showVaultScreen() {
        const authScreen = document.getElementById('auth-screen');
        const vaultScreen = document.getElementById('vault-screen');
        
        if (authScreen && vaultScreen) {
            authScreen.classList.remove('active');
            vaultScreen.classList.add('active');
        }
        
        // Start session timer
        this.sessionStartTime = new Date();
        this.startAutoLockTimer();
        this.updateSessionTimer();
        
        // Load vault entries
        if (window.vaultManager) {
            window.vaultManager.loadEntries();
        }
    }
    
    async handleUnlock() {
        const passwordInput = document.getElementById('master-password');
        const unlockBtn = document.getElementById('unlock-btn');
        const buttonText = unlockBtn.querySelector('.button-text');
        const buttonLoading = unlockBtn.querySelector('.button-loading');
        
        const password = passwordInput.value.trim();
        
        if (!password) {
            await this.vaultAnimator.animateAccessDenied();
            passwordInput.focus();
            return;
        }
        
        if (password.length < 8) {
            this.showToast('Master password must be at least 8 characters', 'warning');
            passwordInput.focus();
            return;
        }
        
        // Show loading state
        buttonText.classList.add('hidden');
        buttonLoading.classList.remove('hidden');
        unlockBtn.disabled = true;
        
        try {
            console.log('🔐 Attempting to unlock vault...');
            
            // Check if we're in Electron environment
            if (typeof require === 'undefined') {
                // Fallback for development
                await new Promise(resolve => setTimeout(resolve, 1500));
                throw new Error('Demo mode - use real Electron app');
            }
            
            const { ipcRenderer } = require('electron');
            let result;
            
            if (!this.vaultInitialized) {
                // Initialize new vault
                console.log('🔧 Initializing new vault...');
                result = await ipcRenderer.invoke('vault-initialize', password);
                
                if (result.success) {
                    this.vaultInitialized = true;
                    this.showToast('🎉 Vault created successfully with AES-256 encryption!', 'success');
                }
            } else {
                // Unlock existing vault
                console.log('🔓 Unlocking existing vault...');
                result = await ipcRenderer.invoke('vault-unlock', password);
            }
            
            if (result.success) {
                this.isAuthenticated = true;
                console.log('✅ Authentication successful');
                
                // Play vault opening animation
                await this.vaultAnimator.animateVaultOpening();
                
                // Switch to vault screen
                this.showVaultScreen();
                
                // Clear password input
                passwordInput.value = '';
                
            } else {
                throw new Error(result.error || 'Authentication failed');
            }
            
        } catch (error) {
            console.error('❌ Authentication failed:', error);
            await this.vaultAnimator.animateAccessDenied();
            
            // Show appropriate error message
            if (error.message.includes('Invalid password')) {
                this.showToast('🚨 Invalid master password!', 'error');
            } else if (error.message.includes('Demo mode')) {
                this.showToast('⚠️ Run with Electron for full functionality', 'warning');
            } else {
                this.showToast('❌ Authentication failed: ' + error.message, 'error');
            }
            
            passwordInput.value = '';
            passwordInput.focus();
            
        } finally {
            // Reset button state
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            unlockBtn.disabled = false;
        }
    }
    
    async handleLock() {
        if (confirm('Are you sure you want to lock the vault?')) {
            try {
                // Lock vault in backend
                if (typeof require !== 'undefined') {
                    const { ipcRenderer } = require('electron');
                    await ipcRenderer.invoke('vault-lock');
                }
                
                this.isAuthenticated = false;
                this.sessionStartTime = null;
                this.clearAutoLockTimer();
                
                // Play vault closing animation
                await this.vaultAnimator.animateVaultClosing();
                
                // Clear password input
                const passwordInput = document.getElementById('master-password');
                if (passwordInput) {
                    passwordInput.value = '';
                }
                
                this.showLoginScreen();
                
                // Clear any sensitive data from memory
                if (window.vaultManager) {
                    window.vaultManager.clearData();
                }
                
                this.showToast('🔒 Vault locked and secured', 'success');
                
            } catch (error) {
                console.error('Error locking vault:', error);
                this.showToast('Error locking vault: ' + error.message, 'error');
            }
        }
    }
    
    startAutoLockTimer() {
        this.clearAutoLockTimer();
        
        // Auto-lock after 30 minutes of inactivity
        this.autoLockTimer = setTimeout(() => {
            if (confirm('Vault has been idle for 30 minutes.\nLock vault for security?')) {
                this.handleLock();
            } else {
                // Restart timer if user chooses not to lock
                this.startAutoLockTimer();
            }
        }, 30 * 60 * 1000); // 30 minutes
    }
    
    clearAutoLockTimer() {
        if (this.autoLockTimer) {
            clearTimeout(this.autoLockTimer);
            this.autoLockTimer = null;
        }
    }
    
    resetAutoLockTimer() {
        if (this.isAuthenticated) {
            this.startAutoLockTimer();
        }
    }
    
    updateSessionTimer() {
        if (!this.isAuthenticated || !this.sessionStartTime) return;
        
        const now = new Date();
        const diff = now - this.sessionStartTime;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        const sessionTimeElement = document.getElementById('session-time');
        if (sessionTimeElement) {
            sessionTimeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update every second
        setTimeout(() => this.updateSessionTimer(), 1000);
    }
    
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
    }
    
    // Activity detection for auto-lock reset
    setupActivityDetection() {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetAutoLockTimer();
            }, { passive: true });
        });
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    window.authManager.setupActivityDetection();
});