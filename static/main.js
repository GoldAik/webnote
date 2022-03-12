const canvasParent = document.getElementById("main")
const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

const config = {
    frequencySync: 5,
    frequencyTimeSync: 5000 // miliseconds
    
}

let toSync = config.frequencySync

let backgroundColor = "white"

let brushColor = "black"
let brushSize = 5
let brushType = "normal"

let isTouching = false
let canStartDraw = true

let storage = {
    images: new Array,
    pointer: -1
}

const setBrush = (brushColor = brushColor, brushSize = brushSize, brushType = brushType) =>{
    brushColor = brushColor
    brushSize = brushSize
    brushType = brushType
}


const makeLargerBrushSize = () =>{
    brushSize++
}

const makeSmallerBrushSize = () =>{
    brushSize--
}

const setBrushColor = (e) =>{
    brushColor = e.value
}

const setBrushSize = (e) =>{
    brushSize = e.value
}


const getPointX = (e, object = canvas) => {
    if(e instanceof TouchEvent){
        return e.touches[0].clientX - object.offsetLeft
    }else if(e instanceof MouseEvent){
        return e.clientX - object.offsetLeft
    }
}
const getPointY = (e, object = canvas) => 
{
    if(e instanceof TouchEvent){
        return e.touches[0].clientY - object.offsetTop
    }else if(e instanceof MouseEvent){
        return e.clientY - object.offsetTop
    }
}


const beforeDraw = (e) => {
    if(!canStartDraw) return

    isTouching = true

    context.beginPath()
    context.moveTo(getPointX(e), getPointY(e))

    context.lineTo(getPointX(e), getPointY(e))
    context.strokeStyle = brushColor
    context.lineWidth = brushSize
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    e.preventDefault()
}


const draw = (e) => {
    if(!isTouching) return

    context.lineTo(getPointX(e), getPointY(e))
    context.strokeStyle = brushColor
    context.lineWidth = brushSize
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

    while(storage.images.length - 1 > storage.pointer){
        storage.images.pop()
    }

    storage.images.push(imageCanvas)
    storage.pointer++

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