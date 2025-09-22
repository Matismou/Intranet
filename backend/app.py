from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route("/api/user", methods=["GET"])
def get_user():
    # Simuler une réponse complète pour l'instant
    return jsonify({
        "username": "matias.dewinne",   # ce que ton JS attend
        "site": "ELY"                   # pour charger la bonne météo
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
