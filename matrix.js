// Matrix Background Animation
class MatrixBackground {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createDrops();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createDrops();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createDrops() {
        this.drops = [];
        const columns = Math.floor(this.canvas.width / 15);
        
        for (let i = 0; i < columns; i++) {
            this.drops.push({
                x: i * 15,
                y: Math.random() * this.canvas.height * -1,
                speed: Math.random() * 3 + 1,
                chars: Array(40).fill().map(() => this.getRandomChar()),
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    getRandomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
    
    animate() {
        // Clear canvas with slight trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drops.forEach(drop => {
            drop.chars.forEach((char, index) => {
                const yPos = drop.y + (index * 15);
                
                if (yPos > -20 && yPos < this.canvas.height + 20) {
                    // Calculate fade effect
                    const alpha = Math.max(0.1, 1 - (index * 0.05));
                    const greenValue = Math.max(50, 255 - (index * 10));
                    
                    this.ctx.fillStyle = `rgba(0, ${greenValue}, 0, ${alpha * drop.opacity})`;
                    this.ctx.font = '12px monospace';
                    this.ctx.fillText(char, drop.x, yPos);
                }
            });
            
            // Update position
            drop.y += drop.speed;
            
            // Reset when off screen
            if (drop.y > this.canvas.height + 100) {
                drop.y = Math.random() * -200 - 50;
                drop.speed = Math.random() * 3 + 1;
                drop.chars = Array(40).fill().map(() => this.getRandomChar());
                drop.opacity = Math.random() * 0.5 + 0.5;
            }
            
            // Occasionally change characters
            if (Math.random() < 0.02) {
                const randomIndex = Math.floor(Math.random() * drop.chars.length);
                drop.chars[randomIndex] = this.getRandomChar();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize matrix background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixBackground();
});