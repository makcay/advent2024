import fo from './fileOperations.js'

let data = await fo.readFile('test1.txt');
for (const line of data) {
    console.log(`line=${line}`)
}