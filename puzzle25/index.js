import fo from './fileOperations.js'

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

const data = await fo.readFile('test.txt');
data.push('')
data.push('')

const locks = []
const keys = []
const modes = {KEY:0, LOCK:1}
let mode, current
for(let i=0;i<data.length;i++) {
    const line = data[i]
    if (i%8==0) {
        if (mode==modes.KEY) {
            keys.push(current)
        } else if (mode==modes.LOCK) {
            locks.push(current)
        }

        if (line=='#####') {
            mode = modes.LOCK
            current = [0,0,0,0,0]
        } else {
            mode = modes.KEY
            current = [-1,-1,-1,-1,-1]
        }
    } else {
        for(let j=0;j<line.length;j++) {
            if (line[j]=='#') {
                current[j] += 1
            }
        }
    }
}

function isKeyFitsToLock(key, lock) {
    for(let i =0;i<key.length;i++) {
        if (key[i]+lock[i]>5) {
            return false
        }
    }
    return true
}

const count = locks.map(l=>keys.filter(k=>isKeyFitsToLock(l,k)).length).reduce((sum,c)=>sum+c)
console.log(count)



