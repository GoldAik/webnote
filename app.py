from flask import Flask, render_template, request, jsonify, send_from_directory, Response
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
UPLOADS_DIR = os.path.join(app.root_path, "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)
path = os.path.join(UPLOADS_DIR, "image.png")


@app.route("/", methods=['GET', "POST"])
def index():
    return render_template("index.html")


@app.route("/send_last_job", methods=['POST',])
def get_data():
    results = {'processed': 'true'}

    receive_image = request.files.get("image", None)
    receive_image.save(path)

    return jsonify(results)


@app.route("/get_last_job/<path:path>", methods=['POST', 'GET'])
def send_image(path: str):
    if path.endswith(".png"):
        return send_from_directory(directory=UPLOADS_DIR, path=path)
    return Response(status=500)


@app.route("/get_last_job", methods=['POST'])
def send_data():
    results = {'processed': 'true'}

    return jsonify(results)


@app.route("/save", methods=['POST'])
def save_job():
    results = {'processed': True}

    filename = "a.wne"
    path = os.path.join(UPLOADS_DIR, filename)

    return jsonify(results)


@app.route("/set-workspace", methods=['POST'])
def set_workspace():
    results = {'processed': True}

    data = request.get_json(force=True)

    brush_type = data.get("brush_type", None)
    brush_size = data.get("brush_size", None)
    brush_color = data.get("brush_color", None)

    request.cookies.add('brush_type', brush_type)
    request.cookies.add('brush_size', brush_size)
    request.cookies.add('brush_color', brush_color)

    return jsonify(results)


@app.route("/get-workspace", methods=['POST'])
def get_workspace():
    results = {'processed': True}

    data = request.get_json(force=True)

    brush_type = request.cookies.get('brush_type', None)
    brush_size = request.cookies.get('brush_size', None)
    brush_color = request.cookies.get('brush_color', None)

    results['brush_type'] = brush_type
    results['brush_size'] = brush_size
    results['brush_color'] = brush_color

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)