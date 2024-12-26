import fo from './fileOperations.js'

const dirType = {UP:[-1,0],RIGHT:[0,1],DOWN:[1,0],LEFT:[0,-1]}

const data = await fo.readFile('test.txt');

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

function mix(val1, val2) {
    return val1 ^ val2
}

function prune(val) {
    return val % 16777216
}

function getNextSecret(secret) {
    const val1 = (secret ^ (secret << 6)) & 0xffffff
    const val2 = (val1 ^ (val1 >> 5)) & 0xffffff
    return (val2 ^ (val2 << 11)) & 0xffffff
}

let total = 0
for(const line of data) {
    let result = Number(line)
    for(let i=0;i<2000;i++) {
        result = getNextSecret(result)
    }
    total += result
}

console.log(`total: ${total}`)

function hashArray(arr) {
    return arr.map(b=>String(b)).join(',')
}

let totalSequenceCounts = new Map()
for(const line of data) {
    let secret = Number(line)
    let sequenceCounts = new Map()
    let prev_price = secret % 10
    let window = []
    for(let i=0;i<2000;i++) {
        secret = getNextSecret(secret)
        const price = secret % 10

        if (window.length>=4) {
            window.splice(0,1)
        }

        window.push(price-prev_price)
        prev_price = price

        if (window.length==4){
            const key = hashArray(window)
            if (!sequenceCounts.has(key)) {
                sequenceCounts.set(key, price)

                if (!totalSequenceCounts.has(key)) {
                    totalSequenceCounts.set(key,0)
                }
                totalSequenceCounts.set(key, totalSequenceCounts.get(key)+price)
            }
        }
    }
}

const max = [...totalSequenceCounts.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)[1]
console.log(`max: ${max}`)
