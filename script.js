// ══════════════════════════════════════════════════════
//  EPSC Case Study — Interactive JS
// ══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll behaviour ──────────────────────────
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ── Active nav link on scroll ────────────────────────
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observeSection = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observeSection.observe(s));

  // ── Scroll reveal ────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.strip-card, .challenge-card, .timeline-item, .stat-item, ' +
    '.mot-card, .insight-card, .fork-option, .dilemma-reframe, ' +
    '.context-compare, .protagonist-wrapper, .callout-box, ' +
    '.pillar, .comparison-row, .solution-insight-box, .risk-item, ' +
    '.channel-card, .practice-metric, .omnichannel-insight'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger children of the same parent group
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx < 5) el.classList.add(`reveal-delay-${idx + 1}`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ── Counter animation for stats ─────────────────────
  const animateCounter = (el, target, suffix = '') => {
    const duration = 1800;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statNums = document.querySelectorAll('.stat-num');

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.trim();
          statObserver.unobserve(el);

          if (raw === '90%') {
            animateCounter(el, 90, '%');
          } else if (raw === '800') {
            animateCounter(el, 800, '');
          } else if (raw === '30') {
            animateCounter(el, 30, '');
          } else if (raw === '10–15') {
            // Just flash it in — can't count a range
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = 'scale(1)';
            }, 200);
          } else if (raw === '20K') {
            let count = 0;
            const target = 20;
            const dur = 1600;
            const start = performance.now();
            const run = (now) => {
              const p = Math.min((now - start) / dur, 1);
              const e = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(e * target) + 'K';
              if (p < 1) requestAnimationFrame(run);
            };
            requestAnimationFrame(run);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((el) => statObserver.observe(el));

  // ── Smooth anchor scrolling with offset ─────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Subtle parallax on hero glow ────────────────────
  const glow1 = document.querySelector('.hero-glow.glow-1');
  const glow2 = document.querySelector('.hero-glow.glow-2');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    if (glow1) glow1.style.transform = `translate(${x}px, ${y}px)`;
    if (glow2) glow2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  }, { passive: true });

  // ── Challenge card hover accent ──────────────────────
  document.querySelectorAll('.challenge-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--accent-color', 'var(--sg-red)');
    });
  });

  // ── Timeline marker pulse on scroll ─────────────────
  const timelineMarkers = document.querySelectorAll('.marker-red');
  const markerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('pulse');
        }
      });
    },
    { threshold: 1 }
  );

  timelineMarkers.forEach((m) => markerObserver.observe(m));

  // Pulse animation via JS (keeps CSS clean)
  const style = document.createElement('style');
  style.textContent = `
    .marker-red.pulse {
      animation: markerPulse 1s ease forwards;
    }
    @keyframes markerPulse {
      0%   { box-shadow: 0 0 0 0 rgba(239,51,64,0.7); }
      70%  { box-shadow: 0 0 0 12px rgba(239,51,64,0); }
      100% { box-shadow: 0 0 12px rgba(239,51,64,0.4); }
    }
    .nav-links a.active {
      color: var(--text-100) !important;
      background: var(--bg-600) !important;
    }
  `;
  document.head.appendChild(style);

  // ── Greeting console message ─────────────────────────
  console.log(
    '%c EPSC Case Study ',
    'background:#EF3340;color:#fff;font-size:14px;font-weight:bold;padding:4px 10px;border-radius:4px;',
    '\n🇸🇬 Singapore Ministry of Manpower\nDesigned for academic excellence.'
  );
});
