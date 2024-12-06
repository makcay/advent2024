import fo from './fileOperations.js'

let data = await fo.readFile('test.txt');
let reports = []
for (const line of data) {
    let numbers = line.match(/\d+/g).map(a=>Number(a));
    reports.push(numbers)
}

function isReportSafe(report) {
    if (report.length<2) return true;
    if (report[0]==report[1]) return false;
    let isIncreasing=report[1]>report[0];
    for(let i=1;i<report.length;i++) {
        if (Math.abs(report[i]-report[i-1])>3) return false;
        if (report[i]==report[i-1]) return false;
        if (isIncreasing!==report[i]>report[i-1]) return false;
    }
    return true;
}

function canReportBeSafe(report) {
    if (isReportSafe(report)) {
        return true;
    }
    for(let i=0;i<report.length;i++) {
        let newReport = []
        for(let j=0;j<report.length;j++) {
            if (i!=j) {
                newReport.push(report[j])
            }
        }
        if (isReportSafe(newReport)) {
            return true;
        }
    }
    return false;
}

console.log(reports.map(r=>isReportSafe(r)).filter(r=>r==true).length);
console.log(reports.map(r=>canReportBeSafe(r)).filter(r=>r==true).length);
