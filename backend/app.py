from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/api/user", methods=["GET"])
def get_user():
    """Retourne l'utilisateur détecté par le proxy et un code site.

    - Récupère le header X-Remote-User envoyé par Nginx (ex: "EUROCAST\\mdewinne")
    - Normalise en "mdewinne" (ou retourne tel quel s'il est déjà de type "prenom.nom")
    - Optionnel: récupère le site depuis X-Site ou défaut ELY
    """

    raw_user = (
        request.headers.get("X-Remote-User")
        or request.headers.get("X-Authenticated-User")
        or request.headers.get("Remote-User")
        or ""
    )

    username = raw_user.strip().strip('"')
    # Cas DOMAIN\\user => garder la partie après le backslash
    if "\\" in username:
        username = username.split("\\")[-1]

    # Si c'est un UPN (user@domain), garder la partie avant @
    if "@" in username:
        username = username.split("@")[0]

    # Fallback si vide
    if not username:
        username = "inconnu"

    site = request.headers.get("X-Site", "ELY")

    return jsonify({
        "username": username,
        "site": site
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
