        const params = new URLSearchParams(window.location.search);
        const nameFromURL = params.get("name") || "";

        const modules = [
        {
          title: "Définition du cyberespace",
          question: "Le cyberespace inclut :",
          options: [
            "Seulement les ordinateurs connectés",
            "Tous les équipements, services et réseaux numériques mondiaux",
            "Les bases de données gouvernementales uniquement"
          ],
          correct: 1
        },
        {
          title: "Objectif de la cybersécurité",
          question: "La cybersécurité vise à :",
          options: [
            "Garantir la confidentialité, l’intégrité et la disponibilité des systèmes et données",
            "Supprimer toutes les menaces en ligne",
            "Empêcher les utilisateurs d’accéder à Internet"
          ],
          correct: 0
        },
        {
          title: "Phishing",
          question: "Quel est le principal vecteur utilisé dans le phishing ?",
          options: [
            "Une faille technique dans un logiciel",
            "La négligence ou le manque de vigilance d’un utilisateur",
            "Une vulnérabilité réseau"
          ],
          correct: 1
        },
        {
          title: "Déni de service",
          question: "Quel type de cyberattaque vise à rendre un service indisponible ?",
          options: [
            "Rançongiciel (ransomware)",
            "Attaque par déni de service (DDoS)",
            "Attaque ciblée (APT)"
          ],
          correct: 1
        },
        {
          title: "Navigation sécurisée",
          question: "Que faut-il vérifier avant de naviguer sur un site web ?",
          options: [
            "Que le site utilise un fond d’écran professionnel",
            "Que l’adresse est correcte et que la connexion est sécurisée (https)",
            "Que le site est bien référencé sur Google"
          ],
          correct: 1
        },
        {
          title: "Mot de passe sécurisé",
          question: "Un mot de passe sécurisé doit contenir :",
          options: [
            "Au moins 12 caractères, majuscules, minuscules, chiffres et caractères spéciaux",
            "Seulement des chiffres et lettres en majuscules",
            "Une suite logique facile à retenir, comme \"123456\""
          ],
          correct: 0
        },
        {
          title: "Cryptographie",
          question: "La cryptographie permet de :",
          options: [
            "Accélérer les connexions Internet",
            "Chiffrer les données pour les rendre illisibles sans clé de déchiffrement",
            "Bloquer les logiciels malveillants"
          ],
          correct: 1
        },
        {
          title: "Malware",
          question: "Quel terme regroupe les virus, vers et chevaux de Troie ?",
          options: [
            "Logiciel malveillant (malware)",
            "Programme informatique",
            "Application réseau"
          ],
          correct: 0
        },
        {
          title: "Sauvegardes",
          question: "Pourquoi est-il important de sauvegarder régulièrement ses données ?",
          options: [
            "Pour éviter de perdre des informations importantes en cas de cyberattaque",
            "Pour libérer de l’espace sur son ordinateur",
            "Pour pouvoir les partager plus rapidement"
          ],
          correct: 0
        },
        {
          title: "Signalement de contenu",
          question: "Quel organisme peut-on consulter pour signaler des contenus illicites en ligne ?",
          options: [
            "La CNIL",
            "PHAROS",
            "ANSSI"
          ],
          correct: 1
        }
        ];

        const toggleBtn = document.getElementById("toggle-theme");
        if (toggleBtn) {
          toggleBtn.addEventListener("click", () => {
            document.documentElement.classList.toggle("dark");
            toggleBtn.textContent = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
          });
        }        
        
      let step = 0;
      let score = 0;
      const responses = [];

      function renderModule() {
        const m = modules[step];
        const moduleDiv = document.getElementById("module");
      
        moduleDiv.innerHTML = `
          <h2 class="text-xl font-semibold mb-2 text-center">${m.title}</h2>
          <p class="font-medium mb-4 text-center">${m.question}</p>
          <div class="space-y-3">
            ${m.options
              .map(
                (opt, i) =>
                  `<button class="answer" onclick="handleAnswer(${i})">${opt}</button>`
              )
              .join("")}
          </div>
        `;
      
        document.getElementById("progress-container").style.display = "block";
        updateProgressBar();  // 🔥 assure que ça s’exécute ici
      }      

      window.handleAnswer = function (i) {
        const current = modules[step];
        responses.push({
          question: current.question,
          options: current.options,
          correct: current.correct,
          selected: i
        });
        if (i === current.correct) score++;
        step++;
        if (step < modules.length) {
          renderModule();
        } else {
          document.getElementById("progress-container").style.display = "none";
          const passed = (score / modules.length) >= 0.7;
          document.getElementById("module").innerHTML = `
            <div class="text-center">
              ${passed ? `<p class="text-xl">Formation terminée 🎉</p>` : ""}
              <p class="mt-2">Score : ${score}/${modules.length}</p>
              ${passed ? `
                <p class="mt-2 font-bold text-green-600">🎓 Certificat obtenu</p>
                <div class="mt-4 space-x-2">
                  <button onclick="downloadCertificate()" class="px-4 py-2 bg-green-600 text-white rounded">📄 Télécharger le certificat</button>
                  <button onclick="downloadAnswers()" class="px-4 py-2 bg-blue-600 text-white rounded">📄 Télécharger la feuille de réponses</button>
                </div>
              ` : `
                <p class="mt-2 font-bold text-red-600">❌ Vous n'avez pas atteint les 70% requis pour obtenir le certificat.</p>
                <p class="mt-1">Vous pouvez refaire le quiz en cliquant sur le bouton ci-dessous.</p>
                <button onclick="restartQuiz()" class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">🔁 Recommencer le quiz</button>
              `}
            </div>
        `;
        }
      };

      window.downloadCertificate = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const name = document.getElementById("username").value.trim();
        if (!name) return alert("Veuillez saisir votre nom avant de télécharger le certificat.");

        const date = new Date().toLocaleDateString("fr-FR");
        const logoImg = document.getElementById("logo-certificat");

        doc.addImage(logoImg, "PNG", 60, 10, 90, 30);

        doc.setFontSize(20);
        doc.text("CERTIFICAT DE FIN DE FORMATION", 45, 50);
        doc.setFontSize(14);
        doc.text("ATTESTATION DE FORMATION", 65, 60);

        doc.setFontSize(16);

        doc.setFontSize(12);
        doc.text(`GMD certifie que : ${name}`, 20, 100);
        doc.text("a suivi avec succès la formation en E-learning :", 20, 110);
        doc.text("Quiz - Passeport Cybersécurité", 20, 120);

        doc.text("Contenu et Objectifs de la formation :", 20, 135);
        doc.text("Sensibilisation des utilisateurs à la sécurité informatique", 20, 145);
        doc.text(`Date : ${date}`, 20, 160);

        doc.save(`certificat-${name.replace(/\s+/g, "_")}.pdf`);
      };

      window.downloadAnswers = function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const name = document.getElementById("username").value.trim();
        if (!name) return alert("Veuillez saisir votre nom avant de télécharger la feuille de réponses.");

        const date = new Date().toLocaleDateString("fr-FR");
        const percentage = Math.round((score / modules.length) * 100);
        const logoImg = document.getElementById("logo-certificat");

        doc.addImage(logoImg, "PNG", 60, 10, 90, 30);

        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text("Feuille de réponses", 105, 45, { align: "center" });

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Quiz : Quiz - Passeport Cybersécurité`, 20, 60);
        doc.text(`Utilisateur : ${name}`, 20, 68);
        doc.text(`Score : ${score} / ${modules.length}   Pourcentage : ${percentage}%   Seuil de validation : 70%`, 20, 76);
        doc.text(`Terminé le : ${date}`, 20, 84);

        let y = 100;

        responses.forEach((resp, index) => {
          if (y > 250) {
            doc.addPage();
            y = 20;
          }

          doc.setFont(undefined, 'bold');
          doc.text(`${index + 1}. ${resp.question}`, 20, y);
          y += 8;

          resp.options.forEach((opt, i) => {
            const isCorrect = i === resp.correct;
            const isSelected = i === resp.selected;
            let label = `${String.fromCharCode(97 + i)}) ${opt}`;
            if (isCorrect) label += " (bonne réponse)";

            const wrapped = doc.splitTextToSize(label, 170);
            const blockHeight = wrapped.length * 6;

            if (isSelected) {
              doc.setFillColor(isCorrect ? 200 : 255, isCorrect ? 255 : 200, 200);
              doc.rect(18, y - 5, 174, blockHeight + 4, 'F');
            }

            doc.setFont(undefined, 'normal');
            doc.text(wrapped, 20, y);
            y += blockHeight + 2;
          });

          y += 4;
        });

        doc.save(`reponses-${name.replace(/\s+/g, "_")}.pdf`);
      };

      function updateProgressBar() {
        const percentage = Math.round(((step + 1) / modules.length) * 100);
        document.getElementById("progress-bar").style.width = `${percentage}%`;
        document.getElementById("progress-text").textContent = `${percentage}%`;
      }          

      window.restartQuiz = function () {
        step = 0;
        score = 0;
        responses.length = 0;
        document.getElementById("progress-container").style.display = "block"; // <-- ajoute cette ligne
        renderModule();
      };

      document.addEventListener("DOMContentLoaded", () => {
        const params = new URLSearchParams(window.location.search);
        const nameFromURL = params.get("name") || "";
      
        if (!nameFromURL) {
          alert("Nom manquant, retour à la page d'accueil.");
          window.location.href = "index.html";
          return;
        }
      
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.id = "username";
        hiddenInput.value = nameFromURL;
        document.body.appendChild(hiddenInput);
      
        document.getElementById("module").style.display = "block";
      
        renderModule();    
        updateProgressBar(); 
      });