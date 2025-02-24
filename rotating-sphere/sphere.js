const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const points = [];
const numLatitude = 30;
const numMissingRows = 2;
const numLongitude = 60;
const radius = 200;
let angleX = 0;
let angleY = 0;
let angleZ = 0;

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Generate sphere points
for (let i = numMissingRows; i <= numLatitude - numMissingRows; i++) {
    let theta = (i * Math.PI) / numLatitude;
    for (let j = 0; j <= numLongitude; j++) {
        let phi = (j * 2 * Math.PI) / numLongitude;
        let x = radius * Math.sin(theta) * Math.cos(phi);
        let y = radius * Math.cos(theta);
        let z = radius * Math.sin(theta) * Math.sin(phi);
        points.push({ x, y, z });
    }
}

function rotateX(point, angle) {
    let y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
    return { x: point.x, y, z };
}

function rotateY(point, angle) {
    let x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
    return { x, y: point.y, z };
}

function rotateZ(point, angle) {
    let x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    let y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
    return { x, y, z: point.z };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //let projected = points.map(p => rotateX(rotateY(p, angleY), angleX));
    let projected = points.map(p => rotateX(rotateY(rotateZ(p, angleZ), angleY), angleX));

	const sorted_projected = projected.slice().sort((a, b) => b.z - a.z);

    sorted_projected.forEach(p => {
        let scale = 600 / (600 + p.z);
        let screenX = canvas.width / 2 + p.x * scale;
        let screenY = canvas.height / 2 + p.y * scale;

        // Calculate brightness based on z-depth
        let brightness = Math.max(0, Math.min(255, 255 - ((p.z + radius/1.8) / (2 * radius)) * 255));
        let color = `rgb(${brightness}, ${brightness}, ${brightness})`;

        ctx.beginPath();
        ctx.arc(screenX, screenY, 1 + brightness / 255, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    });

    angleX += 0.003;
    angleY += 0.003;
    angleZ += 0.005;
    
   requestAnimationFrame(draw);
}

// Handle window resize
window.addEventListener('resize', () => {
	resizeCanvas();
});

draw();
