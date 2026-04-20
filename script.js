/* ===================================================
   Portfolio JavaScript
   - Typewriter effect
   - Animated grid canvas (hero background)
   - Mobile nav toggle
   - Scroll reveal (IntersectionObserver)
   - Skill bar animation
   - Project filter
   - Contact form validation
   - Back-to-top button
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. CURRENT YEAR ──────────────────────────────
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  // ── 2. TYPEWRITER EFFECT ─────────────────────────
  const typeTarget = document.getElementById('typewriter');
  const names = ['Kadircan Çalışgan', 'bir Geliştirici', 'bir Öğrenci', 'bir Yapımcı'];
  let nameIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = names[nameIdx];
    if (!deleting) {
      typeTarget.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typeTarget.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        nameIdx = (nameIdx + 1) % names.length;
      }
    }
    setTimeout(type, deleting ? 55 : 95);
  }
  if (typeTarget) type();


  // ── 3. ANIMATED GRID CANVAS ──────────────────────
  const canvas = document.getElementById('grid-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, dots = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      initDots();
    }

    function initDots() {
      dots = [];
      const cols = Math.ceil(W / 60), rows = Math.ceil(H / 60);
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          dots.push({
            x: c * 60, y: r * 60,
            ox: c * 60, oy: r * 60,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // lines
      ctx.strokeStyle = 'rgba(0,229,255,0.06)';
      ctx.lineWidth = 1;
      const cols = Math.ceil(W / 60) + 1;
      dots.forEach((d, i) => {
        const right = dots[i + 1];
        const below = dots[i + cols];
        if (right && Math.abs(d.y - right.y) < 1) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(right.x, right.y); ctx.stroke();
        }
        if (below) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(below.x, below.y); ctx.stroke();
        }
      });

      // dots
      dots.forEach(d => {
        d.pulse += 0.015;
        const alpha = 0.15 + 0.12 * Math.sin(d.pulse);
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,229,255,${alpha})`;
        ctx.fill();

        // drift
        d.x += d.vx; d.y += d.vy;
        if (Math.abs(d.x - d.ox) > 10) d.vx *= -1;
        if (Math.abs(d.y - d.oy) > 10) d.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }


  // ── 4. MOBILE NAV ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ── 5. SCROLL REVEAL ─────────────────────────────
  const revealEls = document.querySelectorAll(
    '.skill-card, .project-card, .about-text, .about-right, .contact-form, .contact-links, .skill-bars'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ── 6. SKILL BAR ANIMATION ───────────────────────
  const bars = document.querySelectorAll('.bar-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const target = bar.getAttribute('data-width');
        setTimeout(() => { bar.style.width = target + '%'; }, 200);
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => barObserver.observe(bar));


  // ── 7. PROJECT FILTER ────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 60);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ── 8. CONTACT FORM VALIDATION ───────────────────
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  }

  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearError(id, id + '-error'));
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');

      clearError('name', 'name-error');
      clearError('email', 'email-error');
      clearError('message', 'message-error');

      if (!name || name.value.trim().length < 2) {
        showError('name', 'name-error', 'Lütfen adını gir (en az 2 karakter).');
        valid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        showError('email', 'email-error', 'Lütfen geçerli bir e-posta adresi gir.');
        valid = false;
      }

      if (!message || message.value.trim().length < 10) {
        showError('message', 'message-error', 'Mesaj en az 10 karakter olmalı.');
        valid = false;
      }

      if (valid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.textContent = 'Gönderiliyor…';
          submitBtn.disabled = true;
        }
        setTimeout(() => {
          form.reset();
          if (submitBtn) {
            submitBtn.textContent = 'Gönder →';
            submitBtn.disabled = false;
          }
          if (successMsg) {
            successMsg.hidden = false;
            successMsg.focus();
            setTimeout(() => { successMsg.hidden = true; }, 5000);
          }
        }, 1200);
      } else {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
      }
    });
  }


  // ── 9. BACK TO TOP ───────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.hidden = window.scrollY < 400;
    });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ── 10. ACTIVE NAV HIGHLIGHT ON SCROLL ───────────
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

});
