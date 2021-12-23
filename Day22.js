const { toASCII } = require('punycode');
const util = require('./Util.js');

function ComputeTotal(aCubesMap) {
  let total = 0;  
  for (let key in aCubesMap)
    if (aCubesMap[key] > 0)
      total ++;
  return total;
}

function CountCubes(aCubes, aSize) {
  let cubesMap = [];
  aCubes.map((a, aIndex) => {

      let intersect = 0;
      for (let i = Math.max(-aSize, a.x1); i <= Math.min(a.x2, aSize); i++)  
        for (let j = Math.max(-aSize, a.y1); j <= Math.min(a.y2, aSize); j++)  
         for (let k = Math.max(-aSize, a.z1); k <= Math.min(a.z2, aSize); k++) {
          let ptId = i + "_" + j + "_"+ k; 
          
          if (cubesMap[ptId] != undefined)
            intersect ++;

          cubesMap[ptId] = a.state ? 1 : 0;  
         }

         let total = ComputeTotal(cubesMap); 
         console.log(total + " " +  aIndex + ": " + intersect);

    }, this);

  return ComputeTotal(cubesMap);;
}

function ComputeCubeArea(aCube) {
  return ((aCube.x2 - aCube.x1) + 1) * ((aCube.y2 - aCube.y1) + 1) * ((aCube.z2 - aCube.z1) + 1);    
}

function CountAllCubes(aCubes) {

  console.log("0 0: 0");
  let total = aCubes[0].state ? ComputeCubeArea(aCubes[0]) : 0; 
  let noOverlappingCubes = [aCubes[0]];

  for (let i = 1; i < aCubes.length; i++) {

    let state1 = aCubes[i].state;

    let hh = 0;
    for (let j = 0; j < noOverlappingCubes.length; j++) {

      let state2 = noOverlappingCubes[j].state;

      let intersectArea = IntersectCubesSlow(aCubes[i], noOverlappingCubes[j]);
      hh += intersectArea;

      if (intersectArea > 0)
      {
        if (state1)
        {
          if (state2) {
            total -= intersectArea;

            if (total < 0)
              total = 0;
          }
        }
        else
        {
          if (state2) {
            total -= intersectArea;

            if (total < 0)
              total = 0;
          }
        }            
      }
    }

    if (state1) {
      
      let gg = ComputeCubeArea(aCubes[i]);
      
      total += gg;
    }

    console.log(total + " " + i + ": " + hh);

    noOverlappingCubes.push(aCubes[i]);
  }

  return total;
}

function IntersectCubes(aCube1, aCube2) {
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

  if (overlapArea)
    return (xOverlap + 1) * (yOverlap + 1) * (zOverlap + 1);

  return 0;
}

function CubeToMap(aCube, aMap) {
  for (let i = aCube.x1; i <= aCube.x2; i++)  
  for (let j = aCube.y1; j <= aCube.y2; j++)  
   for (let k = aCube.z1; k <= aCube.z2; k++) {
    let ptId = i + "_" + j + "_"+ k; 
    
     if (aMap[ptId] === undefined)
       aMap[ptId] = 0;
     else
       aMap[ptId] += 1;
   }
}

function IntersectCubesSlow(aCube1, aCube2) {

  let cubesMap = []
  CubeToMap(aCube1, cubesMap);
  CubeToMap(aCube2, cubesMap);

  let total = 0;
  for (let key in cubesMap)
    total += cubesMap[key];
  return total;
}

let cubes = util.MapInput('./Day22TestInput4.txt', (aElem) => {

    let bb = aElem.split(' ');

    let cc = bb[1].split(',').map(a => { 
        let hh = a.split('='); 
        return hh[1].split('..').map(a => {return parseInt(a);});
    });

    return { state: (bb[0] == 'on'), x1: cc[0][0], x2: cc[0][1], y1: cc[1][0], y2: cc[1][1], z1: cc[2][0], z2: cc[2][1] };
    }, '\r\n', this);

for (let i = 0; i < cubes.length; i++)
  console.log(i + " " + JSON.stringify(cubes[i]) + " " + ComputeCubeArea(cubes[i]));

//IntersectCubes(cubes[14], cubes[49]);
/*
for (let i = 0; i < cubes.length; i++)
  for (let j = i + 1; j < cubes.length; j++)
  {
    let ff = IntersectCubes(cubes[i], cubes[j]);
    let ff2 = IntersectCubesSlow(cubes[i], cubes[j]);

    if (ff != ff2) {
      console.log(i + " " + j + ": " + ff + " = " + ff2);
    }
  }*/

console.log(CountCubes(cubes, 50));

//IntersectCubes(cubes[0], cubes[1]);

console.log(CountAllCubes(cubes));
