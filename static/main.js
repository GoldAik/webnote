const canvasParent = document.getElementById("main")
const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

let backgroundColor = "white"
let color = "black"
let size = 10

let isTouching = false

let previusStorage = new Array()
let nextStorage = new Array()

let storage = {
    previusStorage: new Array(),
    nextStorage: new Array()
}


const getPointX = (e) => e.clientX - canvas.offsetLeft
const getPointY = (e) => e.clientY - canvas.offsetTop

const beforeDraw = (e) => {
    console.log(`Begining draw`)
    isTouching = true

    context.beginPath()
    context.moveTo(getPointX(e), getPointY(e))
    e.preventDefault()
}


const draw = (e) => {
    if(!isTouching) return
    console.log(`Drawing with color: ${color} and size: ${size}`)

    context.lineTo(getPointX(e), getPointY(e))
    context.strokeStyle = color
    context.lineWidth = size
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()

    e.preventDefault()
}


const stopDraw = () => {
    console.log(`Drawing was stoped`)
    if(!isTouching) return

    context.closePath()
    isTouching = false

    saveToStorage()
}


const undo = () => {
    if(previusStorage.length == 0) return

    presentCanvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
    nextStorage.push(presentCanvasImage)

    lastCanvasImage = previusStorage.pop()
    context.putImageData(lastCanvasImage, 0, 0)
}


const next = () => {
    if(nextStorage.length == 0) return

    presentCanvasImage = context.getImageData(0, 0, canvas.width, canvas.height)
    previusStorage.push(presentCanvasImage)

    lastCanvasImage = nextStorage.pop()
    context.putImageData(lastCanvasImage, 0, 0)
}


const saveToStorage = () => {
    imageCanvas = context.getImageData(0, 0, canvas.width, canvas.height)
    previusStorage.push(imageCanvas)
    nextStorage = []
}


const clearCanvas = () =>{
    saveToStorage()

    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
}


const getWidth = () => canvasParent.offsetWidth
const getHeight = () => canvasParent.offsetHeight

const resizeCanvas = () => {
    canvas.width = getWidth()
    canvas.height = getHeight()

    console.log(`resize ${canvas.width} | ${canvas.height}`)

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

    window.addEventListener('resize', resizeCanvas, false)
}


window.addEventListener('load', () => {  // this one or make init from html
     init()
})