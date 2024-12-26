import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}

const data = await fo.readFile('test.txt');
const codes = data

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

const numericKeypad = new Map()
numericKeypad.set('1', [2, 0])
numericKeypad.set('2', [2, 1])
numericKeypad.set('3', [2, 2])
numericKeypad.set('4', [1, 0])
numericKeypad.set('5', [1, 1])
numericKeypad.set('6', [1, 2])
numericKeypad.set('7', [0, 0])
numericKeypad.set('8', [0, 1])
numericKeypad.set('9', [0, 2])
numericKeypad.set('0', [3, 1])
numericKeypad.set('A', [3, 2])
numericKeypad.set('#', [3, 0])

const directionalKeypad = new Map()
directionalKeypad.set('^', [0,1])
directionalKeypad.set('A', [0,2])
directionalKeypad.set('<', [1,0])
directionalKeypad.set('v', [1,1])
directionalKeypad.set('>', [1,2])
directionalKeypad.set('#', [0,0])

function isPosEqual(pos1, pos2) {
    return pos1[0]==pos2[0] && pos1[1]==pos2[1]
}

function getPossibleMoves(curPos, target) {
    const result = []
    
    if (target[0] > curPos[0]) {
        result.push('v')
    } else if (target[0] < curPos[0]) {
        result.push('^')
    }

    if (target[1] > curPos[1]) {
        result.push('>')
    } else if (target[1] < curPos[1]) {
        result.push('<')
    }

    return result
}

function getDirection(char) {
    if (char=='^') {
        return dirType.UP
    } else if (char=='>') {
        return dirType.RIGHT
    } else if (char=='<') {
        return dirType.LEFT
    } else if (char=='v') {
        return dirType.DOWN
    }
}

function hashCurPosCharKeyPad(curPos, char, keyPad) {
    return String(curPos[0])+','+String(curPos[1])+'-'+char+'-'+(keyPad==numericKeypad?'0':'1')
}

function hashTextKeyPadDepth(text, keyPad, depth) {
    return text+'-'+(keyPad==numericKeypad?'0':'1')+'-'+String(depth)
}

const cache = new Map()
function getPresses(curPos, char, keypad) {
    const key = hashCurPosCharKeyPad(curPos, char, keypad)
    if (cache.has(key)) {
        return cache.get(key)
    }

    const queue = []
    queue.push([curPos, char, []])
    const gapPosition = keypad.get('#')
    let result = []
    while(queue.length>0) {
        const [pos, ch, pressedKeys] = queue.splice(0,1)[0]
        if (ch=='') {
            result.push(pressedKeys)
            continue
        }

        const targetPos = keypad.get(ch)
        const possibleMoves = getPossibleMoves(pos, targetPos)
        if(possibleMoves.length>0) {
            for(const move of possibleMoves) {
                const dir = getDirection(move)
                const newPos = [pos[0]+dir[0], pos[1]+dir[1]]
                if (isPosEqual(newPos, gapPosition)) {
                    continue
                }
                const newPressed = [...pressedKeys]
                newPressed.push(move)
                queue.push([newPos, ch, newPressed])
            }
        } else {
            const newPressed = [...pressedKeys]
            newPressed.push('A')
            queue.push([pos, '', newPressed])
        }
    }
    cache.set(key, result)
    return result
}

function getMinimumCost(presses) {
    let min = Number.POSITIVE_INFINITY
    for(const p of presses) {
        if (p.length<min) {
            min = p.length
        }
    }
    return min
}

const costCache = new Map()
function getCost(text, keyPad, depth) {
    const key = hashTextKeyPadDepth(text, keyPad, depth)
    if (costCache.has(key)) {
        return costCache.get(key)
    }
    let result = 0
    let curPos = keyPad.get('A')
    for(let i=0; i<text.length;i++) {
        const targetCh = text[i]
        const presses = getPresses(curPos, targetCh, keyPad)
        if (depth==0) {
            result += getMinimumCost(presses)
        } else {
            let newCosts = []
            for(const press of presses) {
                newCosts.push(getCost(press, directionalKeypad, depth-1))
            }
            result += Math.min(...newCosts)
        }
        curPos = keyPad.get(targetCh)
    }
    costCache.set(key, result)
    return result
}


let total = 0
for(const code of codes) {
    let minLegth = getCost(code, numericKeypad, 25)

    let matchesA = code.matchAll(/(\d+)/g).next().value;
    let numberVal = Number(matchesA[1])
    total += numberVal * minLegth
}

console.log(`total: ${total}`)
