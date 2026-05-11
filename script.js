/* =============================================
   script.js – Shared JavaScript for all pages
   ============================================= */

   'use strict';

   /* ── Utility: Run after DOM is ready ── */
   document.addEventListener('DOMContentLoaded', () => {
     initYear();
     initNavToggle();
     initScrollAnimations();
     initSkillBars();
     initCounters();
     initContactForm();
   });
   
   /* ── 1. Current Year in Footer ── */
   function initYear() {
     const el = document.getElementById('year');
     if (el) el.textContent = new Date().getFullYear();
   }
   
   /* ── 2. Mobile Navigation Toggle ── */
   function initNavToggle() {
     const toggle = document.getElementById('navToggle');
     const navLinks = document.getElementById('navLinks');
     if (!toggle || !navLinks) return;
   
     toggle.addEventListener('click', () => {
       const isOpen = navLinks.classList.toggle('open');
       toggle.classList.toggle('open', isOpen);
       toggle.setAttribute('aria-expanded', isOpen);
     });
   
     // Close nav when a link is clicked
     navLinks.querySelectorAll('a').forEach(link => {
       link.addEventListener('click', () => {
         navLinks.classList.remove('open');
         toggle.classList.remove('open');
         toggle.setAttribute('aria-expanded', 'false');
       });
     });
   
     // Close on outside click
     document.addEventListener('click', (e) => {
       if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
         navLinks.classList.remove('open');
         toggle.classList.remove('open');
         toggle.setAttribute('aria-expanded', 'false');
       }
     });
   }
   
   /* ── 3. Scroll Fade-In Animations ── */
   function initScrollAnimations() {
     // Add fade-in class to animatable elements
     const targets = document.querySelectorAll(
       '.skill-card, .project-card, .tl-item, .tool-badge, .info-card, .form-card, .about-visual, .contact-info'
     );
   
     targets.forEach((el, i) => {
       el.classList.add('fade-in');
       el.style.transitionDelay = `${(i % 4) * 80}ms`;
     });
   
     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             entry.target.classList.add('visible');
             observer.unobserve(entry.target);
           }
         });
       },
       { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
     );
   
     targets.forEach(el => observer.observe(el));
   }
   
   /* ── 4. Animated Skill Bars ── */
   function initSkillBars() {
     const bars = document.querySelectorAll('.skill-fill[data-width]');
     if (!bars.length) return;
   
     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             const bar = entry.target;
             bar.style.width = bar.dataset.width + '%';
             observer.unobserve(bar);
           }
         });
       },
       { threshold: 0.5 }
     );
   
     bars.forEach(bar => observer.observe(bar));
   }
   
   /* ── 5. Animated Counters (About page stats) ── */
   function initCounters() {
     const counters = document.querySelectorAll('.stat-num[data-target]');
     if (!counters.length) return;
   
     const observer = new IntersectionObserver(
       (entries) => {
         entries.forEach(entry => {
           if (entry.isIntersecting) {
             animateCounter(entry.target);
             observer.unobserve(entry.target);
           }
         });
       },
       { threshold: 0.5 }
     );
   
     counters.forEach(counter => observer.observe(counter));
   }
   
   function animateCounter(el) {
     const target = parseInt(el.dataset.target, 10);
     const duration = 1500;
     const start = performance.now();
   
     function update(now) {
       const elapsed = now - start;
       const progress = Math.min(elapsed / duration, 1);
       // Ease out cubic
       const eased = 1 - Math.pow(1 - progress, 3);
       el.textContent = Math.floor(eased * target);
       if (progress < 1) requestAnimationFrame(update);
       else el.textContent = target + '+';
     }
   
     requestAnimationFrame(update);
   }
   
   /* ── 6. Contact Form Validation & Submission ── */
   function initContactForm() {
     const submitBtn = document.getElementById('submitBtn');
     if (!submitBtn) return;
   
     submitBtn.addEventListener('click', handleFormSubmit);
   
     // Live validation
     ['name', 'email', 'message'].forEach(id => {
       const input = document.getElementById(id);
       if (input) {
         input.addEventListener('blur', () => validateField(id));
         input.addEventListener('input', () => clearError(id));
       }
     });
   }
   
   function validateField(id) {
     const input = document.getElementById(id);
     const errorEl = document.getElementById(id + 'Error');
     if (!input || !errorEl) return true;
   
     let errorMsg = '';
   
     if (id === 'name') {
       if (!input.value.trim()) errorMsg = 'Name is required.';
       else if (input.value.trim().length < 2) errorMsg = 'Name must be at least 2 characters.';
     }
     if (id === 'email') {
       if (!input.value.trim()) errorMsg = 'Email is required.';
       else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) errorMsg = 'Please enter a valid email address.';
     }
     if (id === 'message') {
       if (!input.value.trim()) errorMsg = 'Message is required.';
       else if (input.value.trim().length < 10) errorMsg = 'Message must be at least 10 characters.';
     }
   
     if (errorMsg) {
       input.classList.add('error');
       errorEl.textContent = errorMsg;
       return false;
     }
     return true;
   }
   
   function clearError(id) {
     const input = document.getElementById(id);
     const errorEl = document.getElementById(id + 'Error');
     if (input) input.classList.remove('error');
     if (errorEl) errorEl.textContent = '';
   }
   
   function handleFormSubmit() {
     const fields = ['name', 'email', 'message'];
     const valid = fields.map(validateField).every(Boolean);
     if (!valid) return;
   
     const btn = document.getElementById('submitBtn');
     const btnText = document.getElementById('btnText');
     const btnLoader = document.getElementById('btnLoader');
     const successEl = document.getElementById('formSuccess');
   
     // Show loading state
     btn.disabled = true;
     btnText.textContent = 'Sending…';
     btnLoader.hidden = false;
   
     // Simulate async send (replace with real fetch in production)
     setTimeout(() => {
       btn.disabled = false;
       btnText.textContent = 'Send Message';
       btnLoader.hidden = true;
   
       // Clear form
       ['name', 'email', 'subject', 'message'].forEach(id => {
         const el = document.getElementById(id);
         if (el) el.value = '';
       });
   
       // Show success message
       successEl.hidden = false;
       successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
   
       // Hide success after 6 seconds
       setTimeout(() => { successEl.hidden = true; }, 6000);
     }, 1800);
   }
   
   /* ── 7. Active nav link highlighting based on current page ── */
   (function highlightActiveNav() {
     const path = window.location.pathname.split('/').pop() || 'index.html';
     document.querySelectorAll('.nav-links a').forEach(link => {
       const href = link.getAttribute('href');
       if (href === path || (path === '' && href === 'index.html')) {
         link.classList.add('active');
       } else {
         link.classList.remove('active');
       }
     });
   })();