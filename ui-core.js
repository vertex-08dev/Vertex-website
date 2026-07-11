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
  if(hamburger) hamburger.classList.toggle('active', isActive);
  if(menuPanel) menuPanel.classList.toggle('active', isActive);
  if(menuOverlay) menuOverlay.classList.toggle('active', isActive);
  if(hamburger) hamburger.setAttribute('aria-expanded', isActive);
  if(menuPanel) menuPanel.setAttribute('aria-hidden', !isActive);
};

if(hamburger) hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
if(menuOverlay) menuOverlay.addEventListener('click', () => toggleMenu(false));

document.addEventListener('click', (e) => {
  if(menuPanel && menuPanel.classList.contains('active') && !menuPanel.contains(e.target) && hamburger && !hamburger.contains(e.target) && !e.target.closest('.user-icon')) {
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
// 3. CORE AUTH PANEL LOGIC (SIGN IN)
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
// 4. 3D CARD ACCORDION LOGIC (WHY VERTEX)
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
// 5. VENGEANCE.UI: FOOTER FLIP ANIMATION
// ==========================================
const footerBrand = document.querySelector('.footer-brand');

if (footerBrand) {
    const text = footerBrand.textContent.trim();
    footerBrand.textContent = ''; 
    
    const totalChars = text.length;
    const duration = 2.2; 
    
    text.split('').forEach((char, index) => {
        const perspectiveWrapper = document.createElement('span');
        perspectiveWrapper.style.perspective = '1000px';
        perspectiveWrapper.style.display = 'inline-block';
        
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'flip-char';
        
        const normalizedIndex = index / totalChars; 
        const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
        const calculatedDelay = sineValue * (duration * 0.25);
        
        span.style.setProperty('--flip-duration', `${duration}s`);
        span.style.setProperty('--flip-delay', `${calculatedDelay}s`);
        
        perspectiveWrapper.appendChild(span);
        footerBrand.appendChild(perspectiveWrapper);
    });
}
