const canvasParent = document.getElementById("main")
const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

const config = {
    frequencySync: 5
}

let toSync = config.frequencySync

let backgroundColor = "white"
let color = "black"
let size = 5

let isTouching = false

let storage = {
    previusImage: new Array(),
    currentImage: null,
    nextImage: new Array()
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
    if(storage.previusImage.length == 0) return

    let presentCanvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
    storage.nextImage.push(presentCanvasImage)

    let lastCanvasImage = storage.previusImage.pop()
    context.putImageData(lastCanvasImage, 0, 0)
}


const next = () => {
    if(storage.nextImage.length == 0) return

    let presentCanvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
    storage.previusImage.push(presentCanvasImage)

    let lastCanvasImage = storage.nextImage.pop()
    context.putImageData(lastCanvasImage, 0, 0)
}


const saveToStorage = () => {
    let imageCanvas = context.getImageData(0, 0, canvas.width, canvas.height)
    if(storage.currentImage) storage.previusImage.push(storage.currentImage)
    storage.currentImage = imageCanvas
    
    storage.nextImage = []

    toSync--
    if(toSync == 0){
        sendData(storage.currentImage)
        toSync = config.frequencySync
    }
}

const clearStorage = () => {
    storage.previusImage = []
    storage.nextImage = []
}


const clearCanvas = () =>{
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)

    saveToStorage()
}


const getWidth = () => canvasParent.offsetWidth
const getHeight = () => canvasParent.offsetHeight

const resizeCanvas = () => {
    canvas.width = getWidth()
    canvas.height = getHeight()

    if(!storage.currentImage) {
        clearCanvas()
        clearStorage()
    }

    context.putImageData(storage.currentImage, 0, 0)
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

    window.addEventListener('resize', resizeCanvas, false)
}


window.addEventListener('load', () => {  // this one or make init from html
     init()
})