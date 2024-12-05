import fo from './fileOperations.js'

const orders = []
const updates = []
let data = await fo.readFile('test.txt');
for (const line of data) {
    if (line.includes('|')) {
        let matches = line.matchAll(/(\d+)\|(\d+)/g).next().value;
        orders.push([matches[1],matches[2]])
    } else if (line.includes(',')) {
        updates.push(line.split(','))
    }
}

function isOrderPresent(x,y){
    for(const order of orders) {
        if (order[0]==x && order[1]==y) {
            return true;
        }
    }
    return false;
}

function isUpdateValid(update) {
  for(let i=0;i<update.length-1;i++) {
    for (let j=i+1;j<update.length;j++) {
        if (isOrderPresent(update[j], update[i])) {
            return false;
        }
    }
  }
  return true;
}

function fixInvalidUpdate(update) {
    let result = update.slice()
    for(let i=0;i<result.length-1;i++) {
      for (let j=i+1;j<result.length;j++) {
          if (isOrderPresent(result[j], result[i])) {
              swap(result, i, j)
          }
      }
    }
    return result
  }

  function swap(update, i, j) {
    let tmp = update[i]
    update[i] = update[j]
    update[j] = tmp
  }

let valid = updates.filter(isUpdateValid)
let total = valid.map(u=>Number(u[(u.length-1)/2])).reduce((sum, middle)=>sum+middle)
console.log(total)

let invalid = updates.filter(u=>!isUpdateValid(u))
let invalidTotal = invalid.map(fixInvalidUpdate)
    .map(u=>Number(u[(u.length-1)/2]))
    .reduce((sum, middle)=>sum+middle)
console.log(invalidTotal)




