const util = require('./Util.js');
const alg = require('./Matrix.js');

function GetNextEst(aMap, aX, aY) {
  let x = aX + 1;
  if (x < aMap[0].length)
    return { s: aMap[aY][x], x: x, y: aY };
  else
    return { s: aMap[aY][0], x: 0, y: aY };
}

function GetNextSouth(aMap, aX, aY) {
  let y = aY + 1;
  if (y < aMap.length)
    return { s: aMap[y][aX], x: aX, y: y };
  else
    return { s: aMap[0][aX], x: aX, y: 0 };
}

function MoveSeaCucumbersOneStep(aMap) {

  let oldMap1 = util.CopyObject(aMap);

  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
    {
      if (aMap[i][j] == '>')
      {
        let next = GetNextEst(oldMap1, j, i);
        if (next.s == '.') {
          aMap[next.y][next.x] = '>';
          aMap[i][j] = '.';
          j++;
        }
      }
    }

  let oldMap2 = util.CopyObject(aMap);
   
   for (let j = 0; j < aMap[0].length; j++)
    for (let i = 0; i < aMap.length; i++)
    {
      if (aMap[i][j] == 'v')
      {
        let next = GetNextSouth(oldMap2, j, i);
        if (next.s == '.') {
          aMap[next.y][next.x] = 'v';
          aMap[i][j] = '.';
          i++;
        }
      }
    }

    let changed = false;
    for (let i = 0; i < aMap.length; i++)
      for (let j = 0; j < aMap[i].length; j++)
        if (oldMap1[i][j] != aMap[i][j]) {
          changed = true;
          break;
        }
    return changed;
}

function MoveSeaCucumbers(aMap) {
  let i = 1;
  while (1) {
    let changed = MoveSeaCucumbersOneStep(aMap);

    if (!changed)
      return i;

    console.log("\nAfter " + (i + 1) + " steps: ");
    alg.CreateMatrix(aMap).Print();
    i++;
  }
}

let map = util.MapInput('./Day25Input.txt', (aElem) => {

    return aElem.split('');
}, '\r\n', this);

alg.CreateMatrix(map).Print();

console.log(MoveSeaCucumbers(map));
