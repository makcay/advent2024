import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]

const matrix = []
const data = await fo.readFile('test.txt');
let startPos, endPos
for (let line of data) {
    if (line.length==0) continue;
    const chars = [...line]
    chars.forEach((c,i)=>{
        if (c=='S') {
            startPos = [matrix.length, i]
        } else if (c=='E') {
            endPos = [matrix.length, i]
        }
    })
    matrix.push(chars)
}

let curPos = [...startPos]
let M = matrix.length, N=matrix[0].length

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)
const originalMatrix = clone(matrix)

function turnRight(dir) {
    if (dir==dirType.DOWN) {
        return dirType.LEFT
    } else if (dir==dirType.LEFT) {
        return dirType.UP
    } else if (dir==dirType.RIGHT) {
        return dirType.DOWN
    } else if (dir==dirType.UP) {
        return dirType.RIGHT
    }
}

function hashPosition(pos) {
    return String(pos[0])+','+String(pos[1])
}

function unhashPosition(str) {
    return str.trim().split(',').map(s=>Number(s))
}

function hashPositionDir(pos, dir) {
    return String(pos[0])+','+String(pos[1])+','+String(dir[0])+','+String(dir[1])
}

function unhashPositionDir(str) {
    const arr = str.trim().split(',').map(s=>Number(s))
    return [[arr[0], arr[1]], [arr[2],arr[3]]]
}

function turnDistance(dir1, dir2) {
    for(let i=0, tmpDir=dir1;i<4;i++,tmpDir=turnRight(tmpDir)) {
        const turnCount = Math.min(i, 4-i)
        if (tmpDir==dir2) {
            return turnCount
        }
    }
}

const distances = []
function calculateDistances() {
    distances[hashPositionDir(startPos, dirType.RIGHT)] = [0, new Set([hashPositionDir(startPos, dirType.RIGHT)])]
    const queue = []
    queue.push([startPos, dirType.RIGHT])

    while(queue.length>0) {
        const [pos, dir] = queue.splice(0,1)[0]

        const [curScore, prevPosSet] = distances[hashPositionDir(pos, dir)]
        for(let i=0,tmpDir=dir; i<4; i++, tmpDir=turnRight(tmpDir)) {
            const newPos = [pos[0]+tmpDir[0], pos[1]+tmpDir[1]]
            
            if (matrix[newPos[0]][newPos[1]]!='#') {
                const turnScore = Math.min(i, 4-i) * 1000
                const newScore = curScore+turnScore+1

                const prev = distances[hashPositionDir(newPos, tmpDir)]
                if (!prev || prev[0]>newScore) {
                    distances[hashPositionDir(newPos, tmpDir)] = [newScore, new Set([hashPositionDir(pos, dir)])] 
                    queue.push([newPos, tmpDir])
                } else if (prev[0]==newScore){
                    prev[1].add(hashPositionDir(pos, dir))
                }
                
            }
        }
    }
}


calculateDistances()
let min = Number.POSITIVE_INFINITY
for(const dir of dirs) {
    const bestPath = distances[hashPositionDir(endPos, dir)]
    if (bestPath && bestPath[0]<min) {
        min = bestPath[0]
    }
    
}
console.log(`best: ${min}`)

const seats = new Set()
const queue = []
for(const dir of dirs) {
    const bestPath = distances[hashPositionDir(endPos, dir)]
    if (bestPath && bestPath[0]==min) {
        queue.push([endPos, dir])
    }
}

while(queue.length>0) {
    const [pos, dir] = queue.splice(0,1)[0]
    seats.add(hashPosition(pos))

    if (pos[0]!=startPos[0] || pos[1]!=startPos[1]) {
        const prevPositions = distances[hashPositionDir(pos, dir)][1]
        prevPositions.forEach(p=>queue.push(unhashPositionDir(p)))
    }
}
console.log(`seats: ${seats.size}`)
