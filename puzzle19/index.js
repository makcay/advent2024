import fo from './fileOperations.js'


const data = await fo.readFile('test.txt');
const patterns = data[0].trim().split(/[\s]*,[\s]*/g)
const desired = []
for (let i=2; i<data.length ;i++) {
    desired.push(data[i].trim())
}

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)



const cache = new Map()
function isPossible(design) {
    if (design.length==0) return true

    if (cache.has(design)) {
        return cache.get(design)
    }

    let result = false
    for(const p of patterns) {
        if (design.startsWith(p) && isPossible(design.substring(p.length))) {
            result = true
            break
        }
    }
    cache.set(design, result)
    return result
}

const countCache = new Map()
function getCounts(design){
    if (design.length==0) return 1

    if (countCache.has(design)) {
        return countCache.get(design)
    }

    let count = 0;
    for(const p of patterns) {
        if (design.startsWith(p)) {
            count += getCounts(design.substring(p.length))
        }
    }
    countCache.set(design, count)
    return count
}


const possibles = desired.filter(d=>isPossible(d))
const possibleCount = possibles.length
console.log(`possible: ${possibleCount}`)

const alternatives = possibles.map(p=>getCounts(p)).reduce((sum, cnt)=> sum+cnt)
console.log(`alternatives: ${alternatives}`)