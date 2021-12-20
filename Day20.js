const util = require('./Util.js');
const alg = require('./NthMatrix.js');
const algM = require('./Matrix.js');

const kNeighboursTransform2D = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

function ExtendMap(aMap, aCount) {
  for (let i = 0; i < aCount; i++)
    alg.Extend2DMatrix(aMap, cc);
}

var cc  = '.';

function ComputeNeighbours(aMap, aX, aY) {

  let rawCode = '';
  for (let i = 0; i < kNeighboursTransform2D.length; i++) {
    let x = aX + kNeighboursTransform2D[i][0];
    let y = aY + kNeighboursTransform2D[i][1];

    if (x >= 0 && x < aMap[aY].length && y >= 0 && y < aMap.length)
      rawCode += aMap[y][x];
    else
      rawCode += cc;
  }

  return rawCode;
}

function ComputeNewPixel(aEncodingMap, aMap, aX, aY) {

 // if (aX >= s && aX < aMap[0].length - 2 * s && aY >= s && aY <= aMap.length - 2 * s)
 //{
  let index = parseInt(ComputeNeighbours(aMap, aX, aY).replace(/\#/g, '1').replace(/\./g, 0), 2);
  return aEncodingMap[index];
 //}
 //else return '.';
}

function ZoomImage(aEncodingMap, aMap) {
  let newMap = [];
  for (let i = 0; i < aMap.length; i++) {
    newMap[i] = []
    for (let j = 0; j < aMap[i].length; j++)
      newMap[i].push(ComputeNewPixel(aEncodingMap, aMap, j, i));
  }

  return newMap;
}

let rawFloorMap = util.MapInput('./Day20Input.txt', (aElem, aIndex) => {
  return aElem;
}, '\r\n\r\n', this);

let encodingTable = rawFloorMap[0].split('\r\n').join('').split('');
let floorMap = rawFloorMap[1].split('\r\n').map(a => { return a.split(''); });

//ExtendMap(floorMap, 3);

console.log(encodingTable.join(''));

algM.CreateMatrix(floorMap).Print();

//let ff = parseInt(ComputeNeighbours(floorMap, 4, 4).replace(/\#/g, '1').replace(/\./g, 0), 2);

//console.log("\n" + encodingTable[ff]);

let map = floorMap;
for (let i = 0; i < 50; i++) {

  ExtendMap(map, 3);

  map = ZoomImage(encodingTable, map);

  cc = (cc == '.') ? '#' : '.'; 

console.log();
algM.CreateMatrix(map).Print();
}

console.log(algM.CreateMatrix(map).CountElement('#'));
