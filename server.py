from flask import Flask, request, jsonify

app = Flask(__name__)

@app.after_request
def add_cors_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return resp

@app.route("/hook", methods=["POST", "OPTIONS"])
def hook():
    if request.method == "OPTIONS":
        return ("", 204)
    data = request.get_json(silent=True) or {}
    print("AI Lab message:", data)
    return jsonify({"ok": True})

if __name__ == "__main__":
    app.run(port=5000)