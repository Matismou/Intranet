window.onload = async function () {
  try {
    const res = await fetch('/api/user');
    const data = await res.json();
    const prenom = data.username.split('.')[0];
    const site = data.site;
    document.getElementById('user-welcome').textContent = `👤 Bonjour ${prenom.charAt(0).toUpperCase() + prenom.slice(1)}`;
    chargerMeteoAuto(site);
  } catch (err) {
    document.getElementById('user-welcome').textContent = "👤 Utilisateur inconnu";
    document.getElementById('meteo-texte').textContent = "⚠️ Météo indisponible";
  }
};


async function chargerMeteoAuto(codeSite) {
  const mapSiteVille = {
    "ELY": "Lyon", "ERE": "Reyrieux", "POL": "Aveiro", "ETH": "Thonon",
    "ECH": "Châteauroux", "EBR": "Brive", "EDE": "Delle", "EAB": "Abele",
    "EDO": "Dorog", "EQU": "Queretaro", "EAV": "Aveiro", "EAR": "Arcos"
  };
  const ville = mapSiteVille[codeSite] || "Lyon";
  const apiKey = "d0d485d19c0ab1582d6e3d981c8e1849";
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville},FR&appid=${apiKey}&units=metric&lang=fr`);
    const data = await res.json();
    const temp = Math.round(data.main.temp);
    const meteo = data.weather[0].description;
    document.getElementById("meteo-texte").textContent = `${ville} – ${temp}°C, ${meteo}`;
  } catch {
    document.getElementById("meteo-texte").textContent = "⚠️ Météo indisponible";
  }
}