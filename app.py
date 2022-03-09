from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route("/", methods=['GET', "POST"])
def index():
    return render_template("index.html")


@app.route("/send_last_job", methods=['POST',])
def get_data():

    input_json = request.get_json(force=True)
    print('data from client:', input_json)

    results = {'processed': 'true'}
    return jsonify(results)


@app.route("/get_last_job", methods=['POST',])
def send_data():
    input_json = request.get_json(force=True)
    count = input_json.get("count", 0)

    if count == 0:
        return

    results = {'processed': 'true'}
    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)