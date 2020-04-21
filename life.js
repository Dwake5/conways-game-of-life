let canvas 
let ctx 

const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
let output = document.getElementById("demo")

let tileSize = 19
const gap = 1

const width = document.getElementById('myCanvas').width
const height = document.getElementById('myCanvas').width

let tileColumnCount = Math.ceil(width/(tileSize+gap))
let tileRowCount = Math.ceil(height/(tileSize+gap))

let boundX 
let boundY 

let running = false

let iterationSpeed = 500

let tiles = []
const freshGrid = () => {
    for (c = 0; c < tileColumnCount; c++) {
        tiles[c] = []
        for (r = 0; r < tileRowCount; r++) {
            tiles[c][r] = {x: c, y: r,  alive: false}
        }
    }
}

function validate(evt) {
    let theEvent = evt || window.event;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    let regex = /[0-8]/;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
}

const updateInitialValues = () => {
    tileSize = sizeSlider.value-1
    tileColumnCount = Math.ceil(width/(tileSize+gap))
    tileRowCount = Math.ceil(height/(tileSize+gap))
}

const myMove = e => {
    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop
    
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileSize + gap) < x && x < c*(tileSize + gap)+tileSize && r*(tileSize + gap) < y && y < r*(tileSize + gap)+tileSize) {
                if (tiles[c][r].alive == true && (c != boundX || r != boundY)) {
                    tiles[c][r].alive = false
                    boundX = c
                    boundY = r
                } else if (tiles[c][r].alive == false && (c != boundX || r != boundY)) {
                    tiles[c][r].alive = true
                    boundX = c
                    boundY = r
                }
            }
        }
    }
}

const myDown = e => {
    canvas.onmousemove = myMove

    x = e.pageX - canvas.offsetLeft
    y = e.pageY - canvas.offsetTop

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (c*(tileSize + gap) < x && x < c*(tileSize + gap)+tileSize && r*(tileSize + gap) < y && y < r*(tileSize + gap)+tileSize) {
                if (tiles[c][r].alive == true) {
                    tiles[c][r].alive = false
                    boundX = c
                    boundY = r
                } else if (tiles[c][r].alive == false) {
                    tiles[c][r].alive = true
                    boundX = c
                    boundY = r
                }
            }
        }
    }
}

const myUp = () => {
    canvas.onmousemove = null
}

const clear = () => {
    ctx.clearRect(0, 0, width, height)
}

const draw = () => {
    clear()
    let size = tileSize + gap

    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            rectangle(tiles[c][r].x*size, tiles[c][r].y*size, tileSize, tileSize, tiles[c][r].alive)
        }
    }
}

const rectangle = (x,y,w,h, alive) => {
    if (alive == false) {
        ctx.fillStyle = '#999999'
    } else {
        ctx.fillStyle = '#FFFF00'
    }
    
    ctx.beginPath()
    ctx.rect(x,y,w,h)
    ctx.closePath()
    ctx.fill()
}

// Called by html
const switchRunning = () => {
    running = !running
    document.getElementById('run').innerHTML = running ? 'Pause' : 'Run'
    runLife()
}

const runLife = () => {
    setInterval(function(){
        if(running) {
            updateTiles()
        }
    }, iterationSpeed)
}


resetDefaults = () => {
    document.getElementById('minAlive').value = 2
    document.getElementById('maxAlive').value = 3
    document.getElementById('minDead').value = 3
    document.getElementById('maxAlive').value = 3
}

updateTiles = () => {
    let minAlive = document.getElementById('minAlive').value
    let maxAlive = document.getElementById('maxAlive').value
    let minDead = document.getElementById('minDead').value
    let maxDead = document.getElementById('maxAlive').value
    
    // Set a variable for what lives next round
    let newAlive = []
    // Map over current tiles
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            let count = countAdjacent(c,r)
            if (tiles[c][r].alive && minAlive <= count && count <= maxAlive) {
                newAlive.push([c,r])
            } else if (!tiles[c][r].alive && minDead <= count && count <= maxDead) {
                newAlive.push([c,r])
            }
        }
    }
    if (newAlive.length == 0) {
        handleDeath()
    }
    freshGrid()
    for (i = 0; i < newAlive.length; i++) {
        tiles[newAlive[i][0]][newAlive[i][1]].alive = true
    }
}

const countAdjacent  = (c, r) => {
    let count = 0
    // for each direction first check if it exists then see if its alive
    // There has got to be a better way to do this
    if (c < tileColumnCount-1 && tiles[c+1][r].alive) count++
    if (c > 0 && tiles[c-1][r].alive) count++
    if (r < tileRowCount-1 && tiles[c][r+1].alive) count++
    if (r > 0 && tiles[c][r-1].alive) count++
    if (c < tileColumnCount-1 && r < tileRowCount-1 && tiles[c+1][r+1].alive) count++
    if (c < tileColumnCount-1 && r > 0 && tiles[c+1][r-1].alive) count++
    if (c > 0 && r > 0 && tiles[c-1][r-1].alive) count++
    if (c > 0 && r < tileRowCount-1 && tiles[c-1][r+1].alive) count++

    return count
}

const init = () => {
    canvas = document.getElementById('myCanvas')
    freshGrid()
    ctx = canvas.getContext('2d')
    return setInterval(draw, 10)
}

const handleSizeSlider = () => {
    updateInitialValues()
    canvas = document.getElementById('myCanvas')
    clear()
    running = false
    writeRun()
    tileSize = parseInt(sizeSlider.value)-1
    freshGrid()
}

const writeRun = () => {
    document.getElementById('run').innerHTML = 'Run'
}
 
const writePause = () => {
    document.getElementById('run').innerHTML = 'Pause'
}

const handleClear = () => {
    running = false
    writeRun()
    freshGrid()
}

const handleDeath = () => {
    running = false
    writeRun()
    document.getElementById('deadMessage').style.color='red'
    setTimeout(function(){document.getElementById('deadMessage').style.color='white'}, 3000)
}

sizeSlider.oninput = function() {
    document.getElementById('changeSize').innerHTML = sizeSlider.value + ' px'
}

speedSlider.oninput = function() {
    document.getElementById('changeSpeed').innerHTML = speedSlider.value + ' ms'
    iterationSpeed = parseInt(this.value)
}

init()
canvas.onmousedown = myDown
canvas.onmouseup = myUp
