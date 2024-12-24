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

let M = matrix.length, N=matrix[0].length

function printMatrix(m) {
    for(const line of m) {
        console.log(line.join(""))
    }
}

//printMatrix(matrix)

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

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

function isInBounds(pos) {
    return pos[0]>=0 && pos[0]<M && pos[1]>=0 && pos[1]<N
}

function isPosEqual(pos1, pos2) {
    return pos1[0]==pos2[0] && pos1[1]==pos2[1]
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
            
            if (isInBounds(newPos) && ( matrix[newPos[0]][newPos[1]]!='#')) {
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
    let minPath = [Number.POSITIVE_INFINITY, new Set()]
    calculateDistances()
    for(const dir of dirs) {
        const bestPath = distances[hashPositionDir(endPos, dir)]
        if (bestPath && bestPath[0]<minPath[0]) {
            minPath = bestPath
        }    
    }
    return minPath
}

const min = getMinPath()
let prev = min[1]
const minPath = [hashPosition(endPos)]
while(true) {
    const [curPos, curDir] = unhashPositionDir(prev.keys().next().value)
    minPath.unshift(hashPosition(curPos))
    if (isPosEqual(curPos, startPos)) {
        break
    }
    prev=distances[hashPositionDir(curPos, curDir)][1]
}
//console.log(`best: ${minPath.length-1} path: ${minPath}`)




function distance(p1,p2) {
    return Math.abs(p1[0]-p2[0]) + Math.abs(p1[1]-p2[1])
}

let count = 0
const threshold = 100
//const maxCheatCount = 2
const maxCheatCount = 20
for(let i=0;i<minPath.length; i++) {
    for(let j=i+threshold; j<minPath.length;j++) {
        const start = unhashPosition(minPath[i])
        const end = unhashPosition(minPath[j])
        const d = distance(start, end)
        if (d<=maxCheatCount && d<=j-i-threshold) {
            count++
        }
    }
}
console.log(count)
