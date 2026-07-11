// ==========================================
// CANVAS ENGINE (COM CINEMATIC ZOOM & PARALLAX)
// ==========================================
const canvas = document.getElementById('nodeCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, DPR;
  let nodes = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let scrollOffset = window.scrollY;
  
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

    if (!reduceMotion) {
      const autoZoom = Math.sin(Date.now() * 0.0008) * 0.04;
      const scrollZoom = scrollOffset * 0.0006;
      const targetInteractionZoom = mouse.active ? 0.05 : 0;
      currentInteractionZoom += (targetInteractionZoom - currentInteractionZoom) * 0.08;

      const totalZoom = 1 + autoZoom + scrollZoom + currentInteractionZoom;
      const parallaxY = scrollOffset * 0.35; 

      canvas.style.transform = `translate3d(0, ${parallaxY}px, 0) scale(${totalZoom})`;
    }

    requestAnimationFrame(draw);
  }

  const updateMouse = (e, isTouch = false) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

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
