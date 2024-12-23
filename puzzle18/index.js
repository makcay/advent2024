import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]

const matrix = []
//let M = 7, N=7
//let fallCount = 12
let M = 71, N=71
let fallCount = 1024
for(let i=0;i<M;i++) {
    matrix.push([])
    for (let j=0; j<N;j++) {
        matrix[i][j] = '.'
    }
}

const bytes = []
const data = await fo.readFile('test.txt');
for (let line of data) {
    const byte = line.trim().split(',').map(n=>Number(n));
    if (fallCount==0) {
        bytes.push([byte[1], byte[0]])
    } else {
        matrix[byte[1]][byte[0]] = '#'
        fallCount--
    }
}

function printMatrix(m) {
    for(const line of m) {
        console.log(line.join(""))
    }
}

//printMatrix(matrix)


let startPos = [0,0], endPos = [N-1, M-1]

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

function isInBounds(pos) {
    return pos[0]>=0 && pos[0]<M && pos[1]>=0 && pos[1]<N
}


function calculateDistances() {
    distances[hashPositionDir(startPos, dirType.RIGHT)] = [0, new Set([hashPositionDir(startPos, dirType.RIGHT)])]
    const queue = []
    queue.push([startPos, dirType.RIGHT])

    while(queue.length>0) {
        const [pos, dir] = queue.splice(0,1)[0]

        const [curScore, prevPosSet] = distances[hashPositionDir(pos, dir)]
        for(const newDir of dirs) {
            const newPos = [pos[0]+newDir[0], pos[1]+newDir[1]]
            
            if (isInBounds(newPos) && matrix[newPos[0]][newPos[1]]!='#') {
                const newScore = curScore+1

                const prev = distances[hashPositionDir(newPos, newDir)]
                if (!prev || prev[0]>newScore) {
                    distances[hashPositionDir(newPos, newDir)] = [newScore, new Set([hashPositionDir(pos, dir)])] 
                    queue.push([newPos, newDir])
                } else if (prev[0]==newScore){
                    prev[1].add(hashPositionDir(pos, dir))
                }
                
            }
        }
    }
}

let distances = []

function getMinPath() {
    distances = []
    calculateDistances()
    let min = Number.POSITIVE_INFINITY
    for(const dir of dirs) {
        const bestPath = distances[hashPositionDir(endPos, dir)]
        if (bestPath && bestPath[0]<min) {
            min = bestPath[0]
        }    
    }
    return min
}

let min = getMinPath()
console.log(`best: ${min}`)

for(const byte of bytes) {
    matrix[byte[0]][byte[1]] = '#'
    min = getMinPath()
    if (min==Number.POSITIVE_INFINITY) {
        console.log(`byte: ${byte[1]},${byte[0]}`)
        break
    }
}


