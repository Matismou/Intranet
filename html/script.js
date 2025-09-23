window.addEventListener('DOMContentLoaded', async () => {
  // Greeting with displayName fallback
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    const displayName = data.displayName || deriveDisplayName(data.username);
    const firstName = displayName?.split(' ')[0] || 'Utilisateur';
    document.getElementById('user-welcome').textContent = `👤 Bonjour ${capitalize(firstName)}`;
  } catch (err) {
    document.getElementById('user-welcome').textContent = '👤 Bonjour';
  }

  // Client-side search suggestions
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (input && results) {
    const items = collectSearchItems();
    input.addEventListener('input', () => renderSuggestions(items, input.value, results));
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { clearSuggestions(results); } });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar')) clearSuggestions(results);
    });
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