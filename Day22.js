const util = require('./Util.js');

function CountCubes(aCubes) {
  let cubesMap = [];
  aCubes.map((a, aIndex) => {

      console.log(aIndex + " " + JSON.stringify(a));

      for (let i = Math.max(-50, a.x1); i <= Math.min(a.x2, 50); i++)  
        for (let j = Math.max(-50, a.y1); j <= Math.min(a.y2, 50); j++)  
         for (let k = Math.max(-50, a.z1); k <= Math.min(a.z2, 50); k++) {
          let ptId = i + "_" + j + "_"+ k; 
          
          cubesMap[ptId] = a.state ? 1 : 0;  
         }
    }, this);

  let total = 0;  
  for (let key in cubesMap)
    if (cubesMap[key] > 0)
      total ++;

  return total;
}

let cubes = util.MapInput('./Day22Input.txt', (aElem) => {

    let bb = aElem.split(' ');

    let cc = bb[1].split(',').map(a => { 
        let hh = a.split('='); 
        return hh[1].split('..').map(a => {return parseInt(a);});
    });

    return { state: (bb[0] == 'on'), x1: cc[0][0], x2: cc[0][1], y1: cc[1][0], y2: cc[1][1], z1: cc[2][0], z2: cc[2][1] };
    }, '\r\n', this);

console.log(cubes);

console.log(CountCubes(cubes));
