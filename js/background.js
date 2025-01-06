const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 100;
const clusterCount = 4;
let clusters = [];

// Generate clusters
for (let i = 0; i < clusterCount; i++) {
    clusters.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    });
}

class Particle {
    constructor(x, y, radius, color, cluster) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.cluster = cluster;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        const cluster = clusters[this.cluster];
        const attractionForce = 0.01;
        const dx = cluster.x - this.x;
        const dy = cluster.y - this.y;

        this.dx += dx * attractionForce;
        this.dy += dy * attractionForce;

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= 0 || this.x >= canvas.width) this.dx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.dy *= -1;

        this.draw();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        const clusterIndex = Math.floor(Math.random() * clusters.length);
        const x = clusters[clusterIndex].x + Math.random() * 50 - 25;
        const y = clusters[clusterIndex].y + Math.random() * 50 - 25;
        const radius = Math.random() * 2 + 1;
        const color = clusters[clusterIndex].color;
        particles.push(new Particle(x, y, radius, color, clusterIndex));
    }
}

// Draw connections
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for 
