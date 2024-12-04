import fo from './fileOperations.js'

let matrix = await fo.readFile('test.txt');

let count = 0;
let masCount = 0;
for(let i=0;i<matrix.length;i++) {
    for(let j=0;j<matrix[0].length;j++) {
        if (matrix[i][j]=='X') {
            count += getHorizontalCount(i,j)
            count += getVerticalCount(i,j)
            count += getDiagonalCount(i,j)
        }
    }
}

for(let i=0;i<matrix.length;i++) {
    for(let j=0;j<matrix[0].length;j++) {
        if (matrix[i][j]=='A') {
            if (isDiagonalMAS(i,j)) masCount++
        }
    }
}

function getHorizontalCount(i,j) {
    let cnt = 0;
    if (j+3<matrix[0].length) {
        if (matrix[i][j+1]=='M' && matrix[i][j+2]=='A' && matrix[i][j+3]=='S') cnt++;
    }
    if (j>2) {
        if (matrix[i][j-1]=='M' && matrix[i][j-2]=='A' && matrix[i][j-3]=='S') cnt++;
    }
    return cnt;
}

function getVerticalCount(i,j) {
    let cnt = 0;
    if (i+3<matrix.length) {
        if (matrix[i+1][j]=='M' && matrix[i+2][j]=='A' && matrix[i+3][j]=='S') cnt++;
    }
    if (i>2) {
        if (matrix[i-1][j]=='M' && matrix[i-2][j]=='A' && matrix[i-3][j]=='S') cnt++;
    }
    return cnt;
}



function getDiagonalCount(i,j) {
    let cnt = 0;
    if (i>2 && j>2) {
        if (matrix[i-1][j-1]=='M' && matrix[i-2][j-2]=='A' && matrix[i-3][j-3]=='S') cnt++
    }
    if (i>2 && j+3<matrix[0].length) {
        if (matrix[i-1][j+1]=='M' && matrix[i-2][j+2]=='A' && matrix[i-3][j+3]=='S') cnt++
    }
    if (i+3<matrix.length && j>2) {
        if (matrix[i+1][j-1]=='M' && matrix[i+2][j-2]=='A' && matrix[i+3][j-3]=='S') cnt++
    }
    if (i+3<matrix.length && j+3<matrix[0].length) {
        if (matrix[i+1][j+1]=='M' && matrix[i+2][j+2]=='A' && matrix[i+3][j+3]=='S') cnt++
    }
    return cnt;
}

function isDiagonalMAS(i,j) {
    if (i>0 && i+1<matrix.length && j>0 && j+1<matrix[0].length) {
        let first = ((matrix[i-1][j-1]=='M' && matrix[i+1][j+1]=='S') 
                        || (matrix[i-1][j-1]=='S' && matrix[i+1][j+1]=='M'))
        let second = ((matrix[i-1][j+1]=='M' && matrix[i+1][j-1]=='S') 
                        || (matrix[i-1][j+1]=='S' && matrix[i+1][j-1]=='M'))
        return first && second;
    }
    return false;
}

console.log(count)
console.log(masCount)



