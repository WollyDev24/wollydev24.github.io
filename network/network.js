/* ============================================================
   YouShade Network — rendering + interactions
   Loads data/*.json and builds the three hub sections
   ============================================================ */
(function () {
  'use strict';

  var STATUS_LABELS = {
    active: 'Active',
    development: 'In Development',
    discontinued: 'Discontinued'
  };

  var SVG = {
    github: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7v2h7.59L3.29 20.29l1.42 1.42L16 10.41V18h2V7z"/></svg>'
  };

  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML.replace(/"/g, '&quot;');
  }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error(url + ' → ' + res.status);
      return res.json();
    });
  }

  function el(id) { return document.getElementById(id); }

  function stateChip(text) {
    return '<div class="state-row"><span class="state-chip">' + esc(text) + '</span></div>';
  }

  /* ===== PROJECTS ===== */
  function renderProjects(projects) {
    var grid = el('project-grid');
    if (!projects.length) {
      grid.innerHTML = stateChip('No projects yet.');
      return;
    }
    var html = '';
    projects.forEach(function (p) {
      var status = STATUS_LABELS[p.status] || p.status || 'Active';
      var tags = (p.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('');
      var isLink = !!p.url;
      var tag = isLink ? 'a' : 'div';
      var href = isLink ? ' href="' + esc(p.url) + '" target="_blank" rel="noopener"' : '';
      html +=
        '<' + tag + ' class="glass project-card reveal"' + href + '>' +
          '<div class="project-top">' +
            '<span class="avatar-ring"><span class="avatar-inner">' + esc(p.icon || '✦') + '</span></span>' +
            '<div>' +
              '<div class="project-name">' + esc(p.name) + '</div>' +
              '<span class="status-chip ' + esc(p.status || 'active') + '"><span class="s-dot"></span>' + esc(status) + '</span>' +
            '</div>' +
          '</div>' +
          '<p class="project-desc">' + esc(p.description || '') + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
          (isLink
            ? '<div class="project-foot"><span>View project</span><span class="arrow" aria-hidden="true">→</span></div>'
            : '<div class="project-foot"><span>Coming soon</span></div>') +
        '</' + tag + '>';
    });
    grid.innerHTML = html;
  }

  /* ===== COLLABORATORS ===== */
  function renderCollaborators(collabs) {
    var grid = el('collab-grid');
    if (!collabs.length) {
      grid.innerHTML = stateChip('No collaborators yet.');
      return;
    }
    var html = '';
    collabs.forEach(function (c) {
      var tags = (c.tags || []).map(function (t) {
        return '<span class="tag">' + esc(t) + '</span>';
      }).join('');
      var links = c.links || {};
      var linkHtml = '';
      if (links.github) {
        linkHtml += '<a class="icon-link gh" href="' + esc(links.github) + '" target="_blank" rel="noopener" aria-label="GitHub">' + SVG.github + '</a>';
      }
      if (links.telegram) {
        linkHtml += '<a class="icon-link tg" href="' + esc(links.telegram) + '" target="_blank" rel="noopener" aria-label="Telegram">' + SVG.telegram + '</a>';
      }
      if (links.discord) {
        linkHtml += '<a class="icon-link dc" href="' + esc(links.discord) + '" target="_blank" rel="noopener" aria-label="Discord">' + SVG.discord + '</a>';
      }
      html +=
        '<div class="glass collab-card reveal">' +
          '<div class="collab-top">' +
            '<span class="avatar-ring"><span class="avatar-inner initials">' + esc(c.initials || '?') + '</span></span>' +
            '<div>' +
              '<div class="collab-name">' + esc(c.name) + '</div>' +
              '<div class="collab-role">' + esc(c.role || '') + '</div>' +
            '</div>' +
          '</div>' +
          '<p class="collab-bio">' + esc(c.bio || '') + '</p>' +
          '<div class="tag-row">' + tags + '</div>' +
          (linkHtml ? '<div class="collab-links">' + linkHtml + '</div>' : '') +
        '</div>';
    });
    grid.innerHTML = html;
  }

  /* ===== POSTS ===== */
  function togglePost(row) {
    var expand = row.nextElementSibling;
    var wasOpen = row.classList.contains('open');
    document.querySelectorAll('.post-row.open').forEach(function (openRow) {
      if (openRow !== row) {
        openRow.classList.remove('open');
        openRow.nextElementSibling.classList.remove('open');
      }
    });
    row.classList.toggle('open', !wasOpen);
    expand.classList.toggle('open', !wasOpen);
  }

  function renderPosts(posts) {
    var list = el('post-list');
    if (!posts.length) {
      list.innerHTML = stateChip('No updates yet.');
      return;
    }
    var html = '';
    posts.forEach(function (p, i) {
      var imgs = (p.images || []).filter(Boolean).map(function (src) {
        return '<img src="' + esc(src) + '" alt="" loading="lazy">';
      }).join('');
      html +=
        '<div class="post-item reveal">' +
          '<div class="post-row" role="button" tabindex="0" aria-expanded="false" data-post-index="' + i + '">' +
            '<span class="post-emoji" aria-hidden="true">' + esc(p.emoji || '📢') + '</span>' +
            '<div class="post-body">' +
              '<div class="post-title">' + esc(p.title) + '</div>' +
              '<div class="post-meta"><span class="post-date">' + esc(p.date || '') + '</span>' +
              (p.excerpt ? '<span>' + esc(p.excerpt) + '</span>' : '') + '</div>' +
            '</div>' +
            '<span class="post-chevron" aria-hidden="true">⌄</span>' +
          '</div>' +
          '<div class="post-expand"><div class="post-expand-inner">' + (p.content || '') + imgs + '</div></div>' +
        '</div>';
    });
    list.innerHTML = html;

    list.querySelectorAll('.post-row').forEach(function (row) {
      row.addEventListener('click', function () { togglePost(row); });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePost(row);
        }
      });
    });
  }

  /* ===== HERO STATS ===== */
  function setStat(id, value) {
    var node = el(id);
    if (node) node.textContent = value;
  }

  /* ===== INTERACTIONS ===== */
  function initGlare() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.addEventListener('mousemove', function (e) {
      var card = e.target.closest('.glass');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      card.style.setProperty('--mx', ((x / rect.width) * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((y / rect.height) * 100).toFixed(1) + '%');
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll('.reveal');
    if (!window.IntersectionObserver) {
      nodes.forEach(function (n) { n.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    nodes.forEach(function (n) { observer.observe(n); });
  }

  /* ===== BOOT ===== */
  function load(url, render, failId) {
    return fetchJSON(url).then(render).catch(function (err) {
      console.error(err);
      var node = el(failId);
      if (node) node.innerHTML = stateChip('Failed to load.');
      return null;
    });
  }

  Promise.all([
    load('data/projects.json', function (data) {
      var projects = data.projects || data;
      renderProjects(projects);
      setStat('stat-projects', projects.length);
    }, 'project-grid'),
    load('data/collaborators.json', function (data) {
      var collabs = data.collaborators || data;
      renderCollaborators(collabs);
      setStat('stat-collabs', collabs.length);
    }, 'collab-grid'),
    load('data/posts.json', function (posts) {
      renderPosts(posts);
      setStat('stat-posts', posts.length);
    }, 'post-list')
  ]).then(function () {
    initGlare();
    initReveal();
  });
})();
