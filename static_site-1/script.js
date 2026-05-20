/* Astra Nexus interactions
   This file keeps the motion layered but lightweight: loader, menu, reveal effects,
   particle field, tilt interactions, theme switching, and an ambient synth toggle. */

const loader = document.getElementById('loader');
const themeToggle = document.getElementById('themeToggle');
const soundToggle = document.getElementById('soundToggle');
const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
const orbitalStage = document.getElementById('orbitalStage');
const particlesCanvas = document.getElementById('particles');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

if (navMobile) {
  navMobile.hidden = true;
}

if (menuToggle) {
  menuToggle.setAttribute('aria-expanded', 'false');
}

const state = {
  theme: localStorage.getItem('astra-theme') || 'dark',
  soundEnabled: localStorage.getItem('astra-sound') === 'true'
};

function applyTheme(theme) {
  const isLight = theme === 'light';
  document.body.dataset.theme = isLight ? 'light' : 'dark';
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.textContent = isLight ? 'Light' : 'Dark';
  localStorage.setItem('astra-theme', theme);
}

applyTheme(state.theme);

function setLoaderHidden() {
  if (!loader) return;
  loader.classList.add('is-hidden');
  setTimeout(() => loader.remove(), 900);
}

window.addEventListener('load', () => {
  setTimeout(setLoaderHidden, 900);
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const tiltCards = document.querySelectorAll('.tilt-card');

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateTilt(card, event) {
  if (prefersReducedMotion) return;
  const rect = card.getBoundingClientRect();
  const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  const rotateY = clamp(offsetX * 12, -12, 12);
  const rotateX = clamp(-offsetY * 10, -10, 10);
  card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
}

function resetTilt(card) {
  card.style.transform = '';
}

tiltCards.forEach(card => {
  card.addEventListener('pointermove', event => updateTilt(card, event));
  card.addEventListener('pointerleave', () => resetTilt(card));
});

function updateStageMotion(event) {
  if (!orbitalStage || prefersReducedMotion) return;
  const rect = orbitalStage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  orbitalStage.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
}

function resetStageMotion() {
  if (!orbitalStage) return;
  orbitalStage.style.transform = '';
}

if (orbitalStage) {
  orbitalStage.addEventListener('pointermove', updateStageMotion);
  orbitalStage.addEventListener('pointerleave', resetStageMotion);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = navMobile.hasAttribute('hidden') === false;
  navMobile.hidden = isOpen;
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
});

navMobile?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
});

// Ambient sound uses Web Audio so the site stays self-contained and does not need media files.
let audioContext;
let droneNodes = [];

function createDrone() {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.frequency.value = 58;
  filter.type = 'lowpass';
  filter.frequency.value = 540;
  gain.gain.value = 0.0001;

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  gain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.8);

  return { oscillator, gain };
}

async function setSound(enabled) {
  soundToggle.setAttribute('aria-pressed', String(enabled));
  soundToggle.textContent = enabled ? 'Sound on' : 'Sound';
  localStorage.setItem('astra-sound', String(enabled));

  if (enabled) {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    if (!droneNodes.length) {
      droneNodes = [createDrone(), createDrone()].filter(Boolean);
    }
    return;
  }

  droneNodes.forEach(node => {
    if (!node) return;
    node.gain.gain.cancelScheduledValues(audioContext.currentTime);
    node.gain.gain.linearRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
    node.oscillator.stop(audioContext.currentTime + 0.25);
  });
  droneNodes = [];
}

soundToggle?.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  setSound(state.soundEnabled);
});

if (state.soundEnabled) {
  // The promise is intentionally not awaited here because autoplay restrictions can block first playback.
  setSound(true);
}

// Particle field keeps the background animated without external dependencies.
const ctx = particlesCanvas.getContext('2d');
let width = 0;
let height = 0;
let devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
const particles = [];
const pointer = { x: 0.5, y: 0.5 };

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  particlesCanvas.width = Math.floor(width * devicePixelRatio);
  particlesCanvas.height = Math.floor(height * devicePixelRatio);
  particlesCanvas.style.width = `${width}px`;
  particlesCanvas.style.height = `${height}px`;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function createParticles() {
  const targetCount = Math.round(Math.min(140, Math.max(55, width / 14)));
  particles.length = 0;

  for (let index = 0; index < targetCount; index += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.7,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.5 + 0.25
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, width, height);

  const glowX = pointer.x * width;
  const glowY = pointer.y * height;

  const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, Math.max(width, height) * 0.45);
  gradient.addColorStop(0, 'rgba(108, 249, 255, 0.12)');
  gradient.addColorStop(0.4, 'rgba(139, 125, 255, 0.05)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  particles.forEach(particle => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -40) particle.x = width + 40;
    if (particle.x > width + 40) particle.x = -40;
    if (particle.y < -40) particle.y = height + 40;
    if (particle.y > height + 40) particle.y = -40;

    ctx.beginPath();
    ctx.fillStyle = `rgba(198, 236, 255, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  for (let left = 0; left < particles.length; left += 1) {
    for (let right = left + 1; right < particles.length; right += 1) {
      const a = particles[left];
      const b = particles[right];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 120) {
        ctx.strokeStyle = `rgba(108, 249, 255, ${(1 - distance / 120) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  if (!prefersReducedMotion) {
    requestAnimationFrame(drawParticles);
  }
}

resizeCanvas();
createParticles();
if (!prefersReducedMotion) {
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

window.addEventListener('pointermove', event => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

window.addEventListener('scroll', () => {
  const scrollRatio = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
  root.style.setProperty('--scroll-progress', scrollRatio.toFixed(3));
});
