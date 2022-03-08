const canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

let color = "red"
let size = 10

let isTouching = false

let undos = new Array()

canvas.addEventListener("touchstart", () => {isTouching = true})
canvas.addEventListener("touchend", () => {isTouching = false})

window.addEventListener('load', () => {
    window.addEventListener('resize', resizeCanvas, false)
})


const draw = () => {
    console.log("draw" + color + str(size))
}

const resizeCanvas = () => {
    console.log(`resize ${canvas.hight} | ${canvas.width}`)

    // canvas.height = 0
    // canvas.width = 0
}