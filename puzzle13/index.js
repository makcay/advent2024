import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]

const data = await fo.readFile('test.txt');
const claws = []
for(let i=0;i<data.length;i+=4) {
    let matchesA = data[i].matchAll(/Button A: X\+(\d+), Y\+(\d+)/g).next().value;
    const A = [matchesA[1], matchesA[2]].map(x=>Number(x))
    let matchesB = data[i+1].matchAll(/Button B: X\+(\d+), Y\+(\d+)/g).next().value;
    const B = [matchesB[1], matchesB[2]].map(x=>Number(x))
    let matchesPrize = data[i+2].matchAll(/Prize: X=(\d+), Y=(\d+)/g).next().value;
    const prize = [matchesPrize[1], matchesPrize[2]].map(x=>Number(x))
    claws.push([A, B, prize])
}


function play(Aarr,Barr,prizeArr, pressLimit) {
    let minPoints = Number.POSITIVE_INFINITY
    const visited = new Set()
    const queue = []
    queue.push([0,0,0, [0,0]])
    let Acount = 0 , Bcount = 0;
    while(queue.length>0) {
        const [curX, curY, curP, [Acount, BCount]] = queue.splice(0,1)[0]
        const key = String(curX)+","+String(curY)
        if (visited.has(key)) {
            continue
        }
        visited.add(key)

        if (curX==prizeArr[0] && curY==prizeArr[1]) {
            if (curP<minPoints) {
                minPoints = curP
            }
        } else if (Acount>=pressLimit || BCount>=pressLimit){
            continue
        } else {
            if (curP+3<minPoints) {
                queue.push([curX+Aarr[0], curY+Aarr[1], curP+3, [Acount+1, BCount]])
            }
            if (curP+1<minPoints) {                
                queue.push([curX+Barr[0], curY+Barr[1], curP+1, [Acount, BCount+1]])
            }
        }
    }
    return minPoints==Number.POSITIVE_INFINITY ? 0 : minPoints
}

let total = 0
for(const [A, B, prize] of claws) {
    total += play(A, B, prize, 100)
}
console.log(`total: ${total}`)


function play2(Aarr,Barr,prizeArr) {
    // a_c * Aarr[0] + b_c * Barr[0] = prizeArr[0]
    // a_c * Aarr[1] + b_c * Barr[1] = prizeArr[1]
    
    const determinant = Aarr[0]*Barr[1] - Aarr[1]*Barr[0]
    const a_c = Math.round((prizeArr[0]*Barr[1]-prizeArr[1]*Barr[0])/determinant)
    const b_c = Math.round((prizeArr[1]*Aarr[0]-prizeArr[0]*Aarr[1])/determinant)
    if (a_c * Aarr[0] + b_c * Barr[0] == prizeArr[0] && a_c * Aarr[1] + b_c * Barr[1] == prizeArr[1]) {
        return 3*a_c+b_c
    }
    return 0
}

let total2 = 0
for(const [A, B, prize] of claws) {
    total2 += play2(A, B, [prize[0]+10000000000000,prize[1]+10000000000000])
}
console.log(`total: ${total2}`)



