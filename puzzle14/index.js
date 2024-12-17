import fo from './fileOperations.js'

const dirType = {UP:[0,-1],RIGHT:[1,0],DOWN:[0,1],LEFT:[-1,0]}
const dirs = [dirType.UP, dirType.RIGHT, dirType.DOWN, dirType.LEFT]

const data = await fo.readFile('test.txt');
let robots = []
for(const line of data) {
    let matches = line.matchAll(/p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/g).next().value;
    const position = [matches[1], matches[2]].map(x=>Number(x))
    const velocity = [matches[3], matches[4]].map(x=>Number(x))
    robots.push([position, velocity])
}

const M = 103, N=101
//const M = 7, N=11

function mod(n, m) {
    return ((n % m) + m) % m;
  }

function moveRobot(robot) {
    const p = robot[0]
    const v = robot[1]
    const newP = [mod(p[0]+v[0], N), mod(p[1]+v[1], M)]
    robot[0] = newP
}

const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);


const originalRobots = clone(robots)
for(let i=0;i<100;i++) {
    for(const robot of robots) {
        moveRobot(robot)
    }
}

const lower_x = Math.floor(N/2)-1
const upper_x = N%2==0 ? N/2 : (N+1)/2
const lower_y = Math.floor(M/2)-1
const upper_y = M%2==0 ? M/2 : (M+1)/2

let q1_region= [0,0,lower_x, lower_y]
let q2_region = [upper_x, 0, N-1, lower_y]
let q3_region = [0, upper_y, lower_x, M-1]
let q4_region = [upper_x, upper_y, N-1, M-1]
const regions = [q1_region, q2_region, q3_region, q4_region]

let safety = 1
for(const region of regions) {
    const regionCount = robots.filter(r=>{
        const p = r[0]
        return p[0]>=region[0] && p[1]>=region[1] && p[0]<=region[2] && p[1]<=region[3]
    }).length
    safety *= regionCount
}
console.log(`safety: ${safety}`)

robots = clone(originalRobots)


function getFigure() {
    const figure = []
    for(let i=0;i<M;i++) {
        figure[i]=[]
        for(let j=0;j<N;j++) {
            figure[i][j] = ' '
        }
    }
    for(const r of robots) {
        figure[r[0][1]][r[0][0]] = '#'
    }
    const figureStr = []
    for(let i=0;i<M;i++) {
        figureStr.push(figure[i].join(""))
    }
    return figureStr
}


let found = false
for(let i=0;i<1000000;i++) {
    for(const robot of robots) {
        moveRobot(robot)
    }
    const figure = getFigure()
    let count = 0
    for(const line of figure){
        if (line.includes("###################")){
            count++
        }
        if (count>3) {
            found = true
            console.log(`seconds: ${i+1}`)
            break
        }
    }
    if (found) {
        console.log(figure)
        break
    }
}



