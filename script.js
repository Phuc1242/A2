const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let width, height;

// Cấu hình trái tim (Công thức Cardioid)
const heartPath = (t) => {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x, y: y };
};

// Cấu hình hạt (Particle)
class Particle {
    constructor(x, y, color, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.targetX = targetX; 
        this.targetY = targetY; 
        this.radius = Math.random() * 1.5 + 0.5;
        this.color = color;
        this.opacity = Math.random();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.shadowBlur = 5; // Thêm hiệu ứng phát sáng (Glow)
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        // Hạt lấp lánh (opacity)
        this.opacity += (Math.random() - 0.5) * 0.05;
        if (this.opacity > 1) this.opacity = 1;
        if (this.opacity < 0) this.opacity = 0;
        
        // Tốc độ di chuyển MẠNH hơn về vị trí mục tiêu (Tụ lại nhanh hơn)
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * 0.1; // Tăng từ 0.05 lên 0.1
        this.y += dy * 0.1;
    }
}

let heartParticles = [];
let starParticles = [];
let isHeartFormed = false; // Biến kiểm tra trái tim đã hình thành chưa

function initCanvasSize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function createHeartParticles() {
    const scale = Math.min(width, height) / 20;
    const offsetX = width / 2;
    const offsetY = height / 2;
    
    heartParticles = []; 

    for (let t = 0; t < Math.PI * 2; t += 0.01) { 
        const point = heartPath(t);
        
        const targetX = point.x * scale + offsetX;
        const targetY = point.y * scale + offsetY;
        
        const startX = Math.random() * width;
        const startY = Math.random() * height;

        heartParticles.push(new Particle(startX, startY, '255, 100, 150', targetX, targetY));
    }
}

function createStarParticles() {
    for (let i = 0; i < 300; i++) { // Tăng số lượng sao (từ 200 lên 300)
        const x = Math.random() * width;
        const y = Math.random() * height;
        starParticles.push(new Particle(x, y, '255, 255, 255', x, y)); 
    }
}

let lastTime = 0;
const heartBeatDuration = 1000; // Nhịp đập nhanh hơn (1 giây)
let scaleFactor = 1.0;
let rotation = 0;

function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const timeRatio = (currentTime % heartBeatDuration) / heartBeatDuration;
scaleFactor = 1.0 + Math.sin(timeRatio * Math.PI * 2) * 0.05; // Biên độ rung mạnh hơn
    rotation += 0.003; // Xoay nhanh hơn

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; 
    ctx.fillRect(0, 0, width, height);
    
    // Cập nhật và vẽ ngôi sao (nền vũ trụ)
    starParticles.forEach(p => {
        p.update();
        p.draw();
    });

    ctx.save();
    
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation); 
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(-width / 2, -height / 2);

    heartParticles.forEach(p => {
        p.update(); 
        p.draw();
    });

    ctx.restore();

    requestAnimationFrame(animate);
}

// Khởi tạo
window.addEventListener('resize', () => {
    initCanvasSize();
    createStarParticles();
    createHeartParticles();
});

initCanvasSize();
createStarParticles();
createHeartParticles();
animate(0);