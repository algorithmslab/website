const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 20;
const connectionDistance = 150;
let particles = [];

class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
        this.highlight = false;
    }

    draw() {
        // Draw the circle node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.highlight ? "rgba(255, 255, 0, 0.8)" : this.color;
        ctx.fill();

        // Highlight effect (outer ring)
        if (this.highlight) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    update() {
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
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 10; // Node size
        const color = "#0078D7"; // Default node color
        particles.push(new Particle(x, y, radius, color));
    }
}

// Draw connections and highlight paths dynamically
function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);

                // Dynamic highlight
                if (particles[i].highlight || particles[j].highlight) {
                    ctx.strokeStyle = `rgba(255, 255, 0, ${1 - distance / connectionDistance})`;
                } else {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
                }

                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Animate viral spread
function spreadViral(index) {
    particles[index].highlight = true;

    // Spread to neighbors within connection distance
    particles.forEach((p, i) => {
        if (i !== index) {
            const dx = particles[index].x - p.x;
            const dy = particles[index].y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                setTimeout(() => spreadViral(i), 300); // Delay for animation
            }
        }
    });
}

// Animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => particle.update());
    drawConnections();
    requestAnimationFrame(animate);
}

// Trigger viral spread on click
canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    particles.forEach((particle, index) => {
        const dx = particle.x - mouseX;
        const dy = particle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particle.radius) {
            spreadViral(index);
        }
    });
});

// Handle window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

initParticles();
animate();
