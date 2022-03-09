var testObjectData = 
    { 
        Username: "Jan" ,
        Lastname: "Kowalski" 
    };
    
const sendData = (objectData) => {
    $.ajax({
        type: "POST",
        url: "/send_last_job",
        contentType : 'application/json',
        dataType : 'json',

        data: JSON.stringify(objectData),
        success: function (data) {
           console.log(data)
        },
        error: function () {
            alert('Error');
        }
    });
}

const getData = (count = 1) => {
    $.ajax({
        type: "POST",
        url: "/get_last_job",
        contentType : 'application/json',
        dataType : 'json',

        data: JSON.stringify({ count: count }),
        success: function (data) {
           console.log(data["processed"])
        },
        error: function () {
            console.log("Error")
        }
    });
}

document.getElementsByTagName('button')[0].addEventListener('click', () => {sendData(testObjectData)}, false)