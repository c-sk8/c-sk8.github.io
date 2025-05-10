const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

const horizon = height / 2 + 60;
const sunlight = normalize([1, -1, 0.5]);
const cloudParticles = [];

let time = 0;

function normalize(v) {
    const len = Math.hypot(...v);
    return v.map(n => n / len);
}

function createCloudGroup(offsetX, count, zStart = 0, zEnd = 500) {
    for (let i = 0; i < count; i++) {
        cloudParticles.push({
            x0: offsetX + (Math.random() - 0.5) * 200,
            y0: (Math.random() + 0.2) * 100,
            z: Math.random() * (zEnd - zStart) + zStart,
            swirl: Math.random() * Math.PI * 2,
            distant: zStart > 500  // mark as distant for special styling
        });
    }
}

// Main clouds
createCloudGroup(0, 800);      // Center
createCloudGroup(-300, 150);   // Left
createCloudGroup(300, 150);    // Right

// Distant clusters
//createCloudGroup(-200, 80, 500, 700);
//createCloudGroup(200, 80, 500, 700);
//createCloudGroup(0, 80, 500, 700);

function project(x, y, z) {
    const scale = 400 / (z + 500);
    return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        r: 20 * scale
    };
}

function drawSky() {
    const grad = ctx.createLinearGradient(0, 0, 0, horizon);
    grad.addColorStop(0, "#3355aa");
    grad.addColorStop(0.7, "#aaccee");
    grad.addColorStop(1, "#eeeeee");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, horizon);
}

function drawGround() {
    const grad = ctx.createLinearGradient(0, horizon, 0, height);
    grad.addColorStop(0, "#eeeeee");
    grad.addColorStop(0.4, "#77aa77");
    grad.addColorStop(1, "#335533");
    ctx.fillStyle = grad;
    ctx.fillRect(0, horizon, width, height - horizon);
}

function render() {
    time += 0.01;

    for (const p of cloudParticles) {
        p.z -= 2;

        // Swirl motion
        const swirlRadius = p.distant ? 15 : 25;
        const swirlSpeed = p.distant ? 0.5 : 1;
        const swirl = time * swirlSpeed + p.swirl;
        p.x = p.x0 + Math.sin(swirl) * swirlRadius;
        p.y = p.y0 + Math.cos(swirl) * swirlRadius;

        // Recycle when passing viewer
        if (p.z < -500) {
            p.z = 500 + Math.random() * 200;
            p.x0 = (Math.random() - 0.5) * 200 + (Math.random() < 0.33 ? -300 : (Math.random() < 0.5 ? 300 : 0));
            p.y0 = (Math.random() + 0.2) * 100;
            p.distant = Math.random() < 0.2;
        }
    }

    ctx.clearRect(0, 0, width, height);
    drawSky();
    drawGround();

    cloudParticles.sort((a, b) => b.z - a.z);

    for (const p of cloudParticles) {
        const proj = project(p.x, p.y, p.z);

        const lightVec = normalize([p.x, p.y, p.z]);
        const dot = Math.max(0, lightVec[0] * sunlight[0] + lightVec[1] * sunlight[1] + lightVec[2] * sunlight[2]);

        const base = p.distant ? 150 : 180;
        const brightness = base + dot * (255 - base);
        const r = Math.floor(brightness);
        const g = Math.floor(brightness);
        const b = Math.floor(p.distant ? brightness + 60 : brightness + 30);
        const alpha = p.distant ? 0.05 : 0.1;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.arc(proj.x, proj.y, proj.r, 0, Math.PI * 2);
        ctx.fill();
    }

    requestAnimationFrame(render);
}

render();
