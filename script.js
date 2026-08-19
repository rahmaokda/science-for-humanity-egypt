// ---------- nav: solid on scroll + mobile toggle ----------
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

function onScroll(){
  if(window.scrollY > 40){ nav.classList.add('solid'); }
  else{ nav.classList.remove('solid'); }
}
window.addEventListener('scroll', onScroll, { passive:true });
onScroll();

if(toggle){
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ---------- reveal on scroll ----------
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}else{
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- hero network canvas ----------
(function networkCanvas(){
  const canvas = document.getElementById('network-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, dpr;
  let nodes = [];
  const NODE_COUNT = 46;
  const LINK_DIST = 150;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function makeNodes(){
    nodes = Array.from({length: NODE_COUNT}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5) * 0.18,
      vy: (Math.random()-0.5) * 0.18,
      r: Math.random()*1.6 + 1
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    for(const n of nodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a = nodes[i], b = nodes[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < LINK_DIST){
          ctx.strokeStyle = `rgba(76,141,255,${(1 - dist/LINK_DIST) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }
    for(const n of nodes){
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(33,196,214,0.85)';
      ctx.fill();
    }
    if(!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  makeNodes();
  step();
  window.addEventListener('resize', () => { resize(); makeNodes(); if(reduceMotion) step(); });
})();
