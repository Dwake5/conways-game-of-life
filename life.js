let canvas 
let ctx 

const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");

let tileSize = 19
const gap = 1

const ticks = document.getElementById('ticks')

const width = document.getElementById('myCanvas').width
const height = document.getElementById('myCanvas').width

let tileColumnCount = Math.ceil(width/(tileSize+gap))
let tileRowCount = Math.ceil(height/(tileSize+gap))

let boundX 
let boundY 

let running = false

let iterationSpeed = 500
let dropdown = document.getElementById('dropdown')

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
    let key
    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        key = theEvent.keyCode || theEvent.which;
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
                    // Used to make new presets
                    // console.log(c + ' , ' + r)
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
    let startInt = iterationSpeed
    let interval = setInterval(function(){
        if(running) {
            updateTiles()
            ticks.innerHTML++
            if (startInt !== iterationSpeed) {
                clearInterval(interval)
                runLife()
            }
        } else {
            clearInterval(interval)
        }
    }, iterationSpeed)
}

resetDefaults = () => {
    document.getElementById('minAlive').value = 2
    document.getElementById('maxAlive').value = 3
    document.getElementById('minDead').value = 3
    document.getElementById('maxDead').value = 3
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
    ticks.innerHTML = 0
    dropdown.value = 'free'
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
    ticks.innerHTML = 0
}

const handleDeath = () => {
    running = false
    writeRun()
    document.getElementById('deadMessage').style.color='red'
    setTimeout(function(){document.getElementById('deadMessage').style.color='white'}, 3000)
    ticks.innerHTML = -1
}

sizeSlider.oninput = function() {
    document.getElementById('changeSize').innerHTML = sizeSlider.value + ' px'
}

speedSlider.oninput = function() {
    document.getElementById('changeSpeed').innerHTML = speedSlider.value + ' ms'
    iterationSpeed = parseInt(this.value)
}

const populateCells = arr => {
    for (i = 0; i < arr.length; i++) {
        tiles[arr[i][0]][arr[i][1]].alive = true
    }
}

// This function helps make new predefined layouts
const tellMeAlive = () => {
    let aliveCells = []
    for (c = 0; c < tileColumnCount; c++) {
        for (r = 0; r < tileRowCount; r++) {
            if (tiles[c][r].alive) {
                aliveCells.push([c,r])
            }
        }
    }
}

const presets = {
    stillLife: [[1,1],[1,2],[2,1],[2,2],[1,8],[2,7],[3,7],[4,8],[2,9],[3,9],[5,2],[6,3],[7,4],[6,1],[7,1],[8,2],[8,3],[14,4],[15,4],[14,5],[15,6],[16,5],[9,8],[8,9],[9,10],[10,9]],
    oscillator: [[3,2],[3,3],[3,4],[10,2],[11,2],[12,2],[9,3],[10,3],[11,3], [17,2],[18,2],[18,3],[17,3],[19,4],[20,4],[20,5],[19,5], [4, 18],[4, 19],[4, 20],[4, 24],[4, 25],[4, 26],[6, 16],[6, 21],[6, 23],[6, 28],[7, 16],[7, 21],[7, 23],[7, 28],[8, 16],[8, 21],[8, 23],[8, 28], [9, 18], [9, 19],  [9, 20],  [9, 24],  [9, 25],[9, 26], [11, 18], [11, 19], [11, 20], [11, 24], [11, 25], [11, 26], [12, 16], [12, 21],[12, 23],[12, 28],[13, 16],[13, 21],[13, 23],[13, 28],[14, 16],[14, 21], [14, 23], [14, 28], [16, 18], [16, 19], [16, 20], [16, 24], [16, 25], [16, 26], [37, 14],[37, 19],[38, 12],[38, 13],[38, 15],[38, 16],[38, 17],[38, 18],[38, 20],[38, 21],[39, 14],[39, 19]],
    light: [[3, 4],[3, 5],[4, 3],[4, 4],[4, 5],[5, 3],[5, 4],[5, 6],[6, 4],[6, 5],[6, 6],[7, 5],[10, 18],[10, 19],[11, 17],[11, 18],[11, 19],[12, 17],[12, 18],[12, 20],[13, 18],[13, 19],[13, 20],[14, 6],[14, 7],[14, 19],[15, 5],[15, 6],[15, 7],[16, 5],[16, 6],[16, 8],[17, 6],[17, 7],[17, 8],[18, 7],[27, 7],[27, 8],[28, 6],[28, 7],[28, 8],[29, 6],[29, 7],[29, 9],[30, 7],[30, 8],[30, 9],[31, 8]],
    medium: [[4, 6],[4, 7],[5, 5],[5, 6],[5, 7],[6, 5],[6, 6],[6, 7],[7, 5],[7, 6],[7, 8],[8, 6],[8, 7],[8, 8],[9, 7],[10, 18],[10, 19],[11, 17],[11, 18],[11, 19],[12, 17],[12, 18],[12, 19],[13, 17],[13, 18],[13, 20],[14, 18],[14, 19],[14, 20],[15, 19],[24, 10],[24, 11],[25, 9],[25, 10],[25, 11],[26, 9],[26, 10],[26, 11],[27, 9],[27, 10],[27, 12],[28, 10],[28, 11],[28, 12],[29, 11]],
    heavy: [[6, 20],[6, 21],[7, 7],[7, 8],[7, 20],[7, 21],[7, 22],[8, 7],[8, 8],[8, 9],[8, 20],[8, 21],[8, 22],[9, 7],[9, 8],[9, 9],[9, 20],[9, 21],[9, 22],[10, 7],[10, 8],[10, 9],[10, 19],[10, 21],[10, 22],[11, 6],[11, 8],[11, 9],[11, 19],[11, 20],[11, 21],[12, 6],[12, 7],[12, 8],[12, 20],[13, 7]],
    guns: [[3, 7],[3, 8],[4, 7],[4, 8],[13, 7],[13, 8],[13, 9],[14, 6],[14, 10],[15, 5],[15, 11],[16, 5],[16, 11],[17, 8],[18, 6],[18, 10],[19, 7],[19, 8],[19, 9],[20, 8],[23, 5],[23, 6],[23, 7],[24, 5],[24, 6],[24, 7],[25, 4],[25, 8],[27, 3],[27, 4],[27, 8],[27, 9],[37, 5],[37, 6],[38, 5],[38, 6]],
}

document.getElementById('dropdown').onchange = function() {
    let dropdown = document.getElementById('dropdown').value
    freshGrid()
    if (dropdown !== 'reset') {
        resetDefaults()
        populateCells(presets[dropdown])
        ticks.innerHTML = 0
        running = false
    }

}

init()
canvas.onmousedown = myDown
canvas.onmouseup = myUp
