import path from 'node:path';
import fs from 'fs';
import readline from 'readline';

const __dirname = import.meta.dirname;

function getFileStream(filename) {
    const fileStream = fs.createReadStream(path.join(__dirname, filename));
    return readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });    
}

async function readFile(filename) {
    let data = []
    for await (const line of getFileStream(filename)) {
        data.push(line)
    }
    return data
}

export default {readFile, getFileStream}