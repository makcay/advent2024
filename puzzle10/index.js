import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]

const matrix = [], heads=[], ends=[]
let data = await fo.readFile('test.txt');
for (let line of data) {
    let numbers = [...line].map(c=>Number(c))
    numbers.forEach((n,i)=>{
        if (n==0) {
            heads.push([matrix.length, i])
        } else if (n==9) {
            ends.push(matrix.length, i)
        }
    })
    matrix.push(numbers)
}

const M = matrix.length, N=matrix[0].length

function isPointInBoundary(row,col) {
    return row>=0 && row<M && col>=0 && col<N
}

function getNextPoints(row,col) {
    const curVal = matrix[row][col]
    const results = []
    for(const dir of dirs) {
        const [newRow, newCol] = [row+dir[0], col+dir[1]]
        if (isPointInBoundary(newRow,newCol) && matrix[newRow][newCol]==curVal+1){
            results.push([newRow, newCol])
        }
    }
    return results
}

function visit(row,col, visitedTails) {
    if (matrix[row][col]==9) {
        visitedTails.add(String(row)+","+String(col))
        return
    }
    for(const next of getNextPoints(row,col)) {
        visit(next[0], next[1], visitedTails)
    }
}

function visit2(row,col, visitedPath, visitedPaths) {
    visitedPath += String(row) + "," + String(col) + "-"
    if (matrix[row][col]==9) {
        visitedPaths.add(visitedPath)
        return
    }
    for(const next of getNextPoints(row,col)) {
        visit2(next[0], next[1], visitedPath, visitedPaths)
    }
}

let totalScore = 0
for(const head of heads) {
    const visitedTails = new Set()
    visit(head[0], head[1], visitedTails)
    totalScore += visitedTails.size
}
console.log(`score: ${totalScore}`)

let totalScore2 = 0
for(const head of heads) {
    const visitedPaths = new Set()
    visit2(head[0], head[1], "", visitedPaths)
    totalScore2 += visitedPaths.size
}
console.log(`score2: ${totalScore2}`)



