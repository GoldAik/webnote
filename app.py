from flask import Flask, render_template, request, jsonify
from PIL import Image

app = Flask(__name__, static_folder='static', template_folder='templates')

images_previus = []
images_next = []


@app.route("/", methods=['GET', "POST"])
def index():
    return render_template("index.html")


@app.route("/send_last_job", methods=['POST',])
def get_data():
    results = {'processed': 'true'}

    receive_data = request.get_json(force=True)
    print('receive data from client:', receive_data)

    image = receive_data.get("image", None)

    if image != None:
        images_previus.append(image)

    return jsonify(results)


@app.route("/get_last_job", methods=['POST',])
def send_data():
    results = {'processed': 'true'}
    results += {'retuned': 0}

    receive_data = request.get_json(force=True)
    count = receive_data.get("count", 0)

    if count == 0:
        pass
    
    if count >= len(images_previus):
        images_return = images_previus
        get_undos(images_return)
        
        results += {'images_previus': images_return}
        results['returned'] = len(images_return)

    if count < len(images_previus):
        images_return = images_previus[:count]
        get_undos(images_return)
        
        results += {'images_previus': images_return}
        results['returned'] = len(images_return)

    return jsonify(results)


def get_undos(images_returned):
    images_previus -= images_returned
    images_next += images_returned

@app.route("/save", methods=['GET','POST'])
def save_job():
    results = {'processed': 'true'}
    results += {'saved': 'false'}

    for index in range(len(images_previus)):
        try:
            img = Image.open(images_previus[index])
            img.save(f"./database/{index}.jpg")

            results["saved"] = 'true'
        except:
            pass

    return jsonify(results)


if __name__ == "__main__":
    app.run(debug=True)