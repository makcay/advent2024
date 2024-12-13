import fo from './fileOperations.js'

let diskMap = []
let totalSpace = 0;
const data = await fo.readFile('test.txt')
for (let i=0; i<data.length;i++) {
    const charArray = [...data[i]]
    charArray.map(c=>Number(c)).forEach((c,i)=>{
        const charToAppend = (i%2==0) ? i/2 : '.'
        for(let times=0;times<c;times++) {
            diskMap.push(charToAppend)
            if (charToAppend=='.') totalSpace++
        }
    })
}
let initialDiskMap = [...diskMap]

function swapMap(i,j) {
    let tmp = diskMap[i]
    diskMap[i] = diskMap[j]
    diskMap[j] = tmp
}

let firstSpaceIndex = 0, lastDataIndex = diskMap.length-1;
while(firstSpaceIndex<lastDataIndex) {
    while (diskMap[firstSpaceIndex]!='.') firstSpaceIndex++
    while(diskMap[lastDataIndex]=='.') lastDataIndex--
    if (firstSpaceIndex<lastDataIndex) {
        swapMap(firstSpaceIndex, lastDataIndex)
    }
}

const total = diskMap.filter(c=>c!='.').map((c,i)=>i*Number(c)).reduce((sum,delta)=>sum+delta)
console.log(`total: ${total}`)

function swapMapBlock(i,j,count) {
    for(let k=0;k<count;k++) {
        let tmp = diskMap[i+k]
        diskMap[i+k] = diskMap[j+k]
        diskMap[j+k] = tmp
    }
}

function findEmptyBlock(count) {
    for(let index=0, blockCount=0;index<diskMap.length-1;index++) {
        if (diskMap[index]=='.') {
            blockCount++
            if (blockCount>=count) {
                return index-blockCount+1;
            }
        } else {
            blockCount=0;
        }
    }
    return -1;
}

diskMap = [...initialDiskMap]
let numberToBeMoved
let lastIndex = diskMap.length-1
while(lastIndex>0) {
  while(lastIndex>0 && diskMap[lastIndex]=='.') lastIndex--;
  numberToBeMoved = diskMap[lastIndex];
  let blockCount = 1
  lastIndex--;
  while(lastIndex>0 && diskMap[lastIndex]==numberToBeMoved) {
    lastIndex--
    blockCount++
  }
  let freeIndex = findEmptyBlock(blockCount)
  if (freeIndex!=-1 && freeIndex<=lastIndex) {
    swapMapBlock(freeIndex, lastIndex+1, blockCount)
  }
}

const total2 = diskMap.map((c,i)=>c!='.' ? i*Number(c) : 0).reduce((sum,delta)=>sum+delta)
console.log(`total2: ${total2}`)