// The Cask Insurance Agency — interactivity
(function () {
  'use strict';

  /* Dark / light mode toggle */
  var toggle = document.querySelector('[data-theme-toggle]');
  var root = document.documentElement;
  var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  function renderToggleIcon() {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      theme === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  renderToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      renderToggleIcon();
    });
  }

  /* Sticky header show/hide on scroll */
  var header = document.querySelector('[data-header]');
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle('header--scrolled', y > 8);
      if (y > lastY && y > 120) {
        header.classList.add('header--hidden');
      } else {
        header.classList.remove('header--hidden');
      }
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  /* Mobile nav toggle */
  var navToggle = document.querySelector('[data-nav-toggle]');
  var navLinks = document.querySelector('.nav__links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('nav__links--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navLinks.style.display = isOpen ? 'flex' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('nav__links--open');
        navLinks.style.display = '';
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Contact form — client-side validation + mailto fallback */
  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    var statusEl = contactForm.querySelector('[data-form-status]');
    var attachmentInput = contactForm.querySelector('#cf-attachment');
    var fileStatusEl = contactForm.querySelector('[data-file-status]');

    if (attachmentInput && fileStatusEl) {
      attachmentInput.addEventListener('change', function () {
        var files = attachmentInput.files;
        if (!files || !files.length) {
          fileStatusEl.textContent = 'No files selected';
          return;
        }
        var names = Array.prototype.map.call(files, function (f) { return f.name; });
        fileStatusEl.textContent = files.length === 1 ? names[0] : files.length + ' files selected';
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.querySelector('#cf-name').value.trim();
      var company = contactForm.querySelector('#cf-company').value.trim();
      var email = contactForm.querySelector('#cf-email').value.trim();
      var phone = contactForm.querySelector('#cf-phone').value.trim();
      var message = contactForm.querySelector('#cf-message').value.trim();
      var attachmentNames = attachmentInput && attachmentInput.files.length
        ? Array.prototype.map.call(attachmentInput.files, function (f) { return f.name; }).join(', ')
        : '';

      if (!name || !email || !phone) {
        statusEl.textContent = 'Please fill in your name, email, and phone number.';
        statusEl.setAttribute('data-status', 'error');
        return;
      }

      var bodyLines = [
        'Name: ' + name,
        company ? 'Company: ' + company : null,
        'Email: ' + email,
        'Phone: ' + phone,
        message ? '\nComments or Questions:\n' + message : null,
        attachmentNames ? '\nFiles to attach manually: ' + attachmentNames : null
      ].filter(Boolean);

      var mailto =
        'mailto:info@caskagency.com?subject=' +
        encodeURIComponent('Website Inquiry from ' + name) +
        '&body=' +
        encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailto;
      statusEl.removeAttribute('data-status');
      statusEl.textContent = attachmentNames
        ? "Opening your email client \u2014 don't forget to manually attach: " + attachmentNames
        : "Opening your email client to send this message\u2026";
    });
  }
})();
