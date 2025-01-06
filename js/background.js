// Canvas setup
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let particles = [];
let clusterCenters = [];
const particleCount = /Mobi|Android/i.test(navigator.userAgent) ? 75 : 300;

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
        this.shrinkSpeed = Math.random() * 0.02 + 0.005; // Different speed for each particle
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= 0 || this.x >= canvas.width) this.dx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.dy *= -1;

        this.radius -= this.shrinkSpeed; // Decrease size
        if (this.radius <= 0) {
            const index = particles.indexOf(this);
            if (index > -1) particles.splice(index, 1); // Remove particle when it disappears
        } else {
            this.draw();
        }
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < Math.floor(particleCount/2); i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 3;
        const color = "#0078D7";
        particles.push(new Particle(x, y, radius, color));
    }
}

// Draw connections
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(0, 120, 215, ${1 - distance / 100})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Add new cluster
function addCluster() {
    const clusterColor = ["#6495ED", "#87CEEB", "#B0C4DE", "#4682B4"];
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const colorr = clusterColor[Math.floor(Math.random() * clusterColor.length)];
    const remainingParticles = particleCount - particles.length;
    const numParticles = Math.min(Math.max(remainingParticles, 10),Math.floor(remainingParticles/2)); // Add at least 10 particles

    for (let i = 0; i < numParticles; i++) {
        const px = x + Math.random() * 50 - 25;
        const py = y + Math.random() * 50 - 25;
        const radius = Math.random() * 2 + 5;
        const color = colorr;
        particles.push(new Particle(px, py, radius, color));
    }
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => particle.update());
    drawConnections();
    requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animate();

// Periodically add new clusters
setInterval(() => {
    addCluster();
}, 2000);
