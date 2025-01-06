// Get the canvas and its context
const canvas = document.getElementById("background-canvas");
const ctx = canvas.getContext("2d");

// Function to set the canvas to fill the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Call it once to set initial size
resizeCanvas();

// Number of circles (nodes)
const particleCount = 10;
// Max distance for drawing connections
const connectionDistance = 150;
// Array to store our circles
let particles = [];

// Particle class (circle node)
class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // Random initial velocity
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    // Whether this circle is "highlighted" by viral spread
    this.highlight = false;
  }

  draw() {
    // Draw circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // Fill color depends on highlight
    if (this.highlight) {
      ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fill();

    // Draw outer ring if highlighted
    if (this.highlight) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 0, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // Bounce off the walls
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
      this.dx *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
      this.dy *= -1;
    }

    this.draw();
  }
}

// Create initial set of particles (circles)
function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 10; // size of the circle
    const color = "#0078D7"; // default color
    particles.push(new Particle(x, y, radius, color));
  }
}

// Draw lines between nearby circles
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

        // If either circle is highlighted, draw a "yellow" line
        if (particles[i].highlight || particles[j].highlight) {
          ctx.strokeStyle = `rgba(255, 255, 0, ${1 - distance / connectionDistance})`;
        } else {
          // Otherwise, draw a white line
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
        }
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

// Spread the "viral" highlight from one node to its neighbors
function spreadViral(index) {
  // Mark current node as highlighted
  particles[index].highlight = true;

  // Spread to neighbors within connectionDistance
  for (let i = 0; i < particles.length; i++) {
    if (i !== index && !particles[i].highlight) {
      const dx = particles[index].x - particles[i].x;
      const dy = particles[index].y - particles[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If close enough, schedule a delayed highlight spread
      if (distance < connectionDistance) {
        setTimeout(() => {
          spreadViral(i);
        }, 300);
      }
    }
  }
}

// Main animation loop
function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update particles (move + draw)
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }

  // Draw lines between particles
  drawConnections();

  requestAnimationFrame(animate);
}

// Handle click event to initiate viral spread
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check if a circle was clicked
  for (let i = 0; i < particles.length; i++) {
    const dx = particles[i].x - mouseX;
    const dy = particles[i].y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If mouse is within the radius of a circle
    if (distance < particles[i].radius) {
      spreadViral(i);
    }
  }
});

// Listen for window resize and adjust canvas + particles
window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

// Initialize everything
initParticles();
animate();
