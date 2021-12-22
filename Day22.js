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

function CountAllCubes(aCubes) {
  let noOverlappingCubes = [aCubes[0]];
 
  for (let i = 1; i < aCubes.length; i++) {

    let newCubes = [];
    for (let j = 0; j < noOverlappingCubes.length; j++)
      IntersectCubes(aCubes[i], noOverlappingCubes[j], newCubes);

    noOverlappingCubes = newCubes;
  }

  let total = 0;
  for (let i = 0; i < noOverlappingCubes.length; i++)
    if (noOverlappingCubes[i].state)
    {
      let sizeX = Math.abs(noOverlappingCubes[i].x2 - noOverlappingCubes[i].x1);
      let sizeY = Math.abs(noOverlappingCubes[i].y2 - noOverlappingCubes[i].y1);
      let sizeZ = Math.abs(noOverlappingCubes[i].z2 - noOverlappingCubes[i].z1)

      total += sizeX * sizeY * sizeZ;
    }

  return total;
}

function IntersectCubes(aCube1, aCube2, aNoOverlappingCubes) {
  let minX = Math.min(aCube1.x1, aCube2.x2); 
  let maxX = Math.max(aCube1.x1, aCube1.x2); 
  
  let minY = Math.min(aCube1.y1, aCube2.y2); 
  let maxY = Math.max(aCube1.y1, aCube1.y2); 

  let minZ = Math.min(aCube1.z1, aCube2.z2); 
  let maxZ = Math.max(aCube1.z1, aCube1.z2);

  let xOverlap = Math.max(0, Math.min(aCube1.x2, aCube2.x2) - Math.max(aCube1.x1, aCube2.x1));
  let yOverlap = Math.max(0, Math.min(aCube1.y2, aCube2.y2) - Math.max(aCube1.y1, aCube2.y1));
  let zOverlap = Math.max(0, Math.min(aCube1.z2, aCube2.z2) - Math.max(aCube1.z1, aCube2.z1));

  let overlapArea = xOverlap * yOverlap * zOverlap;

  return (overlapArea > 0);
}

let cubes = util.MapInput('./Day22TestInput.txt', (aElem) => {

    let bb = aElem.split(' ');

    let cc = bb[1].split(',').map(a => { 
        let hh = a.split('='); 
        return hh[1].split('..').map(a => {return parseInt(a);});
    });

    return { state: (bb[0] == 'on'), x1: cc[0][0], x2: cc[0][1], y1: cc[1][0], y2: cc[1][1], z1: cc[2][0], z2: cc[2][1] };
    }, '\r\n', this);

console.log(cubes);

console.log(CountCubes(cubes));

IntersectCubes(cubes[0], cubes[1]);
