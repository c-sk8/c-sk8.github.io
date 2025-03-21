const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const points = [];
let angleX = 0;
let angleY = 0;
let angleZ = 0;
let size = 500;
let step = 50;

// Set canvas size to match window size
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Create cube points
for (let x = -size / 2; x <= size / 2; x += step) {
    for (let y = -size / 2; y <= size / 2; y += step) {
        for (let z = -size / 2; z <= size / 2; z += step) {
        	let red = 255;
        	let green = ((y + size/2) / size) * 150;
         	let blue = ((z + size/2) / size) * 200;
           points.push({ x, y, z, red, green, blue});
        }
    }
}

function rotateX(point, angle) {
    let y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
    return { x: point.x, y, z, red: point.red, green: point.green, blue: point.blue};
}

function rotateY(point, angle) {
    let x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
    let z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
    return { x, y: point.y, z, red: point.red, green: point.green, blue: point.blue };
}

function rotateZ(point, angle) {
    let x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
    let y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
    return { x, y, z: point.z, red: point.red, green: point.green, blue: point.blue };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let projected = points.map(p => rotateX(rotateY(rotateZ(p, angleZ), angleY), angleX));

	const sorted_projected = projected.slice().sort((a, b) => b.z - a.z);

    sorted_projected.forEach(p => {
        let scale = 900 / (900 + p.z);
        let screenX = canvas.width / 2 + p.x * scale;
        let screenY = canvas.height / 2 + p.y * scale;

        // Calculate brightness based on z-depth
        let brightness = (1 - ((p.z + (size / 2)) / size)) * 1.5;
        let red = brightness * p.red;
        let green = brightness * p.green;
        let blue = brightness * p.blue;
        let color = `rgb(${red}, ${green}, ${blue})`;

        ctx.beginPath();
        ctx.arc(screenX, screenY, 3 + (1 - ((p.z + (size / 2)) / size)) * 3, 0, Math.PI * 2);
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