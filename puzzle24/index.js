import fo from './fileOperations.js'

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

const operators = {AND: 0, OR: 1, XOR:2}

const data = await fo.readFile('test.txt');
const values = new Map()
const operations = []
for(const line of data) {
    if (line.includes(':')) {
        let matchesVal = line.matchAll(/(.+):[\s]+(\d+)/g).next().value;
        let variable = matchesVal[1]
        let value = Number(matchesVal[2])
        values.set(variable, value)
    } else if (line.includes('->')) {
        let matchesVal = line.matchAll(/(.+)[\s]+(.+)[\s]+(.+)[\s]+->[\s]+(.+)/g).next().value;
        let variable1 = matchesVal[1]
        let operator = getOperator(matchesVal[2])
        let variable2 = matchesVal[3]
        let result = matchesVal[4]
        operations.push([variable1, operator, variable2, result])
    }
}

function getOperator(operator) {
    if (operator=='AND') {
        return operators.AND
    } else if (operator=='OR') {
        return operators.OR
    } else if (operator=='XOR') {
        return operators.XOR
    }
}

function evaluate(variable1, variable2, operator) {
    if (operator==operators.AND) {
        return variable1 & variable2
    } else if (operator==operators.OR) {
        return variable1 | variable2
    } else if (operator==operators.XOR) {
        return variable1 ^ variable2
    }  
}

function binaryArrayToDecimal(arr) {
    let result = 0
    for(let i=arr.length-1;i>=0;i--) {
        result += arr[i] * Math.pow(2,i)
    }
    return result
}

function evaluateSystem(vals, ops) {
    const zBits = []
    while(ops.length>0) {
        const [variable1, operator, variable2, result] = ops.splice(0,1)[0]
        if (vals.has(variable1) && vals.has(variable2)) {
            const evaluated = evaluate(vals.get(variable1), vals.get(variable2), operator)
            vals.set(result, evaluated)
            if (result[0]=='z') {
                zBits[Number(result.substring(1))] = evaluated
            }
        } else {
            ops.push([variable1, operator, variable2, result])
        }
    }

    const xBits = [], yBits = []
    for(const val of vals.keys()) {
        if (val[0]=='x' && !isNaN(val.substring(1))) {
            xBits[Number(val.substring(1))] = vals.get(val)
        } else if (val[0]=='y' && !isNaN(val.substring(1))){
            yBits[Number(val.substring(1))] = vals.get(val)
        }
    }

    return zBits
}

const zBits = evaluateSystem(new Map(values), [...operations])
console.log(binaryArrayToDecimal(zBits))

const x_y_xor = []
const x_y_and = []
const sum_carry_xor = []
const sum_carry_and = []
const sum_carry_or = []
for(const [variable1, operator, variable2, result] of operations) {
    if (operator==operators.XOR && (variable1[0]=='x' || variable1[0]=='y')) {
        x_y_xor.push([variable1, operator, variable2, result])
    } else if (operator==operators.AND && (variable1[0]=='x' || variable1[0]=='y')) {
        x_y_and.push([variable1, operator, variable2, result])
    } else if (operator==operators.XOR && variable1[0]!='x' && variable1[0]!='y') {
        sum_carry_xor.push([variable1, operator, variable2, result])
    } else if (operator==operators.AND && variable1[0]!='x' && variable1[0]!='y') {
        sum_carry_and.push([variable1, operator, variable2, result])
    } else if (operator==operators.OR && variable1[0]!='x' && variable1[0]!='y') {
        sum_carry_or.push([variable1, operator, variable2, result])
    } 
}

const operationsToSwap = []
for(const [variable1, operator, variable2, result] of x_y_xor) {
    if (variable1.substring(1)=='00') {
        if (result!='z00') {
            operationsToSwap.push(result)
            operationsToSwap.push("z00")
        }
    } else {
        if (sum_carry_xor.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0
            ||  sum_carry_and.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0) {
            operationsToSwap.push(result)
        }
    }
}

for(const [variable1, operator, variable2, result] of x_y_and) {
    if (variable1.substring(1)=='00') {
        if (sum_carry_xor.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0
            ||  sum_carry_and.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0) {
            operationsToSwap.push(result)
        }
    } else {
        if (sum_carry_or.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0) {
            operationsToSwap.push(result)
        }
    }
}

for(const [variable1, operator, variable2, result] of sum_carry_xor) {
    if (result[0]!='z') {
        operationsToSwap.push(result)
    }
}

for(const [variable1, operator, variable2, result] of sum_carry_and) {
    if (sum_carry_or.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0) {
        operationsToSwap.push(result)
    }
}

let end = String(zBits.length-1)
if (end.length==1) {
    end = "0" + end
}
const lastZ = 'z' + end
for(const [variable1, operator, variable2, result] of sum_carry_or) {
    if (result!=lastZ) {
        // intermittent operation needed
        if (sum_carry_xor.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0
            || sum_carry_and.filter(([v1, o, v2, r])=>v1==result || v2==result).length==0) {
            operationsToSwap.push(result)
        }
    }
}

console.log(operationsToSwap.sort().join(','))
