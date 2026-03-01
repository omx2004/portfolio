

'use strict';

/* ──────────────────────────────────────────
   1. NAVBAR — sticky + active link highlight
   ────────────────────────────────────────── */
(function initNavbar() {
  const navbar      = document.getElementById('navbar');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const sections    = document.querySelectorAll('section[id]');

  /* Scroll behaviour: add .scrolled class */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }

  /* Highlight nav link whose section is currently in view */
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 90;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    allNavLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  /* Mobile hamburger toggle */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  /* Close mobile menu when a link is clicked */
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ──────────────────────────────────────────
   2. SCROLL ANIMATIONS
      - Fade-in + slide-up for [data-animate]
      - Skill bar fill triggered on visibility
   ────────────────────────────────────────── */
(function initScrollAnimations() {
  const animateEls = document.querySelectorAll('[data-animate]');
  const skillFills = document.querySelectorAll('.skill-fill');

  /* Use IntersectionObserver for efficient detection */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        /* Stagger siblings by their index inside the same parent grid */
        const siblings = Array.from(el.parentElement.querySelectorAll('[data-animate]'));
        const siblingIndex = siblings.indexOf(el);
        const delay = siblingIndex > 0 ? siblingIndex * 100 : 0;

        setTimeout(() => {
          el.classList.add('visible');
        }, delay);

        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  animateEls.forEach(el => observer.observe(el));

  /* Skill bar animation observer */
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
        skillObserver.unobserve(fill);
      });
    },
    { threshold: 0.5 }
  );

  skillFills.forEach(fill => skillObserver.observe(fill));
})();


/* ──────────────────────────────────────────
   3. CONTACT FORM VALIDATION
   ────────────────────────────────────────── */
(function initContactForm() {
  const form         = document.getElementById('contactForm');
  if (!form) return;

  const nameInput    = document.getElementById('name');
  const emailInput   = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const nameError    = document.getElementById('nameError');
  const emailError   = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const successMsg   = document.getElementById('formSuccess');

  /* ── Helpers ── */
  function showError(input, errorEl, message) {
    input.classList.add('error');
    input.classList.remove('valid');
    errorEl.textContent = message;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ── Real-time validation ── */
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length >= 2) {
      clearError(nameInput, nameError);
    }
  });

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value.trim())) {
      clearError(emailInput, emailError);
    }
  });

  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) {
      clearError(messageInput, messageError);
    }
  });

  /* ── Submit ── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    let valid = true;

    /* Name validation */
    if (name.length < 2) {
      showError(nameInput, nameError, 'Please enter your full name (at least 2 characters).');
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    /* Email validation */
    if (!email) {
      showError(emailInput, emailError, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    /* Message validation */
    if (message.length < 10) {
      showError(messageInput, messageError, 'Message must be at least 10 characters.');
      valid = false;
    } else {
      clearError(messageInput, messageError);
    }

    if (!valid) return;

    /* ── Simulate async submission ── */
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      form.reset();
      successMsg.classList.add('visible');

      /* Hide success message after 5s */
      setTimeout(() => successMsg.classList.remove('visible'), 5000);
    }, 1600);
  });
})();


/* ──────────────────────────────────────────
   4. FOOTER — dynamic year + back-to-top
   ────────────────────────────────────────── */
(function initFooter() {
  /* Set current year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────
   5. SMOOTH SCROLL for anchor links (polyfill
      for browsers that don't support CSS
      scroll-behavior properly)
   ────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


/* ──────────────────────────────────────────
   6. HERO — subtle parallax on bg text
   ────────────────────────────────────────── */
(function initParallax() {
  const bgText = document.querySelector('.hero-bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    bgText.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
})();
