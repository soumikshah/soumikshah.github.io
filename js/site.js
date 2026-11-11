/* Soumik Shah Portfolio — progressive enhancement only. The page reads fine with this file blocked. */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var menuBtn = document.querySelector('.nav-menu');
  var sheet = document.getElementById('nav-sheet');

  /* Mobile menu */
  if (nav && menuBtn && sheet) {
    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); } });
  }

  /* Shadow once the page has scrolled */
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Highlight the section in view */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"], .nav-sheet a[href^="#"]'));
  if (links.length) {
    var byId = {};
    links.forEach(function (a) { var id = a.getAttribute('href').slice(1); (byId[id] = byId[id] || []).push(a); });
    var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var ticking = false;
    var update = function () {
      ticking = false;
      var line = window.innerHeight * 0.35, best = null;
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) best = s.id; });
      if (atBottom) best = sections[sections.length - 1].id;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (best) byId[best].forEach(function (a) { a.setAttribute('aria-current', 'true'); });
    };
    var request = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
  }

  /* Live GitHub counts: refresh the numbers baked into the HTML, silently keep them on any failure */
  var repoEls = document.querySelectorAll('[data-repo]');
  if (repoEls.length && window.fetch) {
    fetch('https://api.github.com/users/soumikshah/repos?per_page=100', { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (repos) {
        var map = {};
        repos.forEach(function (r) { map[r.name.toLowerCase()] = r; });
        repoEls.forEach(function (el) {
          var r = map[el.getAttribute('data-repo').toLowerCase()];
          if (!r) return;
          var stars = el.querySelector('[data-stars]'), forks = el.querySelector('[data-forks]');
          if (stars) { stars.textContent = r.stargazers_count; stars.closest('.stat').classList.toggle('is-amber', r.stargazers_count > 0); }
          if (forks) forks.textContent = r.forks_count;
        });
        var total = document.querySelector('[data-repo-total]');
        if (total && repos.length) total.textContent = repos.length;
      })
      .catch(function () { /* offline or rate limited: the HTML numbers stand */ });
  }

  /* Email: the address is never in the HTML. It is assembled from data attributes only when a visitor acts on the
     button itself (pointer down, keyboard focus or click), so scrapers that fetch, render or even scroll the page
     never see it. The readable text appears only after a deliberate "Show address" click. */
  var emailLink = document.getElementById('email-link');
  if (emailLink) {
    var emailText = document.getElementById('email-text');
    var emailShow = document.getElementById('email-show');
    var address = function () {
      return emailLink.getAttribute('data-u') + String.fromCharCode(64) + emailLink.getAttribute('data-d') + '.' + emailLink.getAttribute('data-t');
    };
    var arm = function () { if (emailLink.getAttribute('href').indexOf('mailto:') !== 0) emailLink.setAttribute('href', 'mailto:' + address()); };
    emailLink.addEventListener('pointerdown', arm);
    emailLink.addEventListener('focus', arm);
    emailLink.addEventListener('click', function (e) {
      arm();
      if (emailLink.getAttribute('href').indexOf('mailto:') !== 0) { e.preventDefault(); window.location.href = 'mailto:' + address(); }
    });
    if (emailShow && emailText) {
      emailShow.addEventListener('click', function () {
        emailText.textContent = address();
        emailShow.hidden = true;
        emailText.focus();
      });
    }
  }

  /* Footer year */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
