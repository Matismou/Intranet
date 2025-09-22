## Workflow Git pour collaborer sur ce dépôt

### Depuis une nouvelle machine :
```bash
# Cloner le dépôt (une seule fois)
git clone git@github.com\:Matismou/Intranet.git
cd Intranet

# Faire tes modifications, puis :
git add .
git commit -m "Description claire des modifications"
git push

### Depuis une machine ou le clone est déjà installé
# Se placer dans le dossier du dépôt
cd ~/Intranet

# Récupérer les dernières modifications
git pull
