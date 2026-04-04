// ============================================================
// NAVBAR & SHARED UI
// ============================================================

// Active nav link
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    if (link.dataset.page === path) link.classList.add('active');
  });

  // Hamburger menu
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  }

  // Sticky navbar background
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  // Stat counter animation (homepage)
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (stats.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => statObserver.observe(el));
  }

  initTestimonialsCarousel();
});

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    const formatted = el.dataset.nocomma ? current.toString() : current.toLocaleString();
    el.textContent = prefix + formatted + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initTestimonialsCarousel() {
  const carousel = document.querySelector('[data-testimonials-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('[data-testimonial-track]');
  const prevBtn = carousel.querySelector('[data-testimonial-prev]');
  const nextBtn = carousel.querySelector('[data-testimonial-next]');
  const dotsContainer = document.querySelector('[data-testimonial-dots]');
  const pauseBtn = document.querySelector('[data-testimonial-pause]');
  const cards = Array.from(track?.children || []);
  if (!track || !prevBtn || !nextBtn || !dotsContainer || !pauseBtn || !cards.length) return;

  let page = 0;
  let perView = window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
  let autoRotateTimer = null;
  let isPaused = false;

  const getGap = () => parseFloat(window.getComputedStyle(track).gap || '0');
  const getPageCount = () => Math.ceil(cards.length / perView);

  const renderDots = () => {
    const pageCount = getPageCount();
    dotsContainer.querySelectorAll('.testimonial-dot').forEach(dot => dot.remove());
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonial-dot';
      dot.setAttribute('aria-label', `Go to testimonial slide ${i + 1}`);
      dot.addEventListener('click', () => {
        page = i;
        update();
        restartAutoRotate();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const update = () => {
    const pageCount = getPageCount();
    page = Math.max(0, Math.min(page, pageCount - 1));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const shift = page * (cardWidth + getGap()) * perView;
    track.style.transform = `translateX(-${shift}px)`;

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === page);
      dot.setAttribute('aria-current', index === page ? 'true' : 'false');
    });
  };

  const next = () => {
    const pageCount = getPageCount();
    page = page >= pageCount - 1 ? 0 : page + 1;
    update();
  };

  const prev = () => {
    const pageCount = getPageCount();
    page = page <= 0 ? pageCount - 1 : page - 1;
    update();
  };

  const stopAutoRotate = () => {
    if (autoRotateTimer) clearInterval(autoRotateTimer);
    autoRotateTimer = null;
  };

  const startAutoRotate = () => {
    if (isPaused) return;
    stopAutoRotate();
    autoRotateTimer = setInterval(next, 7000);
  };

  const restartAutoRotate = () => {
    stopAutoRotate();
    startAutoRotate();
  };

  prevBtn.addEventListener('click', () => {
    prev();
    restartAutoRotate();
  });

  nextBtn.addEventListener('click', () => {
    next();
    restartAutoRotate();
  });

  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      stopAutoRotate();
      pauseBtn.textContent = '\u25B6';
      pauseBtn.setAttribute('aria-label', 'Resume testimonial auto-rotation');
      pauseBtn.setAttribute('title', 'Resume testimonial auto-rotation');
      pauseBtn.setAttribute('aria-pressed', 'true');
    } else {
      pauseBtn.textContent = '||';
      pauseBtn.setAttribute('aria-label', 'Pause testimonial auto-rotation');
      pauseBtn.setAttribute('title', 'Pause testimonial auto-rotation');
      pauseBtn.setAttribute('aria-pressed', 'false');
      startAutoRotate();
    }
  });

  carousel.addEventListener('mouseenter', stopAutoRotate);
  carousel.addEventListener('mouseleave', startAutoRotate);
  carousel.addEventListener('focusin', stopAutoRotate);
  carousel.addEventListener('focusout', startAutoRotate);

  window.addEventListener('resize', () => {
    const newPerView = window.matchMedia('(max-width: 768px)').matches ? 1 : 2;
    if (newPerView !== perView) {
      perView = newPerView;
      page = 0;
      renderDots();
    }
    update();
  });

  renderDots();
  update();
  startAutoRotate();
}
