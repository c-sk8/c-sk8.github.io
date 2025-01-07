const canvas = document.getElementById('canvas');
// Hide mouse pointer when over the canvas
canvas.style.cursor = 'none';
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const rocks = [];
const numRocks = 10;
const stiffness = 0.8; // Elastic band stiffness
const damping = 0.7; // Friction to slow down motion
const rockMass = 5;
const segmentSize = 10;

// Initialize rocks in a straight line
for (let i = 0; i < numRocks; i++) {
    rocks.push({
        x: canvas.width / 2 + i * segmentSize,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
    });
}

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Track mouse position
const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY - canvas.getBoundingClientRect().top;
});

function applyForces() {
    // Set the first rock to follow the mouse directly
    const first = rocks[0];
    first.x = mouse.x;
    first.y = mouse.y;

    // Apply elastic forces between rocks
    for (let i = 1; i < rocks.length; i++) {
        const current = rocks[i];
        const previous = rocks[i - 1];

        const dx = previous.x - current.x;
        const dy = previous.y - current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = (distance - segmentSize) * stiffness; // Target distance is 20

        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        current.vx += fx;
        current.vy += fy;
        previous.vx -= fx;
        previous.vy -= fy;
    }

    // Apply damping and update positions
    rocks.forEach((rock, index) => {
        if (index > 0) { // Skip damping for the first rock
            rock.vx *= damping;
            rock.vy *= damping;
            rock.x += rock.vx;
            rock.y += rock.vy;
        }
    });
}

function draw() {
  	ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elastic band
    ctx.beginPath();
    ctx.moveTo(rocks[0].x, rocks[0].y);
  	//console.log(rocks[0].x + " " + rocks[0].y);
   for (let i = 1; i < rocks.length; i++) {
        	ctx.lineTo(rocks[i].x, rocks[i].y);
    }
    ctx.strokeStyle = '#D1C771';
    ctx.lineWidth = 8;
	ctx.lineJoin = 'round'; // Set line join to round
    ctx.stroke();

    // Draw rocks
    rocks.forEach((rock) => {
        ctx.beginPath();
        ctx.arc(rock.x, rock.y, rockMass, 0, Math.PI * 2);
      ctx.fillStyle = '#66B1C9';
        ctx.fill();
    });
}

function animate() {
    applyForces();
    draw();
    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
	resizeCanvas();
});

animate();
