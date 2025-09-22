const translations = {
  fr: {
    "welcome-title": "👋 Bienvenue sur l'intranet EUROCAST",
    "intro-text": '"Tout ce qu’il vous faut, au même endroit."',
    "service-status-title": "🔔 État des services :",
    "status-ok": "🟢 Tous les services sont opérationnels",
    "status-warning": "🟠 GLPI sera en maintenance jeudi à 18h",
    "status-down": "🔴 Problème détecté sur OneDrive",
    "tools-title": "🔗 Outils",
    "docs-title": "📄 Documents",
    "procedures-link": "📘 Procédures",
    "directory-link": "📖☎️ Annuaire",
    "search-input": "🔎 Rechercher un outil, document, etc."
  },
  en: {
    "welcome-title": "👋 Welcome to the EUROCAST intranet",
    "intro-text": '"Everything you need, in one place."',
    "service-status-title": "🔔 Service status:",
    "status-ok": "🟢 All services are operational",
    "status-warning": "🟠 GLPI maintenance scheduled Thursday at 6pm",
    "status-down": "🔴 Issue detected on OneDrive",
    "tools-title": "🔗 Tools",
    "docs-title": "📄 Documents",
    "procedures-link": "📘 Procedures",
    "directory-link": "📖☎️ Directory",
    "search-input": "🔎 Search a tool, document, etc."
  },
  pt: {
    "welcome-title": "👋 Bem-vindo ao intranet EUROCAST",
    "intro-text": '"Tudo o que você precisa, em um só lugar."',
    "service-status-title": "🔔 Status dos serviços:",
    "status-ok": "🟢 Todos os serviços estão operacionais",
    "status-warning": "🟠 Manutenção do GLPI agendada para quinta às 18h",
    "status-down": "🔴 Problema detectado no OneDrive",
    "tools-title": "🔗 Ferramentas",
    "docs-title": "📄 Documentos",
    "procedures-link": "📘 Procedimentos",
    "directory-link": "📖☎️ Diretório",
    "search-input": "🔎 Procurar uma ferramenta, documento, etc."
  },
  es: {
    "welcome-title": "👋 Bienvenido al intranet de EUROCAST",
    "intro-text": '"Todo lo que necesitas, en un solo lugar."',
    "service-status-title": "🔔 Estado de los servicios:",
    "status-ok": "🟢 Todos los servicios están operativos",
    "status-warning": "🟠 Mantenimiento de GLPI programado para el jueves a las 18h",
    "status-down": "🔴 Problema detectado en OneDrive",
    "tools-title": "🔗 Herramientas",
    "docs-title": "📄 Documentos",
    "procedures-link": "📘 Procedimientos",
    "directory-link": "📖☎️ Directorio",
    "search-input": "🔎 Buscar una herramienta, documento, etc."
  },
  de: {
    "welcome-title": "👋 Willkommen im EUROCAST-Intranet",
    "intro-text": '"Alles, was Sie brauchen, an einem Ort."',
    "service-status-title": "🔔 Dienststatus:",
    "status-ok": "🟢 Alle Dienste funktionieren einwandfrei",
    "status-warning": "🟠 GLPI-Wartung am Donnerstag um 18 Uhr geplant",
    "status-down": "🔴 Problem mit OneDrive erkannt",
    "tools-title": "🔗 Werkzeuge",
    "docs-title": "📄 Dokumente",
    "procedures-link": "📘 Verfahren",
    "directory-link": "📖☎️ Verzeichnis",
    "search-input": "🔎 Ein Tool, Dokument usw. suchen"
  },
  hu: {
    "welcome-title": "👋 Üdvözöljük a EUROCAST intraneten",
    "intro-text": '"Minden, amire szüksége van, egy helyen."',
    "service-status-title": "🔔 Szolgáltatások állapota:",
    "status-ok": "🟢 Minden szolgáltatás működik",
    "status-warning": "🟠 GLPI karbantartás csütörtökön 18:00-kor",
    "status-down": "🔴 Hiba történt a OneDrive-nál",
    "tools-title": "🔗 Eszközök",
    "docs-title": "📄 Dokumentumok",
    "procedures-link": "📘 Eljárások",
    "directory-link": "📖☎️ Névjegyzék",
    "search-input": "🔎 Eszköz, dokumentum stb. keresése"
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  for (const id in dict) {
    const el = document.getElementById(id);
    if (!el) continue;
    
    if (id === "search-input") {
      el.setAttribute("placeholder", dict[id]);
    } else {
      el.textContent = dict[id];
    }
  }
}

