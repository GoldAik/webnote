const sendData = async (objectData = null) => {
    let imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    
    let formData = new FormData()
    formData.append("image", imageBlob, "image.png")

    console.log(formData)


    $.ajax({
        type: "POST",
        url: "/send_last_job",
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
           console.log(data)
        },
        error: function () {
            alert('Error');
        }
    });
}

const getData = () => {
    let image = new Image()
    image.src = "/get_last_job/image.png"
    image.onload = () => {
        context.drawImage(image, 0, 0)
    };

    let data = {
        request: ["brushSize", "brushColor"]
    }

    $.ajax({
        type: "POST",
        url: "/get_last_job",
        contentType: "json",
        data: data,
        success: function (data) {
            if(data["processed"]){
                console.log(data)
            }
        },
        error: function () {
            console.log("Error")
        }
    });
}