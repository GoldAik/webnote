const container = document.getElementById("container")
const leftBar = document.getElementById("leftBar")
const rightBar = document.getElementById("rightBar")
const main = document.getElementById("main")

const colorPicker = document.getElementById("colorPicker")

let leftBarWidth = leftBar.offsetWidth
let rightBarWidth = rightBar.offsetWidth

let leftBarObject = {
    defaultWidth: leftBar.offsetWidth,
    borderWithMain: main.offsetLeft,
    htmlElem: leftBar,
    isExpanded: true,
    maxWidth: 400,
    minWidth: 100,
}

let rightBarObject = {
    defaultWidth: rightBar.offsetWidth,
    borderWithMain: rightBar.offsetLeft,
    htmlElem: rightBar,
    isExpanded: true,
    maxWidth: 400,
    minWidth: 100,
}

let bars = {
    "leftBar": leftBarObject,
    "rightBar": rightBarObject,
}

let cursorOnResizingSpace = false
let mouseDownOnResizingSpace = false

let trackingObject = null
let objectToResize = null


const expandBar = (object) =>{
    object.htmlElem.style.width = `${object.defaultWidth}px`
} 

const shrinkBar = (object, width = 10) =>{
    object.htmlElem.style.width = `${width}px`
} 

const expandShrinkSwitcher = (e) =>{
    let bar = bars[e.parentElement.id]

    if(bar.isExpanded) shrinkBar(bar)
    if(!bar.isExpanded) expandBar(bar)

    onResize()
    bar.isExpanded = !bar.isExpanded
}


const checkPosition = (e) =>{
    if(isTouching) return //drawing

    let x = getPointX(e, container)

    cursorOnResizingSpace = false

    Object.keys(bars).forEach (key => {
        let object = bars[key]
        if(object.isExpanded){
            let distance = Math.abs( x - object.borderWithMain )
            
            if(distance < 5){
                container.style.cursor = "ew-resize"
                cursorOnResizingSpace = true
                canStartDraw = false
                trackingObject = object
            }
        }
    });

    if(!cursorOnResizingSpace){
        container.style.cursor = "default"
        canStartDraw = true
        trackingObject = null
    }

    if(!objectToResize) return

    if(objectToResize) resizeBar(x, objectToResize)
}

const resizeBar = (x, object) =>{
    let r = x - object.borderWithMain
    let objectWidth = object.htmlElem.offsetWidth

    let newWidth = 0

    if(object.htmlElem.id == "leftBar"){
        newWidth = objectWidth + r
    }else{
        newWidth = objectWidth - r
    }
    let clampedWidth = Math.min(Math.max(newWidth, object.minWidth), object.maxWidth);

    object.htmlElem.style.width = `${clampedWidth}px`

    onResize()
}

const checkMouseDown = (e) =>{
    if(!cursorOnResizingSpace) return

    objectToResize = trackingObject
}

const mouseUp = () =>{
    objectToResize = null
}

const onResize = () =>{
    leftBarObject.borderWithMain = main.offsetLeft
    rightBarObject.borderWithMain = rightBar.offsetLeft

    main.style.width = `calc(100% - ${leftBar.offsetWidth + rightBar.offsetWidth}px)`

    resizeCanvas()
}


container.addEventListener("mousemove", checkPosition, false)
container.addEventListener("mousedown", checkMouseDown, false)
container.addEventListener("mouseup", mouseUp, false)
