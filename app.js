// ==========================================
// 1. Quotes from lines.md
// ==========================================
const quotes = [
  "فنجان قهوه يغير مزاج يوم كامل .",
  "مو كل فنجان قهوه يحتاج سكر ، بعض الرفقه تكفي .",
  "قهوه حلوه وشخص تحبه ، والباقي على مزاجك .",
  "القهوه تعرف شلون تعدل المزاج",
  "مرات نجي حتى نغير المزاج ونطلع بذكرى .",
  "مزاجك يستاهل الدلال .",
  "مزاجك محتاج انتعاش",
  "مزاجك تعبان ؟ انطي دفعة طاقه .",
  "اول رشفه تغير المزاج .",
  "فريش وبارد وعلى مزاجك",
  "جرعة حلاوه تعدل المزاج",
  "شي بارد , شي حلو شي يشبهك."
];

let lastQuoteIndex = -1;

function getRandomQuote() {
  let index;
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (quotes.length > 1 && index === lastQuoteIndex);
  lastQuoteIndex = index;
  return quotes[index];
}

function updateQuote(animate = true) {
  const quoteText = document.getElementById('quoteText');
  if (!quoteText) return;

  if (animate) {
    if (navigator.vibrate) {
      try { navigator.vibrate(12); } catch (_) {}
    }
    quoteText.classList.add('changing');
    setTimeout(() => {
      quoteText.textContent = getRandomQuote();
      quoteText.classList.remove('changing');
    }, 200);
  } else {
    quoteText.textContent = getRandomQuote();
  }
}

// Initial Random Line
updateQuote(false);

// Interactive Quote Shuffle on Tap/Click
const quoteCard = document.getElementById('quoteCard');
if (quoteCard) {
  quoteCard.addEventListener('click', () => updateQuote(true));
  quoteCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      updateQuote(true);
    }
  });
}

// ==========================================
// 2. Exact Speed Sync (Items = 1.2x BG Speed)
// ==========================================
function syncAnimationSpeeds() {
  const bgTileWidth = 320; // px (defined in CSS --bg-pattern-width)
  const bgDuration = 20;   // seconds (steady and slow)
  const vBg = bgTileWidth / bgDuration; // px/second = 16 px/s
  const vItems = 1.2 * vBg; // px/second = 19.2 px/s (strictly 1.2x)

  const tickerSet1 = document.getElementById('tickerSet1');
  if (tickerSet1) {
    const setWidth = tickerSet1.getBoundingClientRect().width;
    if (setWidth > 0) {
      const itemsDuration = setWidth / vItems;
      document.documentElement.style.setProperty('--items-duration', `${itemsDuration.toFixed(2)}s`);
      document.documentElement.style.setProperty('--bg-duration', `${bgDuration}s`);
    }
  }
}

window.addEventListener('load', syncAnimationSpeeds);
window.addEventListener('resize', () => {
  clearTimeout(window._resizeTimer);
  window._resizeTimer = setTimeout(syncAnimationSpeeds, 150);
});

// ==========================================
// 3. Celebration Confetti Particles (Pink, Purple, Reds)
// ==========================================
const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let dpr = 1;

function resizeCanvas() {
  dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Celebration color palette: Pink, Purple, and More Red
const CELEBRATION_COLORS = [
  // Signature and vibrant reds
  'rgba(207, 3, 4, ',     // Brand red (#cf0304)
  'rgba(225, 6, 20, ',    // Intense red
  'rgba(240, 24, 38, ',   // Bright red
  'rgba(185, 0, 15, ',    // Deep ruby red
  'rgba(255, 30, 60, ',   // Vivid scarlet
  // Pinks
  'rgba(255, 64, 129, ',  // Bright pink
  'rgba(240, 98, 146, ',  // Soft rose pink
  'rgba(233, 30, 99, ',   // Deep pink / magenta
  'rgba(255, 110, 155, ', // Bubblegum pink
  // Purples
  'rgba(156, 39, 176, ',  // Purple
  'rgba(142, 36, 170, ',  // Deep amethyst purple
  'rgba(171, 71, 188, ',  // Orchid purple
  'rgba(123, 31, 162, ',  // Royal purple
  'rgba(186, 104, 200, '  // Lavender purple
];

class CelebrationParticle {
  constructor(initY = false) {
    this.reset(initY);
  }

  reset(initY = false) {
    this.x = Math.random() * width;
    this.y = initY ? Math.random() * height : -20;
    
    // Square size (crisp celebration confetti square)
    this.size = 5 + Math.random() * 4.5;
    
    // Fall velocity (calm, graceful descent)
    this.vy = 0.75 + Math.random() * 0.95;
    
    // Base horizontal drift
    this.vx = (Math.random() - 0.5) * 0.35;
    
    // Arc flutter motion parameters
    this.arcAngle = Math.random() * Math.PI * 2;
    this.arcSpeed = 0.02 + Math.random() * 0.025;
    this.arcAmp = 0.6 + Math.random() * 0.85; // amplitude of the arc
    
    // Gentle rotation
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.05;
    
    // Color & opacity
    this.colorPrefix = CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
    this.alpha = 0.45 + Math.random() * 0.45;
  }

  update(touchEffect) {
    // Progress harmonic arc trajectory
    this.arcAngle += this.arcSpeed;
    this.x += this.vx + Math.sin(this.arcAngle) * this.arcAmp;
    this.y += this.vy + Math.cos(this.arcAngle * 0.6) * 0.25;
    
    // Rotate in space
    this.rotation += this.rotSpeed;

    // Interactive deflection from phone touch / pointer
    if (touchEffect && touchEffect.active) {
      const dx = this.x - touchEffect.x;
      const dy = this.y - touchEffect.y;
      const dist = Math.hypot(dx, dy);
      if (dist < touchEffect.radius) {
        const force = (1 - dist / touchEffect.radius) * 2.2;
        this.x += (dx / (dist || 1)) * force;
        this.y += (dy / (dist || 1)) * force * 0.6;
        this.rotation += force * 0.1;
      }
    }

    // Wrap around screen bounds
    if (this.y > height + 25) {
      this.reset(false);
    }
    if (this.x < -30) this.x = width + 20;
    if (this.x > width + 30) this.x = -20;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = `${this.colorPrefix}${this.alpha})`;
    // Draw crisp square
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

// Particle count optimized for mobile screens (super lightweight & 60fps)
const particleCount = Math.min(80, Math.max(45, Math.floor(window.innerWidth / 6)));
const particles = Array.from({ length: particleCount }, () => new CelebrationParticle(true));

// Mobile Touch Interaction
const touchState = {
  x: -999,
  y: -999,
  radius: 90,
  active: false,
  timer: null
};

function handleTouch(x, y) {
  touchState.x = x;
  touchState.y = y;
  touchState.active = true;
  clearTimeout(touchState.timer);
  touchState.timer = setTimeout(() => {
    touchState.active = false;
  }, 1000);
}

window.addEventListener('pointermove', (e) => handleTouch(e.clientX, e.clientY), { passive: true });
window.addEventListener('pointerdown', (e) => handleTouch(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchmove', (e) => {
  if (e.touches[0]) handleTouch(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });
window.addEventListener('touchstart', (e) => {
  if (e.touches[0]) handleTouch(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// Animation Loop
let isRunning = true;
function animate() {
  if (!isRunning) return;
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(touchState);
    particles[i].draw();
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Battery & Performance optimization: pause rain when page is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    isRunning = false;
  } else {
    isRunning = true;
    requestAnimationFrame(animate);
  }
});
