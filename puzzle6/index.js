import fo from './fileOperations.js'

const dir = {UP:0,RIGHT:1,DOWN:2,LEFT:3}

const matrix = []
let currentDir = dir.UP;
let currentX=0, currentY=0
let data = await fo.readFile('test.txt');
for (let line of data) {
    let arrow = line.indexOf('^');
    if (arrow!=-1) {
        line = line.replace('^','X')
        currentY = matrix.length
        currentX = arrow
    }
    matrix.push([...line])
}

function turn() {
    currentDir = nextTurn();
}

function nextTurn() {
    if (currentDir==dir.UP) {
        return dir.RIGHT
    } else if (currentDir==dir.RIGHT) {
        return dir.DOWN
    } else if (currentDir==dir.DOWN) {
        return dir.LEFT
    } else if (currentDir==dir.LEFT) {
        return dir.UP
    }
    return currentDir;
}

function getNextPoint() {
    let x=currentX,y=currentY
    if (currentDir==dir.UP) {
        y--
    } else if (currentDir==dir.RIGHT) {
        x++
    } else if (currentDir==dir.DOWN) {
        y++
    } else if (currentDir==dir.LEFT) {
        x--
    }
    return [x,y]
}

let startX = currentX, startY = currentY;
const N = matrix.length
const M = matrix[0].length
let [nextX, nextY] = getNextPoint()
const visitedLocations = new Set()
visitedLocations.add(`${currentX}-${currentY}`)
while(nextX>=0 && nextX<M && nextY>=0 && nextY<N) {
    if (matrix[nextY][nextX] == '#') {
        turn();
    } else {
        currentX=nextX
        currentY=nextY
        visitedLocations.add(`${currentX}-${currentY}`)
    }
    [nextX, nextY] = getNextPoint()
}

console.log(`currentX:${currentX} currentY:${currentY} nextX:${nextX} nextY:${nextY}`)
console.log(`visited: ${visitedLocations.size}`)

function isLoop(x,y) {
    currentDir = dir.UP
    currentX = startX
    currentY = startY
    let [nextX, nextY] = getNextPoint()
    const states = new Set()
    while(nextX>=0 && nextX<M && nextY>=0 && nextY<N) {
        if (matrix[nextY][nextX] == '#' || (nextX==x && nextY==y)) {
            turn()
        } else {
            currentX=nextX
            currentY=nextY
            if (states.has(`${currentX}-${currentY}-${currentDir}`)) {
                return true
            }
            states.add(`${currentX}-${currentY}-${currentDir}`)
        }
        [nextX, nextY] = getNextPoint()
    }
    return false
}

let loops = 0;
for(const location of visitedLocations.keys()) {
    let matches = location.matchAll(/(\d+)\-(\d+)/g).next().value;
    let visitedX = Number(matches[1])
    let visitedY = Number(matches[2])
    if (isLoop(visitedX, visitedY)) {
        loops++
    }
}
console.log(`loops: ${loops}`)
