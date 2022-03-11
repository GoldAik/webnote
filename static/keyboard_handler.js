let pressedKeys = new Array()

const shortcutHandler = () =>{
    console.log(pressedKeys)
    if(pressedKeys.includes("Control") &&  pressedKeys.includes("z")){
        undo()
    }
    else if(pressedKeys.includes("Control") &&  pressedKeys.includes("Shift") && pressedKeys.includes("Z")){
        next()
    }
    else if(pressedKeys.includes("Control") &&  pressedKeys.includes("Delete")){
        clearCanvas()
    }
}


const pressKey = (e) =>{
    let key = e.key

    if(!pressedKeys.includes(key)) pressedKeys.push(key) // pressing by time
    
    shortcutHandler()
}


const releaseKey = (e) =>{
    let key = e.key
    
    pressedKeys.pop(key)
}


document.addEventListener('keydown', pressKey, false)
document.addEventListener('keyup', releaseKey, false)