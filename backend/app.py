from flask import Flask, jsonify, request
import json
import os
from pathlib import Path
import requests

app = Flask(__name__)

# Mapping simple site -> ville par défaut
SITE_DEFAULT_CITY = {
    "ELY": "Lyon",
    "ETH": "Thonon-les-Bains",
    "EBR": "Brive-la-Gaillarde",
    "ERE": "Reyrieux",
    "EDE": "Delle",
    "ECH": "Châteauroux",
}

MAPPING_FILE = Path(os.getenv("USER_SITE_MAP_FILE", "/app/site_map.json"))

def load_user_site_map() -> dict:
    if MAPPING_FILE.exists():
        try:
            with open(MAPPING_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return data
        except Exception:
            pass
    return {}

def _get_username_from_headers(req: request) -> str | None:
    # Essayez différents en-têtes qu'un proxy SSO peut définir
    return (
        req.headers.get("X-Remote-User")
        or req.headers.get("X-Forwarded-User")
        or req.headers.get("Remote-User")
        or None
    )

@app.route("/api/user", methods=["GET"])
def get_user():
    # Détecter l'utilisateur via l'en-tête si disponible
    username = _get_username_from_headers(request) or "matias.dewinne"

    # 1) Essayer de déduire le site via Microsoft Graph (attribut Organization)
    site = None
    access_token = request.headers.get('X-Auth-Request-Access-Token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if access_token:
        try:
            me = requests.get(
                'https://graph.microsoft.com/v1.0/me?$select=displayName,mail,jobTitle,department,companyName',
                headers={'Authorization': f'Bearer {access_token}'}, timeout=5
            )
            if me.ok:
                me_json = me.json()
                # Plusieurs emplacements possibles selon ton tenant: department, companyName, jobTitle
                candidate = me_json.get('department') or me_json.get('companyName') or me_json.get('jobTitle')
                if isinstance(candidate, str):
                    code = candidate.strip().upper()
                    # Extraire un code site de type ELY/ERE/ETH présent dans la chaîne
                    for k in SITE_DEFAULT_CITY.keys():
                        if k in code:
                            site = k
                            break
        except Exception:
            pass

    # 2) Sinon, mapping local JSON ou DEFAULT_SITE
    if not site:
        user_map = load_user_site_map()
        site = user_map.get(username) or os.getenv("DEFAULT_SITE")

    # Ville par défaut depuis le site connu
    city = SITE_DEFAULT_CITY.get(site) if site else None

    # Réponse minimale permettant au front d'ajuster météo/liens
    return jsonify({
        "username": username,
        "site": site,          # peut être None si inconnu
        "city": city           # peut être None si site inconnu
    })

@app.route("/api/_debug/headers", methods=["GET"])
def debug_headers():
    redacted = {}
    for k, v in request.headers.items():
        kl = k.lower()
        # Redact sensitive values like tokens and cookies
        if (
            kl == "authorization"
            or kl == "cookie"
            or "token" in kl
        ):
            redacted[k] = "<redacted>"
        else:
            redacted[k] = v
    return jsonify(redacted)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
