const canvasParent = document.getElementById("main")
const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

let backgroundColor = "white"
let color = "white"
let size = 10

let isTouching = false
let undos = new Array()


const beforeDraw = () => {
    console.log(`Begining draw`)
    isTouching = true
}


const draw = () => {
    if(!isTouching) return
    console.log(`Drawing with color: ${color} and size: ${size}`)
}


const stopDraw = () => {
    console.log(`Drawing was stoped`)
    isTouching = false
}

const getWidth = () => canvasParent.offsetWidth
const getHeight = () => canvasParent.offsetHeight

const resizeCanvas = () => {

    canvas.width = getWidth()
    canvas.height = getHeight()

    context.fillStyle = color
    context.fillRect(0, 0, getWidth(), getHeight())

    console.log(`resize ${canvas.width} | ${canvas.height}`)

}

const init = () =>{
    canvas.addEventListener("touchstart", beforeDraw, false)
    canvas.addEventListener("touchmove", draw, false)
    canvas.addEventListener("touchend", stopDraw, false)

    canvas.addEventListener("mousedown", beforeDraw, false)
    canvas.addEventListener("mousemove", draw, false)
    canvas.addEventListener("mouseup", stopDraw, false)

    resizeCanvas()

    window.addEventListener('resize', resizeCanvas, false)
}


window.addEventListener('load', () => {  // this one or make init from html
     init()
})