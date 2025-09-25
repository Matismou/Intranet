from flask import Flask, jsonify, request
import json
import os
from pathlib import Path

app = Flask(__name__)

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

@app.route("/api/user", methods=["GET"])
def get_user():
    # Ici on détecte seulement via fallback (pas de SSO)
    username = request.headers.get("X-Remote-User") or "matias.dewinne"

    user_map = load_user_site_map()
    site = user_map.get(username) or os.getenv("DEFAULT_SITE")
    city = SITE_DEFAULT_CITY.get(site) if site else None

    return jsonify({
        "username": username,
        "site": site,
        "city": city
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
