import fo from './fileOperations.js'

const stones = []
let data = await fo.readFile('test.txt');
for (let line of data) {
    const numbers = line.split(/[\s]/g)
    numbers.forEach(n=>stones.push(Number(n)))
}


function blink(numbers) {
    const result = []
    for(let i=0; i<numbers.length; i++) {
        let number = numbers[i]
        let numberStr = String(number)
        if (number==0) {
            result.push(1)
        } else if (numberStr.length%2==0) {
            result.push(Number(numberStr.substring(0, numberStr.length/2)))
            result.push(Number(numberStr.substring(numberStr.length/2)))
        } else {
            result.push(number*2024)
        }
    }
    return result
}

let tmp = [...stones]
for(let i =0;i<25;i++) {
    tmp = blink(tmp)
}
console.log(`number of stones: ${tmp.length}`)

function blinkANumber(number, count, cache) {
    const key = String(number)+'-'+String(count)
    if (cache.has(key)) {
        return cache.get(key)
    }
    if (count==0) return 1
    for(let i=0;i<count;i++) {
        let numberStr = String(number)
        if (number==0) {
            number = 1;
        } else if (numberStr.length%2==0) {
            const left = Number(numberStr.substring(0, numberStr.length/2))
            const right = Number(numberStr.substring(numberStr.length/2))
            const total = blinkANumber(left, count-i-1, cache) + blinkANumber(right, count-i-1, cache)
            cache.set(key, total)
            return total
        } else {
            number = number*2024
        }
    }
    return 1
}

tmp = [...stones]
let total = 0
const cache = new Map()
for(const num of tmp) {
    total += blinkANumber(num, 75, cache)
}
console.log(`number of stones2: ${total}`)
