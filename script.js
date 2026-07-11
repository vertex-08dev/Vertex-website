// ==========================================
// 1. SCROLL REVEAL ENGINE
// ==========================================
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -10% 0px" };

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
  const rect = el.getBoundingClientRect();
  if(rect.top < window.innerHeight) el.classList.add('active');
});

// ==========================================
// 2. MENU LOGIC & MOBILE HAMBURGER
// ==========================================
const hamburger = document.getElementById('hamburger');
const menuPanel = document.getElementById('menuPanel');
const menuOverlay = document.getElementById('menuOverlay');

const toggleMenu = (forceState) => {
  const isActive = forceState !== undefined ? forceState : !menuPanel.classList.contains('active');
  hamburger.classList.toggle('active', isActive);
  menuPanel.classList.toggle('active', isActive);
  menuOverlay.classList.toggle('active', isActive);
  hamburger.setAttribute('aria-expanded', isActive);
  menuPanel.setAttribute('aria-hidden', !isActive);
};

if(hamburger) hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
if(menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));

document.addEventListener('click', (e) => {
  if(menuPanel && menuPanel.classList.contains('active') && !menuPanel.contains(e.target) && !hamburger.contains(e.target) && !e.target.closest('.user-icon')) {
    toggleMenu(false);
  }
});

document.querySelectorAll('.menu-nav a').forEach(a => {
  a.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') toggleMenu(false);
});

// ==========================================
// 3. CANVAS ENGINE (COM CINEMATIC ZOOM & PARALLAX)
// ==========================================
const canvas = document.getElementById('nodeCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, DPR;
  let nodes = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let scrollOffset = window.scrollY;
  
  // Variável para suavizar o zoom do rato (Lerp)
  let currentInteractionZoom = 0; 

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    DPR = window.devicePixelRatio || 1;
    W = window.innerWidth; 
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);
    initNodes();
  }

  function initNodes() {
    const count = W < 600 ? 25 : W < 1024 ? 40 : 55; 
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.8 + 1.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = Math.min(W * 0.3, 360); 

    nodes.forEach(n => {
      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy + Math.sin(scrollOffset * 0.003 + n.x * 0.01) * 0.1;

        if (n.x <= 0 || n.x >= W) n.vx *= -1;
        if (n.y <= 0 || n.y >= H) n.vy *= -1;

        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            n.x += (dx / dist) * force * 1.5;
            n.y += (dy / dist) * force * 1.5;
          }
        }
      }
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n = nodes[i];
        const o = nodes[j];
        const dx = n.x - o.x;
        const dy = n.y - o.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = Math.max(0.15, (1 - dist / maxDist) * 0.6);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.quadraticCurveTo((n.x + o.x) / 2, (n.y + o.y) / 2 + 15, o.x, o.y);
          ctx.strokeStyle = `rgba(201, 162, 75, ${alpha})`;
          ctx.lineWidth = 0.8; 
          ctx.stroke();
        }
      }
    }
    
    nodes.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
      grad.addColorStop(0, 'rgba(240, 210, 138, 0.8)');
      grad.addColorStop(1, 'rgba(240, 210, 138, 0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = '#f0d28a';
      ctx.fill();
    });

    // ==========================================
    // A CÂMARA VIRTUAL (ZOOM & PARALLAX)
    // ==========================================
    if (!reduceMotion) {
      // 1. O "respiro" natural e lento (ondas de tempo)
      const autoZoom = Math.sin(Date.now() * 0.0008) * 0.04;
      
      // 2. O zoom dramático que reage ao scroll
      const scrollZoom = scrollOffset * 0.0006;
      
      // 3. A intensidade que entra quando o rato interage (transição matemática suave)
      const targetInteractionZoom = mouse.active ? 0.05 : 0;
      currentInteractionZoom += (targetInteractionZoom - currentInteractionZoom) * 0.08;

      // Compila as forças no motor da GPU
      const totalZoom = 1 + autoZoom + scrollZoom + currentInteractionZoom;
      const parallaxY = scrollOffset * 0.35; // Efeito de descida ligeira

      canvas.style.transform = `translate3d(0, ${parallaxY}px, 0) scale(${totalZoom})`;
    }

    requestAnimationFrame(draw);
  }

  const updateMouse = (e, isTouch = false) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    // SISTEMA ANTI-BUG: Recalcula a física se o canvas estiver ampliado pelo zoom
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;

    mouse.x = (clientX - rect.left) * scaleX;
    mouse.y = (clientY - rect.top) * scaleY;
    mouse.active = true;
  };

  canvas.addEventListener('mousemove', e => updateMouse(e));
  canvas.addEventListener('mouseleave', () => mouse.active = false);
  canvas.addEventListener('touchmove', e => updateMouse(e, true), { passive: true });
  canvas.addEventListener('touchend', () => mouse.active = false);

  window.addEventListener('scroll', () => { scrollOffset = window.scrollY; });
  window.addEventListener('resize', resize);
  
  resize();
  draw();
}

// ==========================================
// 4. CORE AUTH PANEL LOGIC (SIGN IN)
// ==========================================
const userBtn = document.querySelector('.user-icon');
const authPanel = document.getElementById('authPanel');
const authOverlay = document.getElementById('authOverlay');
const closeAuth = document.getElementById('closeAuth');

if (userBtn && authPanel && authOverlay && closeAuth) {
  const toggleAuth = (state) => {
    authPanel.classList.toggle('active', state);
    authOverlay.classList.toggle('active', state);
    authPanel.setAttribute('aria-hidden', !state);
  };

  userBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleAuth(true); });
  closeAuth.addEventListener('click', () => toggleAuth(false));
  authOverlay.addEventListener('click', () => toggleAuth(false));

  userBtn.addEventListener('click', () => {
    if(typeof toggleMenu === "function") toggleMenu(false);
  });
}

// ==========================================
// 5. 3D CARD ACCORDION LOGIC (WHY VERTEX)
// ==========================================
const glassItems = document.querySelectorAll('.glass-item');
glassItems.forEach(item => {
    const btn = item.querySelector('.glass-btn');
    if(btn) {
        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            glassItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    }
});

// ==========================================
// 6. UNIFIED UNIVERSAL 3D MOTOR
// ==========================================
const actionable3DCards = document.querySelectorAll('[data-tilt-card], #interactive-card, .service-card');
actionable3DCards.forEach(card => {
  // O cartão Why Vertex ganha uma inclinação mais dramática (15) que os restantes (10)
  const tiltForce = card.id === 'interactive-card' ? 15 : 10;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizeX = (x / rect.width) * 2 - 1;
    const normalizeY = (y / rect.height) * 2 - 1;

    const rotateX = normalizeY * -tiltForce;
    const rotateY = normalizeX * tiltForce;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Alimenta as coordenadas X e Y para o Efeito Lanterna Dourada!
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    card.style.transition = `transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)`;
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = `transform 0.08s ease-out`;
  });
});

// ==========================================
// 7. CINEMATIC PARALLAX SCROLL (WHY VERTEX)
// ==========================================
window.addEventListener('scroll', () => {
  const centralCard = document.getElementById('interactive-card');
  const centralSection = document.getElementById('why-vertex'); // Garanta que a sua <section> tem este ID no HTML!
  
  if (centralCard && centralSection) {
    const rect = centralSection.getBoundingClientRect();
    // Só ativa se o elemento estiver visível no ecrã
    if(rect.top < window.innerHeight && rect.bottom > 0) {
      // Impede que o scroll anule o movimento se o rato estiver em cima do cartão
      if (!centralSection.matches(':hover')) {
        const centerOffset = (rect.top + rect.height/2) - (window.innerHeight/2);
        const tilt = (centerOffset / window.innerHeight) * 25; // 25 é o ângulo máximo do scroll
        centralCard.style.transition = `transform 0.1s ease-out`;
        centralCard.style.transform = `rotateX(${-tilt}deg) rotateY(0deg)`;
      }
    }
  }
}, { passive: true });


// ==========================================
// 8. VENGEANCE.UI: FOOTER FLIP ANIMATION (EXACT MATCH)
// ==========================================
const footerBrand = document.querySelector('.footer-brand');

if (footerBrand) {
    const text = footerBrand.textContent.trim();
    footerBrand.textContent = ''; 
    
    const totalChars = text.length;
    const duration = 2.2; // Duração original do Vengeance
    
    text.split('').forEach((char, index) => {
        const perspectiveWrapper = document.createElement('span');
        perspectiveWrapper.style.perspective = '1000px';
        perspectiveWrapper.style.display = 'inline-block';
        
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'flip-char';
        
        // Matemática EXATA do código React
        const normalizedIndex = index / totalChars; 
        const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
        const calculatedDelay = sineValue * (duration * 0.25);
        
        span.style.setProperty('--flip-duration', `${duration}s`);
        span.style.setProperty('--flip-delay', `${calculatedDelay}s`);
        
        perspectiveWrapper.appendChild(span);
        footerBrand.appendChild(perspectiveWrapper);
    });
}
