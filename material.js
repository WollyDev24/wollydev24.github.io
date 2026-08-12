/* ============================================================
   WollyDev24 — Material Expressive shared script
   Theme toggle + reveal-on-scroll
   ============================================================ */
(function () {
  var ICON_DARK = '\uE51C';   // dark_mode
  var ICON_LIGHT = '\uE518';  // light_mode

  function applyTheme(mode) {
    var light = mode === 'light';
    document.documentElement.classList.toggle('light-mode', light);
    document.querySelectorAll('[data-theme-toggle] .msr').forEach(function (icon) {
      icon.textContent = light ? ICON_LIGHT : ICON_DARK;
    });
  }

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  applyTheme(saved === 'light' ? 'light' : 'dark');

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var light = document.documentElement.classList.toggle('light-mode');
      try { localStorage.setItem('theme', light ? 'light' : 'dark'); } catch (e) {}
      document.querySelectorAll('[data-theme-toggle] .msr').forEach(function (icon) {
        icon.textContent = light ? ICON_LIGHT : ICON_DARK;
      });
    });
  });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }
})();
