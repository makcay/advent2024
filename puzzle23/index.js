import fo from './fileOperations.js'

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item)

const data = await fo.readFile('test.txt');
const links = new Map()
for(const line of data) {
    const [left, right] = line.split('-').map(s=>s.trim())
    if (!links.has(left)) {
        links.set(left, new Set())
    }
    links.get(left).add(right)
    if (!links.has(right)) {
        links.set(right, new Set())
    }
    links.get(right).add(left)
}

const compsWithT = [...links.entries()].filter(([k,v])=>k[0]=='t')

const threeGroups = []
function isSetInList(set) {
    for(const group of threeGroups) {
        if (isSetsEqual(group, set)) {
            return true
        }
    }
    return false
}

function isSetsEqual(set1, set2) {
    if (set1.size!=set2.size) return false
    for(const item of set1) {
        if (!set2.has(item)) {
            return false
        }
    }
    return true
}

for (const tGroup of compsWithT) {
    const name1 = tGroup[0]
    const comps = [...tGroup[1].keys()]
    for(let i=0;i<comps.length-1;i++) {
        for(let j=i+1;j<comps.length;j++) {
            if (links.get(comps[i]).has(comps[j])) {
                const candSet = new Set()
                candSet.add(name1)
                candSet.add(comps[i])
                candSet.add(comps[j])
                if (!isSetInList(candSet)) {
                    threeGroups.push(candSet)
                }
            }
        }
    }
}

function findParty(compName) {
    const party = new Set()
    party.add(compName)
    for(const candidate of links.get(compName)) {
        let found = true
        for(const p of party) {
            if (!links.get(p).has(candidate)) {
                found = false
                break
            }
        }
        if (found) {
            party.add(candidate)
        }
    }
    return party
}

console.log(`groups: ${threeGroups.length}`)

let theParty
let maxPartySize = 0
for(const compName of links.keys()){
    const newParty = findParty(compName)
    if (newParty.size>maxPartySize) {
        maxPartySize = newParty.size
        theParty = newParty
    }
}

console.log([...theParty].sort().join(','))

