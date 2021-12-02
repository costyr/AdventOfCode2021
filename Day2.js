const util = require('./Util.js');

function Analize(aDepths) {
  let horPos = 0;
  let depth = 0;
  for (let i = 0; i < aDepths.length; i++) {
    if (aDepths[i].dir == 'forward')
      horPos += aDepths[i].count;
    else if (aDepths[i].dir == 'down')
      depth += aDepths[i].count;
    else if (aDepths[i].dir == 'up')
      depth -= aDepths[i].count;
  }

  return horPos * depth;
}

function Analize2(aDepths) {

  let horPos = 0;
  let depth = 0;
  let aim = 0;
  for (let i = 0; i < aDepths.length; i++) {
    if (aDepths[i].dir == 'forward') {
      horPos += aDepths[i].count;
      depth += aim * aDepths[i].count;
    }
    else if (aDepths[i].dir == 'down')
      aim += aDepths[i].count;
    else if (aDepths[i].dir == 'up')
      aim -= aDepths[i].count;
  }
  return horPos * depth;
}

let depths = util.MapInput('./Day2Input.txt', (aElem) => { 
  let dirAndCount = aElem.split(' ');
  return { dir: dirAndCount[0],  count: parseInt(dirAndCount[1], 10) }; 
}, '\r\n');

console.log(Analize(depths));
console.log(Analize2(depths));
