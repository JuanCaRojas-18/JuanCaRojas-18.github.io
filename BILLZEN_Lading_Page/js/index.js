// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Nav highlight on scroll
const sections = document.querySelectorAll('section[id], .stats-bar');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id || '';
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    // Solo marcar activo los links internos (#seccion), nunca los externos
    if (href && href.startsWith('#')) {
      a.classList.toggle('active', href === '#' + current);
    }
  });
  // Nav shadow on scroll
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 20 ? '0 2px 20px rgba(15,17,23,0.08)' : 'none';
});

// Period buttons (pricing toggle demo)
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.period-selector').querySelectorAll('.period-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Form submit
function handleSubmit(btn) {
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Solicitud enviada con exito';
    btn.style.background = '#085e45';
  }, 1200);
}

// Hamburger (mobile)
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('nav')) {
    document.querySelector('.nav-links').classList.remove('open');
  }
});