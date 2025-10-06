window.addEventListener('DOMContentLoaded', async () => {
  // let siteConfig = null;
  // try {
  //   const confRes = await fetch('site-config.json');
  //   siteConfig = await confRes.json();
  // } catch {}

  // Greeting with displayName fallback
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    const displayName = data.displayName || deriveDisplayName(data.username);
    const firstName = displayName?.split(' ')[0] || 'Utilisateur';
    document.getElementById('user-welcome').textContent = `👤 Bonjour ${capitalize(firstName)}`;

    // If backend provides a preferred city, set it before first weather load
    const villeSelect = document.getElementById('ville-select');
    if (villeSelect && data.city) {
      const found = Array.from(villeSelect.options).some(opt => opt.value === data.city);
      if (!found) {
        const opt = document.createElement('option');
        opt.value = data.city;
        opt.textContent = data.city;
        villeSelect.appendChild(opt);
      }
      villeSelect.value = data.city;
    }

  } catch (err) {
    document.getElementById('user-welcome').textContent = '👤 Bonjour';
  }


  // Build tools/docs based on site and then wire search
  // const userSite = (typeof data !== 'undefined' && data.site) ? data.site : null;
  // if (siteConfig) {
  //   const cfg = siteConfig[userSite] || siteConfig.DEFAULT;
  //   if (cfg) {
  //     rebuildLinks('.section-group:nth-of-type(2) .card-grid', cfg.tools);
  //     rebuildLinks('.section-group:nth-of-type(3) .card-grid', cfg.docs);
  //   }
  // }

  // Client-side search suggestions
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (input && results) {
    let items = collectSearchItems();
    input.addEventListener('input', () => renderSuggestions(items, input.value, results));
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { clearSuggestions(results); } });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) clearSuggestions(results);
    });
    // Refresh items if links have been rebuilt
    items = collectSearchItems();
  }

  // Lazy-load GLPI iframe to prevent auto-scroll to bottom on page load
  const showGlpiBtn = document.getElementById('show-glpi');
  const glpiWrapper = document.getElementById('glpi-frame-wrapper');
  const glpiIframe = document.getElementById('glpi-iframe');
  if (showGlpiBtn && glpiWrapper && glpiIframe) {
    showGlpiBtn.addEventListener('click', () => {
      const src = glpiIframe.getAttribute('data-src');
      if (src && !glpiIframe.src) {
        glpiIframe.src = src;
      }
      glpiWrapper.style.display = 'block';
      glpiWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Best Practices modal
  const bpOpen = document.getElementById('open-bp-modal');
  const bpModal = document.getElementById('bp-modal');
  if (bpOpen && bpModal) {
    const closeElems = bpModal.querySelectorAll('[data-close="bp-modal"]');
    const openModal = () => { bpModal.setAttribute('aria-hidden', 'false'); };
    const closeModal = () => { bpModal.setAttribute('aria-hidden', 'true'); };
    bpOpen.addEventListener('click', openModal);
    closeElems.forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Best Practices inline details
  const bpDetailsBtn = document.getElementById('toggle-bp-details');
  const bpDetails = document.getElementById('bp-details');
  if (bpDetailsBtn && bpDetails) {
    bpDetailsBtn.addEventListener('click', () => {
      const visible = bpDetails.style.display !== 'none';
      bpDetails.style.display = visible ? 'none' : 'block';
      bpDetailsBtn.textContent = visible ? 'Lire maintenant' : 'Masquer le détail';
    });
  }

  // Init météo (default city if present)
  const villeSelect = document.getElementById('ville-select');
  if (villeSelect) {


    // Trigger once on load using selected or backend-provided city
    try { await chargerMeteoDepuisChoix(); } catch { /* noop */ }
  }
});

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function deriveDisplayName(username) {
  if (!username) return undefined;
  // Accept forms like "prenom.nom" or "DOMAIN\\prenom.nom"
  const parts = username.includes('\\') ? username.split('\\')[1] : username;
  const [prenom, nom] = parts.split('.')
    .map(x => x ? x.charAt(0).toUpperCase() + x.slice(1) : x);
  return [prenom, nom].filter(Boolean).join(' ');
}

function collectSearchItems() {
  // Collect links under tools and documents sections
  const links = Array.from(document.querySelectorAll('.card-grid a.card'));
  return links.map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href'), target: a.getAttribute('target') }));
}

function renderSuggestions(items, query, container) {
  clearSuggestions(container);
  const q = query.trim().toLowerCase();
  if (!q) return;
  const matches = items.filter(it => it.text.toLowerCase().includes(q)).slice(0, 6);
  for (const m of matches) {
    const a = document.createElement('a');
    a.className = 'search-suggestion';
    a.textContent = m.text;
    a.href = m.href;
    if (m.target) a.target = m.target;
    container.appendChild(a);
  }
}

function clearSuggestions(container) {
  container.innerHTML = '';
}


function rebuildLinks(selector, links) {
  const grid = document.querySelector(selector);
  if (!grid || !Array.isArray(links)) return;
  grid.innerHTML = '';
  links.forEach(link => {
    const a = document.createElement('a');
    a.className = 'card';
    a.textContent = link.text;
    a.href = link.href;
    if (link.target) a.target = link.target;
    a.rel = 'noopener noreferrer';
    grid.appendChild(a);
  });
}

// --- Météo ---
const apiKey = 'd0d485d19c0ab1582d6e3d981c8e1849'; // Remplacer par votre vraie clé si besoin

async function chargerMeteoDepuisChoix() {
  const select = document.getElementById('ville-select');
  const out = document.getElementById('meteo-texte');
  if (!select || !out) return;
  const ville = select.value;
  try {
    out.textContent = 'Chargement...';
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)},FR&appid=${apiKey}&units=metric&lang=fr`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const temp = Math.round(data.main?.temp);
    const meteo = data.weather?.[0]?.description || '';
    out.textContent = `${ville} – ${isFinite(temp) ? temp + '°C' : ''}${meteo ? ', ' + meteo : ''}`;
  } catch (err) {
    out.textContent = '⚠️ Météo indisponible';
  }
}