import fo from './fileOperations.js'

let total = 0
let data = await fo.readFile('test.txt');
let isDoMode = true;
for (const line of data) {
    let modifiedLine;
    if (isDoMode) {
        modifiedLine = "do()" + line
    } else {
        modifiedLine = "don't()" + line
    }

    let filteredLine = removeDonts(modifiedLine)
    let multiplications = filteredLine.match(/mul\(([1-9]\d{0,2}|0),([1-9]\d{0,2}|0)\)/g);
    multiplications.forEach(m=>{
        let numbers = m.match((/\d+/g)).map(a=>Number(a))
        total += numbers[0]*numbers[1]
    });
}

function removeDonts(line) {
    let start = line.indexOf('don\'t()');
    if (start != -1) {
        isDoMode = false
        let result = line.substr(0, start);
        let remaining = line.substr(start)
        let end = remaining.indexOf('do()')
        if (end != -1) {
            let tmp = remaining.substr(end+4)
            isDoMode = tmp.indexOf("don't") == -1
            result = result + tmp
        }
        return removeDonts(result);
    }
    return line;
}

console.log(total);

