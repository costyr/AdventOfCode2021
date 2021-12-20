const util = require('./Util.js');
const alg = require('./NthMatrix.js');
const algM = require('./Matrix.js');


let rawFloorMap = util.MapInput('./Day20TestInput.txt', (aElem, aIndex) => {
  return aElem;
}, '\r\n\r\n', this);

let encodingTable = rawFloorMap[0].split('\r\n').join('').split('');
let floorMap = rawFloorMap[1].split('\r\n').map(a => { return a.split(''); });

for (let i = 0 ; i < 2; i++)
  alg.Extend2DMatrix(floorMap, '.');

console.log(floorMap);

algM.CreateMatrix(floorMap).Print();