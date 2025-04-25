const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const particles = [];
const pressures = [];
const NUM_CENTERS = 12;
const MARGIN = 100;
const MIN_DIST = 100;
const SPAWN_DELAY = 0;

let max_paticles = 500;
let line_width = 1;

function setParams() {
  const params = new URLSearchParams(window.location.search);
  if(params.get('linewidth') != null) line_width = params.get('linewidth');
  if(params.get('maxparticles') != null) max_paticles = params.get('maxparticles');
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function createPressureCenters() {
  let attempts = 0;
  while (pressures.length < NUM_CENTERS && attempts < 1000) {
    attempts++;
    const candidate = {
      x: MARGIN + Math.random() * (w - 2 * MARGIN),
      y: MARGIN + Math.random() * (h - 2 * MARGIN),
      type: Math.random() < 0.5 ? 'L' : 'H'
    };

    let tooClose = false;
    for (const existing of pressures) {
      if (distance(candidate, existing) < MIN_DIST) {
        tooClose = true;
        break;
      }
    }

    if (!tooClose) {
      pressures.push(candidate);
    }
  }
}

setParams();
createPressureCenters();

function getWindVector(x, y) {
  let vx = 0;
  let vy = 0;
  for (const p of pressures) {
    const dx = x - p.x;
    const dy = y - p.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq) + 0.1;
    const strength = 30000 / distSq;

    const perpX = -dy / dist;
    const perpY = dx / dist;

    if (p.type === 'L') {
      vx -= perpX * strength;
      vy -= perpY * strength;
      vx -= dx / dist * strength * 0.5;
      vy -= dy / dist * strength * 0.5;
    } else {
      vx += perpX * strength;
      vy += perpY * strength;
      vx += dx / dist * strength * 0.5;
      vy += dy / dist * strength * 0.5;
    }
  }
  return { vx, vy };
}

function spawnParticleFromHigh() {
  const highs = pressures.filter(p => p.type === 'H');
  for (const h of highs) {
    if (particles.length >= max_paticles) return;
    const angle = Math.random() * 2 * Math.PI;
    const radius = 10;
    particles.push({
      x: h.x + Math.cos(angle) * radius,
      y: h.y + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      hue: angle * (360 / (2 * Math.PI)),
      saturation: (Math.random() * 20) + 50,
      lightness: (Math.random() * 30) + 40
	});
  }
}

// Spawn new particles for each high pressure point after a delay
setInterval(spawnParticleFromHigh, SPAWN_DELAY);

function respawnParticle(p) {
  const highs = pressures.filter(c => c.type === 'H');
  if (highs.length > 0) {
    const spawn = highs[Math.floor(Math.random() * highs.length)];
    const angle = Math.random() * Math.PI * 2;
    const radius = 10;
    p.x = spawn.x + Math.cos(angle) * radius;
    p.y = spawn.y + Math.sin(angle) * radius;
    p.vx = 0;
    p.vy = 0;
    p.hue = angle * (360 / (2 * Math.PI));
    p.saturation = (Math.random() * 20) + 50;
    p.lightness = (Math.random() * 30) + 40;
  }
}

function animate() {
  // No canvas clearing = permanent trails
		//ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Fade effect
		//ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    const oldX = p.x;
    const oldY = p.y;

    const { vx, vy } = getWindVector(p.x, p.y);
    p.vx = vx * 0.02;
    p.vy = vy * 0.02;

    p.x += p.vx;
    p.y += p.vy;

    let respawned = false;

    for (const center of pressures) {
      if (center.type === 'L') {
        const dx = p.x - center.x;
        const dy = p.y - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) {
          respawnParticle(p);
          respawned = true;
          break;
        }
      }
    }

	if (!respawned) {
		ctx.strokeStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 10%)`;
		ctx.lineWidth = line_width;
		ctx.lineCap = 'round';
		ctx.beginPath();
		ctx.moveTo(oldX, oldY);
		ctx.lineTo(p.x, p.y);
		ctx.stroke();
	}
  }

  requestAnimationFrame(animate);
}

animate();