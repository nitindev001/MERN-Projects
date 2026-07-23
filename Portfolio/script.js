// ─── Cursor ───
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a,button,.float-card,.contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.transform = 'translate(-50%,-50%) scale(1.4)'; ring.style.borderColor = 'rgba(0,212,255,0.8)'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.borderColor = 'rgba(0,212,255,0.5)'; });
});

// ─── Canvas Particles ───
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize);
for (let i = 0; i < 100; i++) {
  pts.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-.5)*0.3, vy: (Math.random()-.5)*0.3, r: Math.random()*1.5+0.5, o: Math.random()*0.5+0.1 });
}
function drawCanvas() {
  ctx.clearRect(0,0,W,H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x<0||p.x>W) p.vx*=-1;
    if (p.y<0||p.y>H) p.vy*=-1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,212,255,${p.o})`;
    ctx.fill();
  });
  // Connect nearby particles
  for (let i = 0; i < pts.length; i++) {
    for (let j = i+1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${0.06*(1-d/120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ─── 3D Tilt Cards ───
document.querySelectorAll('.float-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width/2, cy = r.height/2;
    const rx = (y-cy)/cy*10, ry = -(x-cx)/cx*10;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    card.style.setProperty('--mx', `${(x/r.width)*100}%`);
    card.style.setProperty('--my', `${(y/r.height)*100}%`);
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  });
});

// ─── Scroll Reveal ───
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i*80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ─── Skill Bar Animation ───
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-wrapper').forEach(el => barObserver.observe(el));

// ─── Typed Effect on Hero ───
const badge = document.querySelector('.hero-badge');
if (badge) {
  const text = badge.textContent.trim();
  badge.textContent = '';
  const dot = document.createElement('span');
  dot.className = 'badge-dot';
  badge.appendChild(dot);
  const span = document.createElement('span');
  badge.appendChild(span);
  let i = 0;
  setTimeout(() => {
    const type = () => { if (i < text.length) { span.textContent += text[i++]; setTimeout(type, 50); } };
    type();
  }, 600);
}