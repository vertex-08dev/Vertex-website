// ==========================================
// UNIFIED UNIVERSAL 3D MOTOR & LANTERN GLOW
// ==========================================
function init3DEngine(selector) {
    const actionable3DCards = document.querySelectorAll(selector);
    
    actionable3DCards.forEach(card => {
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
        
        // Efeito Lanterna Dourada!
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
}

// Inicia automaticamente para os elementos estáticos do site
document.addEventListener('DOMContentLoaded', () => {
    init3DEngine('[data-tilt-card], #interactive-card, .service-card');
});

// ==========================================
// CINEMATIC PARALLAX SCROLL (WHY VERTEX)
// ==========================================
window.addEventListener('scroll', () => {
    const centralCard = document.getElementById('interactive-card');
    const centralSection = document.getElementById('why-vertex'); 
    
    if (centralCard && centralSection) {
      const rect = centralSection.getBoundingClientRect();
      if(rect.top < window.innerHeight && rect.bottom > 0) {
        if (!centralSection.matches(':hover')) {
          const centerOffset = (rect.top + rect.height/2) - (window.innerHeight/2);
          const tilt = (centerOffset / window.innerHeight) * 25; 
          centralCard.style.transition = `transform 0.1s ease-out`;
          centralCard.style.transform = `rotateX(${-tilt}deg) rotateY(0deg)`;
        }
      }
    }
  }, { passive: true });
