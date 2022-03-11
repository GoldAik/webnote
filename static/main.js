const canvasParent = document.getElementById("main")
const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

const config = {
    frequencySync: 5,
    frequencyTimeSync: 5000 // miliseconds
    
}

let toSync = config.frequencySync

let backgroundColor = "white"
let color = "black"
let size = 5

let isTouching = false

let storage = {
    images: new Array,
    pointer: -1
}


const getPointX = (e) => {
    if(e instanceof TouchEvent){
        return e.touches[0].clientX - canvas.offsetLeft
    }else if(e instanceof MouseEvent){
        return e.clientX - canvas.offsetLeft
    }
}
const getPointY = (e) => 
{
    if(e instanceof TouchEvent){
        return e.touches[0].clientY - canvas.offsetTop
    }else if(e instanceof MouseEvent){
        return e.clientY - canvas.offsetTop
    }
}


const beforeDraw = (e) => {
    isTouching = true

    context.beginPath()
    context.moveTo(getPointX(e), getPointY(e))

    context.lineTo(getPointX(e), getPointY(e))
    context.strokeStyle = color
    context.lineWidth = size
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    e.preventDefault()
}


const draw = (e) => {
    if(!isTouching) return
    console.log(`X:${getPointX(e)} Y:${getPointY(e)}`)

    context.lineTo(getPointX(e), getPointY(e))
    context.strokeStyle = color
    context.lineWidth = size
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    e.preventDefault()
}


const stopDraw = (e) => {
    if(!isTouching) return

    context.closePath()
    isTouching = false

    saveToStorage()

    e.preventDefault()
}


const undo = () => {
    if(storage.pointer <= 0) return

    let lastCanvasImage = storage.images[--storage.pointer]
    context.putImageData(lastCanvasImage, 0, 0)
}


const next = () => {
    if(storage.pointer + 1 >= storage.images.length) return

    let lastCanvasImage = storage.images[++storage.pointer]
    context.putImageData(lastCanvasImage, 0, 0)
}


const saveToStorage = () => {
    let imageCanvas = context.getImageData(0, 0, canvas.width, canvas.height)
    if(storage.currentImage) storage.previusImage.push(storage.currentImage)

    storage.images.push(imageCanvas)
    storage.pointer++

    if(storage.images.length - 1 > storage.pointer){
        storage.images.pop()
    }

    toSync--
    if(toSync == 0){
        sendData(storage.images[storage.pointer])
        toSync = config.frequencySync
    }
}

const clearStorage = () => {
    
}


const clearCanvas = (save = true) =>{
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    if(save)
        saveToStorage()
}


const getWidth = () => canvasParent.offsetWidth
const getHeight = () => canvasParent.offsetHeight

const resizeCanvas = () => {
    canvas.width = getWidth()
    canvas.height = getHeight()

    clearCanvas(save=false)

    if(storage.pointer >= 0)
        context.putImageData(storage.images[storage.pointer], 0, 0)
}


const syncWithServerEverySomeTime = (time = 5000) => {
    if(toSync == config.frequencySync){
        setTimeout(syncWithServerEverySomeTime, time, time);
        return
    }

    sendData(storage.images[storage.pointer])
    toSync = config.frequencySync

    setTimeout(syncWithServerEverySomeTime, time, time);
}


const init = () =>{
    canvas.addEventListener("touchstart", beforeDraw, false)
    canvas.addEventListener("touchmove", draw, false)
    window.addEventListener("touchend", stopDraw, false)

    canvas.addEventListener("mousedown", beforeDraw, false)
    canvas.addEventListener("mousemove", draw, false)
    window.addEventListener("mouseup", stopDraw, false)
    canvas.addEventListener("mouseout", stopDraw, false)

    resizeCanvas()
    clearCanvas()

    toSync = config.frequencySync
    syncWithServerEverySomeTime(config.frequencyTimeSync)

    window.addEventListener('resize', resizeCanvas, false)
}


window.addEventListener('load', () => {  // this one or make init from html
     init()
})