const canvas = document.getElementById('swarmCanvas');
const ctx = canvas.getContext('2d');

const MIN_SPEED = 2.5; // Minimum speed for particles
const MAX_SPEED = 4.5; // Maximum speed for particles
const ATTRACTION_FORCE = 0.05; // Strength of attraction towards the mouse
const TARGET_VARIANCE = 0; // Max variance from the mouse pointer
const PARTICLE_NUMBER = 230;
const PARTICLE_LINE_WIDTH = 2;

const particlesArray = [];
let mouseX = 0;
let mouseY = 0;
let fps = 0; // Frames Per Second
const fpsHistory = []; // Used to calculate average frames per second
let lastTime = performance.now();
let isPaused = false;

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mouseX = canvas.width / 2;
	mouseY = canvas.height / 2;
}

// Track mouse position
canvas.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;
});

// Particle class
class Particle {

	constructor(x, y, maxspeed, colour) {
		this.x = x;
		this.y = y;
		this.speedX = x;
		this.speedY = y;
		this.maxSpeed = maxspeed;
		this.size = 5;
		this.targetX = this.getRandomVariance();
		this.targetY = this.getRandomVariance();
		this.colour = colour;
	}

	// Random variance around the target point
	getRandomVariance() {
		return Math.random() * TARGET_VARIANCE * 2 - TARGET_VARIANCE;
	}

	// Ensure random speed meets minimum speed limit
	getRandomSpeed() {
		let speed = Math.random() * 2 - 1; // Random speed between -1 and 1
		
		if (Math.abs(speed) < MIN_SPEED) {
			speed = speed > 0 ? MIN_SPEED : -MIN_SPEED; // Enforce minimum speed
		}
		
		return speed;
	}

	// Limit the particle's speed using its unique maxSpeed
	limitSpeed() {
		const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
		
		if (speed > this.maxSpeed) {
			this.speedX = (this.speedX / speed) * this.maxSpeed;
			this.speedY = (this.speedY / speed) * this.maxSpeed;
		}
	}

	// Update particle position and direction
	update() {
		// Calculate direction to target
		const dx = mouseX + this.targetX - this.x;
		const dy = mouseY + this.targetY - this.y;
		const distance = Math.sqrt(dx ** 2 + dy ** 2);

		// Gradually adjust velocity towards target
		if (distance > 1) {
			this.speedX += (dx / distance) * ATTRACTION_FORCE;
			this.speedY += (dy / distance) * ATTRACTION_FORCE;
		}

		// Limit speed after adjusting velocity to keep variation
		this.limitSpeed();

		// Move particle
		this.x += this.speedX;
		this.y += this.speedY;
	}

	// Draw particle as a line
	draw() {
		ctx.beginPath();
		const endX = this.x - this.speedX * this.size;
		const endY = this.y - this.speedY * this.size;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(endX, endY);
		ctx.strokeStyle = this.colour;
		ctx.lineWidth = PARTICLE_LINE_WIDTH;
		ctx.stroke();
	}
}

function getParticleColour(index)
{
	const hue = ((230 / PARTICLE_NUMBER) * index) - 30;
	return 'hsl(' + hue + ',90%,50%)';
}

// Function to calculate the coordinates
function getCirclePoint(angleDegrees, radius) {
    // Convert the angle to radians
    const angleRadians = angleDegrees * (Math.PI / 180);

    // Calculate the x and y coordinates
    const x = radius * Math.cos(angleRadians);
    const y = radius * Math.sin(angleRadians);

    return { x, y };
}

// Initialize particles
function initializeParticles() {

	particlesArray.length = 0; // Clear existing particles
	
	maxSpeed = MIN_SPEED; // Gradually increase speed from min to max
	maxSpeedIncrement = (MAX_SPEED - MIN_SPEED) / PARTICLE_NUMBER;
	start_fraction = Math.random() - 0.5;
	
	for (let i = 0; i < PARTICLE_NUMBER; i++) {
	
		const point = getCirclePoint((i / PARTICLE_NUMBER) * 90, canvas.height / 2);
		const x = point.x;
		const y = (canvas.height * start_fraction) + point.y + (canvas.height / 2);
		particlesArray.push(new Particle(x, y, maxSpeed, getParticleColour(i)));
		maxSpeed += maxSpeedIncrement;
	}
}

// Animation loop
function animate(timestamp) {

	if (!isPaused) {
 
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;

		// Calculate FPS
		fps = Math.round(1000 / deltaTime);
		fpsHistory.push(1000 / deltaTime);
		if (fpsHistory.length > 60) fpsHistory.shift();
		fps = Math.round(fpsHistory.reduce((a, b) => a + b) / fpsHistory.length);
		  
		ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade effect
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	
		//for (const particle of [...particlesArray].reverse()) {
		for (const particle of particlesArray) {
			particle.update();
			particle.draw();
		}
		
		ctx.fillStyle = 'white';
		ctx.font = '20px Arial';
		ctx.fillText(`FPS: ${fps}`, 10, 30);
	}
	
	requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
	resizeCanvas();
});

// Listen for Space bar to toggle pause/resume
document.addEventListener('keydown', (event) => {
if (event.code === 'Space') {
	isPaused = !isPaused;
	if (!isPaused) {
		draw(); // Resume animation
	}
}
});
  
// Initial setup
resizeCanvas();
initializeParticles();
animate();
