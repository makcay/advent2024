import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]
const sideType = {VERTICAL:0,HORIZANTAL:1}

const regions = new Map()
const matrix = []
const data = await fo.readFile('test.txt');
for (let line of data) {
    let numbers = [...line]
    matrix.push(numbers)
}

const M = matrix.length, N=matrix[0].length

function findRegions() {
    const visited = new Set()
    for (let row=0;row<M;row++) {
        for (let col=0; col<N;col++) {
            const blocks = new Set()
            visit(row, col, visited, blocks)
            if (blocks.size>0) {
                const char = matrix[row][col]
                if (!regions.has(char)) {
                    regions.set(char, [])
                }
                regions.get(char).push(blocks)
            }
        }
    }
}

function visit(row,col,visited,blocks){
    const key = String(row)+","+String(col);
    if (visited.has(key)) {
        return
    }
    visited.add(key)
    blocks.add([row,col])
    for(const dir of dirs) {
        const [newRow, newCol] = [row+dir[0], col+dir[1]]
        if (isInBounds(newRow, newCol) && matrix[newRow][newCol]==matrix[row][col]) {
            visit(newRow, newCol, visited, blocks)
        }
    }
}

function isInBounds(row,col) {
    return row>=0 && row<M && col>=0 && col<N
}

function getPerimeter(ch, blocks, fences) {
    for (const [row,col] of blocks) {
        for(let dirIndex=0;dirIndex<dirs.length;dirIndex++) {
            const dir = dirs[dirIndex]
            const [newRow, newCol] = [row+dir[0], col+dir[1]]
            if (!isInBounds(newRow, newCol) || matrix[newRow][newCol]!=ch) {
                const key = String(row)+","+String(col)+","+String(dirIndex)
                fences.add(key)
            }
        }
    }
    return fences.size
}

function isInSet(row,col,dirIndex,set) {
    return Array.from(set.values()).filter(fence=>{
        const [r, c, d] = fence.split(',').map(c=>Number(c))
        return r==row && c==col && dirIndex==d
    }).length > 0
}

function deleteFromSet(row, col, dirIndex, set) {
    Array.from(set.values()).filter(fence=>{
        const [r, c, d] = fence.split(',').map(c=>Number(c))
        return r==row && c==col && dirIndex==d
    }).forEach(v=>set.delete(v))
}

function getSides(ch, blocks) {
    let sides = 0
    const fences = new Set()
    getPerimeter(ch, blocks, fences)
    //const extraSides = getDiagonalsExtraSides(ch,blocks, fences)
    while(fences.size>0) {
        for(const fence of fences) {
            const [row, col, dirIndex] = fence.split(',').map(c=>Number(c))
            sides++
            deleteFromSet(row,col,dirIndex, fences)
            if (dirIndex==0 || dirIndex==2) {
                // upper or lower fence
                for(let i=col+1;i<N;i++) {
                    if (isInSet(row,i,dirIndex, fences)) {
                        deleteFromSet(row,i, dirIndex, fences)
                    } else {
                        break;
                    }
                }
                for(let i=col-1;i>=0;i--) {
                    if (isInSet(row,i, dirIndex, fences)) {
                        deleteFromSet(row,i, dirIndex, fences)
                    } else {
                        break;
                    }
                }
            } else if (dirIndex==1 || dirIndex==3) {
                // left or lright fence
                for(let i=row+1;i<M;i++) {
                    if (isInSet(i,col,dirIndex, fences)) {
                        deleteFromSet(i, col, dirIndex, fences)
                    } else {
                        break;
                    }
                }
                for(let i=row-1;i>=0;i--) {
                    if (isInSet(i, col, dirIndex, fences)) {
                        deleteFromSet(i, col, dirIndex, fences)
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return sides
}


findRegions()
const price = [...regions.entries()]
.map(([key, value])=>value.map(blocks=>getPerimeter(key, blocks, new Set())*blocks.size).reduce((total, sum) => total + sum))
.reduce((total, sum) => total + sum)
console.log(`price=${price}`)

const price2 = [...regions.entries()]
.map(([key, value])=>value.map(blocks=>getSides(key, blocks)*blocks.size).reduce((total, sum) => total + sum))
.reduce((total, sum) => total + sum)
console.log(`price2=${price2}`)
