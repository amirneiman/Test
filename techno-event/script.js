// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
    navLinks.classList.toggle('active', open);
    mobileMenuBtn.classList.toggle('active', open);
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
}

mobileMenuBtn.addEventListener('click', () => {
    setMenu(!navLinks.classList.contains('active'));
});

navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') setMenu(false);
});

// Countdown to doors
const EVENT_START = new Date('2026-12-12T23:00:00+01:00');
const countdown = document.getElementById('countdown');
const cdValues = {};
countdown.querySelectorAll('[data-unit]').forEach((el) => {
    cdValues[el.dataset.unit] = el;
});

function updateCountdown() {
    const diff = Math.max(0, EVENT_START - Date.now());
    const pad = (n) => String(n).padStart(2, '0');

    cdValues.days.textContent = pad(Math.floor(diff / 86400000));
    cdValues.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    cdValues.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
    cdValues.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Timetable room tabs
const tabs = document.querySelectorAll('.tab');
const timetables = document.querySelectorAll('.timetable');

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        tabs.forEach((t) => {
            const active = t === tab;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', String(active));
        });
        timetables.forEach((table) => {
            table.hidden = table.dataset.room !== tab.dataset.room;
        });
    });
});

// Ticket purchase (placeholder)
document.querySelectorAll('.ticket-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
        const original = btn.textContent;
        btn.textContent = 'Redirecting…';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
        }, 1800);
    });
});

// Resale alert form
const notifyForm = document.getElementById('notify-form');
const notifyMsg = document.getElementById('notify-msg');

notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    notifyMsg.textContent = "You're on the list. We'll ping you when tickets drop.";
    notifyForm.reset();
});

// Hero waveform — beat-synced oscilloscope at 135 BPM
const canvas = document.getElementById('hero-wave');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const BPM = 135;
const BEAT_MS = 60000 / BPM;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawWave(time) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const mid = h * 0.5;
    // Kick envelope: sharp attack on each beat, exponential decay
    const beatPhase = (time % BEAT_MS) / BEAT_MS;
    const kick = Math.exp(-beatPhase * 6);

    ctx.clearRect(0, 0, w, h);

    const lines = [
        { color: 'rgba(198, 255, 0, 0.9)', amp: 0.18, freq: 0.012, speed: 0.0018, width: 2 },
        { color: 'rgba(198, 255, 0, 0.35)', amp: 0.12, freq: 0.02, speed: -0.0012, width: 1 },
        { color: 'rgba(255, 46, 59, 0.4)', amp: 0.08, freq: 0.034, speed: 0.0026, width: 1 },
    ];

    lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        for (let x = 0; x <= w; x += 4) {
            const env = Math.sin((x / w) * Math.PI); // taper at edges
            const y = mid
                + Math.sin(x * line.freq + time * line.speed) * h * line.amp * (0.35 + kick * 0.65) * env
                + Math.sin(x * line.freq * 3.1 + time * line.speed * 2) * h * 0.02 * kick * env;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    });

    if (!reduceMotion) requestAnimationFrame(drawWave);
}

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    if (reduceMotion) drawWave(0);
});
requestAnimationFrame(drawWave);
