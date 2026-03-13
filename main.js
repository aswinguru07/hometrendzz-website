/* =====================
   HomeTrendzz – main.js
   Mobile & Android Compatible
   ===================== */

// Detect touch device (Android, iOS, etc.)
const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

// ---- Navbar scroll behavior ----
(function(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  const hasHero = !!document.querySelector('.hero');
  function updateNav(){
    if(window.scrollY > 60){
      nav.classList.remove('transparent');
      nav.classList.add('scrolled');
    } else {
      nav.classList.add(hasHero ? 'transparent' : 'scrolled');
      nav.classList.remove('scrolled');
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, {passive:true});

  // Burger menu
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if(burger && navLinks){
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      const isOpen = navLinks.classList.contains('open');
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      // Prevent body scroll when menu open (important on Android)
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', ()=>{
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close when tapping outside the menu (mobile UX)
    document.addEventListener('click', (e)=>{
      if(navLinks.classList.contains('open') &&
         !navLinks.contains(e.target) &&
         !burger.contains(e.target)){
        burger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === currentPage || (currentPage === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
})();

// ---- Scroll-to-top button ----
(function(){
  const btn = document.getElementById('scroll-top');
  if(!btn) return;
  window.addEventListener('scroll', ()=>{
    btn.classList.toggle('visible', window.scrollY > 400);
  }, {passive:true});
  btn.addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  });
})();

// ---- Reveal on scroll (IntersectionObserver – works on all Android browsers) ----
(function(){
  const reveals = document.querySelectorAll('.reveal');
  if(!reveals.length) return;

  // Fallback for very old Android WebView that lacks IntersectionObserver
  if(!('IntersectionObserver' in window)){
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.1, rootMargin:'0px 0px -40px 0px'});
  reveals.forEach(el=>io.observe(el));
})();

// ---- Counter animation ----
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    const target = parseInt(el.dataset.count, 10);
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(()=>{
      start = Math.min(start + step, target);
      el.textContent = start + (el.dataset.suffix || '');
      if(start >= target) clearInterval(timer);
    }, 25);
  });
}
// Trigger counter when stats visible
(function(){
  const statsSection = document.querySelector('.hero-stats');
  if(!statsSection) return;
  let done = false;
  window.addEventListener('scroll', ()=>{
    if(!done){
      animateCounters();
      done = true;
    }
  },{passive:true, once:true});
  setTimeout(animateCounters, 800);
})();

// ---- Portfolio filter tabs ----
(function(){
  const tabs = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.portfolio-item[data-cat], .pf-item[data-cat]');
  if(!tabs.length || !items.length) return;
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      items.forEach(item=>{
        if(cat === 'all' || item.dataset.cat === cat){
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
})();

// ---- Portfolio overlay on touch (Android/iOS tap support) ----
(function(){
  if(!isTouchDevice) return; // only for touch screens
  const items = document.querySelectorAll('.portfolio-item, .pf-item');
  items.forEach(item => {
    const overlay = item.querySelector('.portfolio-overlay, .pf-overlay');
    if(!overlay) return;
    item.addEventListener('touchstart', function(e){
      // Toggle overlay visibility on tap
      const isVisible = overlay.style.opacity === '1';
      // Close all other overlays first
      items.forEach(i => {
        const ov = i.querySelector('.portfolio-overlay, .pf-overlay');
        if(ov) ov.style.opacity = '0';
      });
      if(!isVisible){
        overlay.style.opacity = '1';
        e.preventDefault(); // prevent ghost click
      }
    }, {passive:false});
  });
  // Tap outside to close all overlays
  document.addEventListener('touchstart', (e)=>{
    if(!e.target.closest('.portfolio-item, .pf-item')){
      document.querySelectorAll('.portfolio-overlay, .pf-overlay').forEach(ov=>{
        ov.style.opacity = '0';
      });
    }
  }, {passive:true});
})();

// ---- FAQ accordion ----
(function(){
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click', ()=>{
      const item = q.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
})();

// ---- Contact form ----
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(()=>{
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#56ab2f,#a8e063)';
      form.reset();
      setTimeout(()=>{
        btn.textContent = 'Send Message & Book Consultation →';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
})();

// ---- Smooth hover parallax (DESKTOP ONLY – disabled on touch/Android) ----
(function(){
  if(isTouchDevice) return; // skip entirely on mobile/Android
  document.querySelectorAll('.portfolio-item').forEach(item=>{
    item.addEventListener('mousemove', (e)=>{
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      item.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', ()=>{
      item.style.transform = '';
    });
  });
})();
