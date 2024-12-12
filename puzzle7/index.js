import fo from './fileOperations.js'

const values = []
const operands = []
let data = await fo.readFile('test.txt');
for (let line of data) {
    let numbers = line.split(":")
    values.push(Number(numbers[0].trim()))
    let lineOperands = numbers[1].trim().split(' ')
    operands.push(lineOperands.map(o=>Number(o.trim())))
}

function isValueValid(expectedResult, numbers, sum, currentIndex) {
    if (currentIndex>=numbers.length) {
        if (sum==expectedResult) return true;
        return false;
    }
    
    if (isValueValid(expectedResult, numbers, sum+numbers[currentIndex], currentIndex+1)) {
        return true;
    }
    return isValueValid(expectedResult, numbers, sum*numbers[currentIndex], currentIndex+1)
}

function isValueValid2(expectedResult, numbers, sum, currentIndex) {
    if (currentIndex>=numbers.length) {
        if (sum==expectedResult) return true
        return false
    }
    
    if (isValueValid2(expectedResult, numbers, sum+numbers[currentIndex], currentIndex+1)) {
        return true
    }
    if (isValueValid2(expectedResult, numbers, sum*numbers[currentIndex], currentIndex+1)) {
        return true
    }
    const joinednumber = Number(String(sum) + String(numbers[currentIndex]))
    return isValueValid2(expectedResult, numbers, joinednumber, currentIndex+1)
}

const total = values.filter((v,i)=>isValueValid(v,operands[i], operands[i][0], 1)).reduce((sum, value)=>sum+value)
console.log(`total: ${total}`)
const total2 = values.filter((v,i)=>isValueValid2(v,operands[i], operands[i][0], 1)).reduce((sum, value)=>sum+value)
console.log(`total2: ${total2}`)


