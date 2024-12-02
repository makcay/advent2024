import fo from './fileOperations.js'

let data = await fo.readFile('test1.txt');
let list1=[], list2=[]
for (const line of data) {
    let matches = line.match(/\d+/g);
    list1.push(matches[0])
    list2.push(matches[1])
}

function distance() {
    list1.sort()
    return list2.sort()
        .map((e,i) =>  Math.abs(e-list1[i]))
        .reduce((sum, diff) => sum+diff);
}

function similarity() {
    return list1.map( e1 =>
        e1 * list2.filter(e2=>e1==e2).length
    ).reduce((sum, diff) => sum+diff);
}

console.log(similarity())