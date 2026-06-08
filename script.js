/* ============================================================
   TOUNSI EXPERIENCE — script.js
   Handles: loader, navbar, scroll reveal, filters,
            favorites, form validation, booking modal
   ============================================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ── 1. PAGE LOADER ── */
    const loader = document.getElementById('page-loader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('hidden'), 1000);
      });
    }
  
    /* ── 2. NAVBAR SCROLL BEHAVIOR ── */
    const nav = document.getElementById('mainNav');
    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 60) {
          nav.classList.add('scrolled');
          nav.classList.remove('transparent');
        } else {
          nav.classList.remove('scrolled');
          nav.classList.add('transparent');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // init
  
      /* active link */
      const currentPage = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
      });
    }
  

  
    /* ── 4. HERO BG KEN BURNS ── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
  
    /* ── 5. SCROLL REVEAL ── */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (revealEls.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  
      revealEls.forEach(el => observer.observe(el));
    }
  
    /* ── 6. COUNTER ANIMATION (stats strip) ── */
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
  
      counters.forEach(c => counterObserver.observe(c));
    }
  
    function animateCounter(el) {
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  
    /* ── 7. EXPERIENCE FILTER (experiences.html) ── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const expCards   = document.querySelectorAll('[data-category]');
  
    if (filterBtns.length && expCards.length) {
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
  
          const cat = btn.dataset.filter;
  
          expCards.forEach(card => {
            const match = cat === 'all' || card.dataset.category === cat;
            card.style.transition = 'opacity .35s ease, transform .35s ease';
            if (match) {
              card.style.opacity = '1';
              card.style.transform = '';
              card.style.pointerEvents = 'auto';
              card.closest('.col')?.style.setProperty('display', '');
              card.closest('[data-col]')?.style.setProperty('display', '');
            } else {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.92)';
              card.style.pointerEvents = 'none';
            }
          });
        });
      });
    }
  
    /* ── 8. FAVORITE TOGGLE (heart button) ── */
    document.addEventListener('click', e => {
      const btn = e.target.closest('.exp-card-fav');
      if (!btn) return;
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      if (btn.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        btn.style.transform = 'scale(1.3)';
        setTimeout(() => { btn.style.transform = ''; }, 250);
      } else {
        icon.className = 'far fa-heart';
      }
    });
  
    /* ── 9a. CONTACT FORM VALIDATION (contact.html) ── */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      setupContactFormValidation(contactForm);
    }

    function setupContactFormValidation(form) {
      const fields = {
        contactNom: {
          el: form.querySelector('#contactNom'),
          validate: v => v.trim().length >= 2,
          msg: '<i class="fas fa-exclamation-circle"></i> Le champ Nom est obligatoire (minimum 2 caractères).'
        },
        contactEmail: {
          el: form.querySelector('#contactEmail'),
          validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
          msg: '<i class="fas fa-exclamation-circle"></i> Veuillez entrer une adresse email valide (ex : test@exemple.com).'
        },
        contactMessage: {
          el: form.querySelector('#contactMessage'),
          validate: v => v.trim().length >= 5,
          msg: '<i class="fas fa-exclamation-circle"></i> Le champ Message est obligatoire (minimum 5 caractères).'
        }
      };

      // Helper: show/hide field error
      function validateContactField(id, validate, msg) {
        const el  = form.querySelector('#' + id);
        const err = document.getElementById(id + 'Error');
        if (!el) return true;
        const ok = validate(el.value);
        if (ok) {
          el.style.borderColor = '#27ae60';
          if (err) { err.innerHTML = ''; err.style.display = 'none'; }
        } else {
          el.style.borderColor = '#c0392b';
          if (err) { err.innerHTML = msg; err.style.display = 'block'; }
        }
        return ok;
      }

      // Real-time feedback on blur & input
      Object.entries(fields).forEach(([id, { validate, msg }]) => {
        const el = form.querySelector('#' + id);
        if (!el) return;
        el.addEventListener('blur', () => validateContactField(id, validate, msg));
        el.addEventListener('input', () => {
          const err = document.getElementById(id + 'Error');
          if (err && err.style.display === 'block') validateContactField(id, validate, msg);
        });
      });

      form.addEventListener('submit', e => {
        // Always validate client-side first
        let allValid = true;
        Object.entries(fields).forEach(([id, { validate, msg }]) => {
          if (!validateContactField(id, validate, msg)) allValid = false;
        });

        const banner = document.getElementById('form-error-banner');
        const success = document.getElementById('form-success');

        if (!allValid) {
          e.preventDefault(); // block submission
          if (banner) { banner.classList.remove('d-none'); }
          if (success) success.classList.add('d-none');
          // Scroll to first error
          const firstError = form.querySelector('[style*="border-color: rgb(192, 57, 43)"], [style*="border-color:#c0392b"]');
          if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Valid — let the form submit to traitement.php normally
          if (banner) banner.classList.add('d-none');
        }
      });
    }

    /* ── 9. FORM VALIDATION (contact.html) ── */
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
      setupFormValidation(bookingForm);
    }
  
    function setupFormValidation(form) {
      const fields = {
        fullName:   { el: form.querySelector('#fullName'),   validate: v => v.trim().length >= 2,                   msg: 'Please enter your full name (min. 2 characters).' },
        email:      { el: form.querySelector('#email'),      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),   msg: 'Please enter a valid email address.' },
        age:        { el: form.querySelector('#age'),        validate: v => parseInt(v) >= 18 && parseInt(v) <= 99,  msg: 'You must be at least 18 years old to book.' },
        experience: { el: form.querySelector('#experience'), validate: v => v !== '',                               msg: 'Please select an experience.' },
        message:    { el: form.querySelector('#message'),    validate: v => v.trim().length >= 10,                  msg: 'Please write at least 10 characters.' },
      };
  
      // Real-time validation
      Object.values(fields).forEach(({ el, validate, msg }) => {
        if (!el) return;
        el.addEventListener('blur', () => validateField(el, validate, msg));
        el.addEventListener('input', () => {
          if (el.classList.contains('is-invalid')) validateField(el, validate, msg);
        });
      });
  
      form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
  
        Object.values(fields).forEach(({ el, validate, msg }) => {
          if (!el) return;
          if (!validateField(el, validate, msg)) valid = false;
        });
  
        // Radio group check
        const tripType = form.querySelectorAll('input[name="tripType"]');
        const tripErr  = form.querySelector('#tripTypeError');
        if (tripType.length) {
          const anyChecked = [...tripType].some(r => r.checked);
          if (!anyChecked) {
            valid = false;
            if (tripErr) tripErr.classList.add('visible');
          } else {
            if (tripErr) tripErr.classList.remove('visible');
          }
        }
  
        // Checkbox
        const extras   = form.querySelectorAll('input[name="extras"]');
        // Extras are optional — no validation needed
  
        if (valid) showModal();
      });
    }
  
    function validateField(el, validate, msg) {
      const errEl = document.getElementById(el.id + 'Error');
      if (validate(el.value)) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
        if (errEl) errEl.classList.remove('visible');
        return true;
      } else {
        el.classList.add('is-invalid');
        el.classList.remove('is-valid');
        if (errEl) { errEl.textContent = ''; errEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg; errEl.classList.add('visible'); }
        return false;
      }
    }
  
    /* ── 10. BOOKING MODAL ── */
    const modalOverlay = document.getElementById('bookingModal');
    const modalCloseBtn = document.getElementById('modalClose');
  
    function showModal() {
      if (modalOverlay) {
        modalOverlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      }
    }
  
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
      });
    }
  
    function closeModal() {
      if (modalOverlay) {
        modalOverlay.classList.remove('visible');
        document.body.style.overflow = '';
        // Reset form
        const form = document.getElementById('bookingForm');
        if (form) {
          form.reset();
          form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
          });
          form.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
        }
      }
    }
  
    /* ── 11. SMOOTH SCROLL for anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    /* ── 12. RADIO PILL keyboard accessibility ── */
    document.querySelectorAll('.radio-pill').forEach(pill => {
      pill.addEventListener('keydown', e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          pill.querySelector('input')?.click();
        }
      });
    });
  
  });