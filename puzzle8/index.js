import fo from './fileOperations.js'

const data = await fo.readFile('test.txt');
const M = data.length, N=data[0].length
const antennas = new Map()
for (let i=0; i<data.length;i++) {
    const charArray = [...data[i]]
    charArray.forEach((c,j)=>{if (c.match(/[a-zA-Z0-9]/g)) putMap(antennas, c, [i,j])})
}

function putMap(map, key, value) {
    if (!map.get(key)) {
        map.set(key,[])
    }
    map.get(key).push(value)
}

function getAntiNode(node1, node2) {
    let y1 = node1[0], x1 = node1[1]
    let y2 = node2[0], x2 = node2[1]
    
    let antiX1 = x1 - (x2 - x1)
    let antiY1 = y1 - (y2 - y1)
    let antiX2 = x2 - (x1 - x2)
    let antiY2 = y2 - (y1 - y2)
    return [[antiY1, antiX1], [antiY2, antiX2]]
}

function getAntiNode2(node1, node2) {
    let y1 = node1[0], x1 = node1[1]
    let y2 = node2[0], x2 = node2[1]
    
    const antinodes = []
    let tmpX1 = x1, tmpY1 = y1, tmpX2 = x2, tmpY2 = y2;
    while(true) {
        let antiX1 = tmpX1 - (tmpX2 - tmpX1)
        let antiY1 = tmpY1 - (tmpY2 - tmpY1)
        if (isPointInBoundary([antiY1, antiX1])) {
            antinodes.push([antiY1, antiX1])
            tmpX2 = tmpX1
            tmpY2 = tmpY1
            tmpX1 = antiX1
            tmpY1 = antiY1
        } else {
            break;
        }
    }

    tmpX1 = x1, tmpY1 = y1, tmpX2 = x2, tmpY2 = y2;
    while(true) {
        let antiX2 = tmpX2 - (tmpX1 - tmpX2)
        let antiY2 = tmpY2 - (tmpY1 - tmpY2)
        if (isPointInBoundary([antiY2, antiX2])) {
            antinodes.push([antiY2, antiX2])
            tmpX1 = tmpX2
            tmpY1 = tmpY2
            tmpX2 = antiX2
            tmpY2 = antiY2
        } else {
            break;
        }
    }
    
    return antinodes
}



function isPointInBoundary(point) {
    return point[0]>=0 && point[0]<M && point[1]>=0 && point[1]<N
}

const antiNodeSet = new Set()
for(const key of antennas.keys()) {
    const locations = antennas.get(key)
    if (locations.length==1) continue
    for(let i=0;i<locations.length-1;i++) {
        for(let j=i+1;j<locations.length;j++) {
            const [antiNode1, antiNode2] = getAntiNode(locations[i], locations[j])
            if (isPointInBoundary(antiNode1)) {
                antiNodeSet.add(String(antiNode1[0])+","+String(antiNode1[1]))
            }
            if (isPointInBoundary(antiNode2)) {
                antiNodeSet.add(String(antiNode2[0])+","+String(antiNode2[1]))
            }
        }
    }
}

console.log(antiNodeSet.size)

const antiNodeSet2 = new Set()
for(const key of antennas.keys()) {
    const locations = antennas.get(key)
    if (locations.length==1) continue
    for(let i=0;i<locations.length-1;i++) {
        for(let j=i+1;j<locations.length;j++) {
            antiNodeSet2.add(String(locations[i][0])+","+String(locations[i][1]))
            antiNodeSet2.add(String(locations[j][0])+","+String(locations[j][1]))
            const antiNodes = getAntiNode2(locations[i], locations[j])
            for(const a of antiNodes) {
                antiNodeSet2.add(String(a[0])+","+String(a[1]))
            }
        }
    }
}

console.log(antiNodeSet2.size)