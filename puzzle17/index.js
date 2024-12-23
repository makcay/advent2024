import fo from './fileOperations.js'

const data = await fo.readFile('sample.txt');

let matchesA = data[0].matchAll(/Register A: (\d+)/g).next().value;
let A = Number(matchesA[1])
let matchesB = data[1].matchAll(/Register B: (\d+)/g).next().value;
let B = Number(matchesB[1])
let matchesC = data[2].matchAll(/Register C: (\d+)/g).next().value;
let C = Number(matchesC[1])
let matchesP = data[4].matchAll(/Program: (.+)/g).next().value;
let program = matchesP[1].trim().split(',').map(x=>Number(x))
let IP = 0
const output = []

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

function getOperand(operand){
    if (operand>=0 && operand<=3) {
        return operand
    } else if (operand==4) {
        return A
    } else if (operand==5) {
        return B
    } else if (operand==6){
        return C
    } else if (operand==7) {
        return operand
    }
}

function processInsruction(opcode, operand) {
    if (opcode==0) {
        A = Math.floor(A / Math.pow(2, getOperand(operand)))
        IP+=2
    } else if (opcode==1) {
        B = B ^ getOperand(operand)
        IP+=2
    } else if (opcode==2) {
        B = getOperand(operand) % 8
        IP+=2
    } else if (opcode==3) {
        if (A!=0) {
            IP = getOperand(operand)
        } else {
            IP+=2
        }
    } else if (opcode==4) {
        B = B ^ C
        IP+=2
    } else if (opcode==5) {
        output.push(getOperand(operand) % 8)
        IP+=2
    } else if (opcode==6) {
        B = Math.floor(A / Math.pow(2, getOperand(operand)))
        IP+=2
    } else if (opcode==7) {
        C = Math.floor(A / Math.pow(2, getOperand(operand)))
        IP+=2
    }
}

while(IP<program.length) {
    const opcode = program[IP]
    const operand = program[IP+1]
    processInsruction(opcode, operand)
}
console.log(`out=${output}`)


function reverse(p, result) {
    /*2,4, 1,2, 7,5, 1,3, 4,3, 5,5, 0,3, 3,0
b = a % 8
b = b ^ 2
c = a >> b
b = b ^ 3
b = b ^ c
out = b % 8
a = a >> 3
goto 0
*/
    if (p.length==0) {
        return result
    } 
    for (const x in [...Array(8).keys()]) {
        let a = result<<3 | Number(x)
        let b = a % 8
        b = b ^ 2
        let c = a >> b
        b = b ^ 3
        b = b ^ c
        if (b%8 == p[p.length-1]) {
            let remainingProgram = [...p]
            remainingProgram.pop()
            const res =  reverse(remainingProgram, a)
            if (!res) {
                continue
            }
            return res
        }

    }
}

console.log(reverse(program, Number(0)))
