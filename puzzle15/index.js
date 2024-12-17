import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}

const regions = new Map()
const matrix = []
const moves = []
const data = await fo.readFile('test.txt');
let startPos
for (let line of data) {
    if (line.length==0) continue;
    const chars = [...line]
    if (chars[0]=='#') {
        chars.forEach((c,i)=>{
            if (c=='@') {
                startPos = [matrix.length, i]
            }
        })
        matrix.push(chars)
    } else {
        chars.forEach(c=>moves.push(c))
    }
}

let curPos = [...startPos]
matrix[curPos[0]][curPos[1]] = '.'
let M = matrix.length, N=matrix[0].length

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)
const originalMatrix = clone(matrix)

function isInBounds(pos) {
    return pos[0]>=0 && pos[0]<M && pos[1]>=0 && pos[1]<N
}

function canMove(pos) {
    return isInBounds(pos) && matrix[pos[0]][pos[1]] != '#'
}

function move(symbol) {
    let dir
    if (symbol=='^') {
        dir=dirType.UP
    } else if (symbol=='v') {
        dir=dirType.DOWN
    } else if (symbol=='<') {
        dir = dirType.LEFT
    } else if (symbol=='>') {
        dir = dirType.RIGHT
    }
    if (!dir) return
    let candidateP = [curPos[0]+dir[0], curPos[1]+dir[1]]
    let accepted = true
    if (matrix[candidateP[0]][candidateP[1]]=='#'){
        accepted = false
    } else if (matrix[candidateP[0]][candidateP[1]]=='O'){
        // try push
        let tmpP = [candidateP[0]+dir[0], candidateP[1]+dir[1]]
        accepted = false
        while(!accepted && canMove(tmpP)) {
            if (matrix[tmpP[0]][tmpP[1]]=='.') {
                matrix[tmpP[0]][tmpP[1]] = 'O'
                matrix[candidateP[0]][candidateP[1]]='.'
                accepted = true
            }
            tmpP[0] += dir[0]
            tmpP[1] += dir[1]
        }
    }

    if (accepted) {
        curPos = candidateP
    }
}

function printMatrix(m) {
    for(const line of m) {
        console.log(line.join(""))
    }
}

function gps() {
    let total = 0
    for(let i=0;i<M;i++) {
        for(let j=0;j<N;j++) {
            if (matrix[i][j]=='O') {
                total += 100*i + j
            }
        }
    }
    return total
}

for(const m of moves) {
    move(m)
}
//printMatrix(matrix)
console.log(`gps: ${gps()}`)

curPos = [startPos[0], startPos[1]*2]
const matrix2 = []
for (let i=0;i<M;i++) {
    matrix2[i] = []
    for (let j=0; j<N;j++) {
        const ch = originalMatrix[i][j]    
        if (ch=='#') {
            matrix2[i].push('#')
            matrix2[i].push('#')
        } else if (ch=='O') {
            matrix2[i].push('[')
            matrix2[i].push(']')
        } else if (ch=='.') {
            matrix2[i].push('.')
            matrix2[i].push('.')
        } 
    }
}
M = matrix2.length
N = matrix2[0].length
//printMatrix(matrix2)

function move2(symbol) {
    let dir
    if (symbol=='^') {
        dir=dirType.UP
    } else if (symbol=='v') {
        dir=dirType.DOWN
    } else if (symbol=='<') {
        dir = dirType.LEFT
    } else if (symbol=='>') {
        dir = dirType.RIGHT
    }
    if (!dir) return
    let candidateP = [curPos[0]+dir[0], curPos[1]+dir[1]]
    let accepted = true
    if (matrix2[candidateP[0]][candidateP[1]]=='#'){
        accepted = false
    } else if (matrix2[candidateP[0]][candidateP[1]]=='[' || matrix2[candidateP[0]][candidateP[1]]==']'){
        accepted = pushBox(candidateP, dir, true, new Set())
        if (accepted) {
            pushBox(candidateP, dir, false, new Set())
        }
    }

    if (accepted) {
        curPos = candidateP
    }
}

function pushBox(pos, dir, isValidate, visited) {
    if (matrix2[pos[0]][pos[1]]=='#') {
        return false
    } else if (matrix2[pos[0]][pos[1]]=='.') {
        return true
    }
    visited.add(String(pos[0])+","+String(pos[1]))

    const nextPos = [pos[0]+dir[0], pos[1]+dir[1]]
    let result = pushBox(nextPos, dir, isValidate, visited)

    if (dir==dirType.DOWN || dir==dirType.UP) {
        if (matrix2[pos[0]][pos[1]]=='[' && !visited.has(String(pos[0])+","+String(pos[1]+1))) {
            if (result) {
                result = pushBox([pos[0], pos[1]+1], dir, isValidate, visited)
            }
        } else if (matrix2[pos[0]][pos[1]]==']' && !visited.has(String(pos[0])+","+String(pos[1]-1))) {
            if (result) {
                result = pushBox([pos[0], pos[1]-1], dir, isValidate, visited)
            }
        } 
    }

    if (result && !isValidate) {
        matrix2[nextPos[0]][nextPos[1]] = matrix2[pos[0]][pos[1]]
        matrix2[pos[0]][pos[1]] = '.'
    }
    return result
}

for(const m of moves) {
    move2(m)
}

function gps2() {
    let total = 0
    for(let i=0;i<M;i++) {
        for(let j=0;j<N;j++) {
            if (matrix2[i][j]=='[') {
                total += 100*i + j
            }
        }
    }
    return total
}

console.log(`gps2: ${gps2()}`)