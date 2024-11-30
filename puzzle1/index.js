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


for await (const line of getFileStream('test1.txt')) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
}