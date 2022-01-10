const util = require('./Util.js');

function ComputeTotal(aCubesMap) {
  let total = 0;
  for (let key in aCubesMap)
    if (aCubesMap[key] > 0)
      total++;
  return total;
}

function CountCubes(aCubes, aSize) {
  let cubesMap = [];
  aCubes.map((a, aIndex) => {

    let intersect = 0;
    for (let i = Math.max(-aSize, a.x1); i <= Math.min(a.x2, aSize); i++)
      for (let j = Math.max(-aSize, a.y1); j <= Math.min(a.y2, aSize); j++)
        for (let k = Math.max(-aSize, a.z1); k <= Math.min(a.z2, aSize); k++) {
          let ptId = i + "_" + j + "_" + k;

          if (cubesMap[ptId] != undefined)
            intersect++;

          cubesMap[ptId] = a.state ? 1 : 0;
        }

    let total = ComputeTotal(cubesMap);
    console.log(total + " " + aIndex + ": " + intersect);

  }, this);

  return ComputeTotal(cubesMap);;
}

function ComputeTotal2(aNoOverlappingCubes) {
  let total = 0;
  for (let k = 0; k < aNoOverlappingCubes.length; k++) {
    if (aNoOverlappingCubes[k].state)
      total += ComputeCubeArea(aNoOverlappingCubes[k]);
  }

  return total;
}

function ComputeCubeArea(aCube) {
  return ((aCube.x2 - aCube.x1) + 1) * ((aCube.y2 - aCube.y1) + 1) * ((aCube.z2 - aCube.z1) + 1);
}

function FindCube(aCube, aNoOverlappingCubes) {

  for (let j = 0; j < aNoOverlappingCubes.length; j++)
    if (aNoOverlappingCubes[j].x1 == aCube.x1 && aNoOverlappingCubes[j].x2 == aCube.x2 &&
      aNoOverlappingCubes[j].y1 == aCube.y1 && aNoOverlappingCubes[j].y2 == aCube.y2 &&
      aNoOverlappingCubes[j].z1 == aCube.z1 && aNoOverlappingCubes[j].z2 == aCube.z2) {
      return true;
    }

  return false;
}

function TestIntersections(aCubes) {
  for (let i = 0; i < aCubes.length; i++)
  for (let j = i + 1; j < aCubes.length; j++)
  {
    let ff = IntersectCubesSlow(aCubes[i], aCubes[j]);
    if (ff > 0)
      console.log(i + " " + j + ": " + ff);
  }
}

function CountAllCubes(aCubes) {

  let noOverlappingCubes = [aCubes[0]];
  console.log(ComputeTotal2(noOverlappingCubes) + " " + 0 + " " + 0);
  for (let i = 1; i < 3; i++) {

    let state1 = aCubes[i].state;

    let newNoOver = [];
    let stepDiffs = [];
    let partIntersect = 0;
    for (let j = 0; j < noOverlappingCubes.length; j++) {

      let intersectArea = IntersectCubes(aCubes[i], noOverlappingCubes[j]);

      if (intersectArea > 0) {
        let partNoOver = [];
        ComputeIntersectRects(aCubes[i], noOverlappingCubes[j], state1, partNoOver);
        partIntersect += intersectArea;

        stepDiffs.push(partNoOver);
      }
      else
      {
        if (!FindCube(noOverlappingCubes[j], newNoOver))
          newNoOver.push(noOverlappingCubes[j]);
      }
    }

    let hh = [];
    for (let k = 0; k < stepDiffs.length; k++) {
      TestIntersections(stepDiffs[k]);
      for (let n = 0; n < stepDiffs[k].length; n++)
         if (!FindCube(stepDiffs[k][n], newNoOver))
         {
          if((i == 2) && IsIncluded(stepDiffs[k][n], aCubes[i])) {

            if (!FindCube(stepDiffs[k][n], hh))
              hh.push(stepDiffs[k][n]);
          }

            newNoOver.push(stepDiffs[k][n]); 
             
         }
    }   

    TestIntersections(hh);

    noOverlappingCubes = newNoOver;

    console.log(ComputeTotal2(noOverlappingCubes) + " " + i + " " + partIntersect);

    TestIntersections(noOverlappingCubes);
  }

  console.log(noOverlappingCubes);

  return ComputeTotal2(noOverlappingCubes);
}

function IntersectCubes(aCube1, aCube2) {

  let xOverlap = Math.max(-1, Math.min(aCube1.x2, aCube2.x2) - Math.max(aCube1.x1, aCube2.x1)) + 1;
  let yOverlap = Math.max(-1, Math.min(aCube1.y2, aCube2.y2) - Math.max(aCube1.y1, aCube2.y1)) + 1;
  let zOverlap = Math.max(-1, Math.min(aCube1.z2, aCube2.z2) - Math.max(aCube1.z1, aCube2.z1)) + 1;

  let overlapArea = xOverlap * yOverlap * zOverlap;

  //if (overlapArea)
  //  return (xOverlap + 1) * (yOverlap + 1) * (zOverlap + 1);

  return overlapArea;
}

function CubeToMap(aCube, aMap) {
  for (let i = aCube.x1; i <= aCube.x2; i++)
    for (let j = aCube.y1; j <= aCube.y2; j++)
      for (let k = aCube.z1; k <= aCube.z2; k++) {
        let ptId = i + "_" + j + "_" + k;

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
  for (let key in cubesMap) {
    if (cubesMap[key] > 0)
      total++;
  }
  return total;
}

function IsIncluded(aCube1, aCube2) {
  if (aCube1.x1 >= aCube2.x1 && aCube1.x1 <= aCube2.x2 &&
    aCube1.x2 >= aCube2.x1 && aCube1.x2 <= aCube2.x2 &&
    aCube1.y1 >= aCube2.y1 && aCube1.y1 <= aCube2.y2 &&
    aCube1.y2 >= aCube2.y1 && aCube1.y2 <= aCube2.y2 &&
    aCube1.z1 >= aCube2.z1 && aCube1.z1 <= aCube2.z2 &&
    aCube1.z2 >= aCube2.z1 && aCube1.z2 <= aCube2.z2)
    return true;
  return false;
}

function IsIncluded2(aCube1, aCube2, aCube3) {
  if (IsIncluded(aCube1, aCube2)) {
    aCube1.state = aCube2.state;
    return true;
  }
  else if (IsIncluded(aCube1, aCube3)) {
    aCube1.state = aCube3.state;
    return true;
  }
  return false;
}

function ComputeDiffCubes(aMaxCube, aMidCube, aZCoord, aDiffCubes) {
  let leftCube = {
    x1: aMaxCube.minX, x2: aMidCube.x1 - 1, y1: aMidCube.y1, y2: aMidCube.y2,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let rightCube = {
    x1: aMidCube.x2 + 1, x2: aMaxCube.maxX, y1: aMidCube.y1, y2: aMidCube.y2,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let leftTopCube = {
    x1: aMaxCube.minX, x2: aMidCube.x1 - 1, y1: aMidCube.y2 + 1, y2: aMaxCube.maxY,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let topCube = {
    x1: aMidCube.x1, x2: aMidCube.x2, y1: aMidCube.y2 + 1, y2: aMaxCube.maxY,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let rightTopCube = {
    x1: aMidCube.x2 + 1, x2: aMaxCube.maxX, y1: aMidCube.y2 + 1, y2: aMaxCube.maxY,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let leftBotomCube = {
    x1: aMaxCube.minX, x2: aMidCube.x1 - 1, y1: aMaxCube.minY, y2: aMidCube.y1 - 1,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let botomCube = {
    x1: aMidCube.x1, x2: aMidCube.x2, y1: aMaxCube.minY, y2: aMidCube.y1 - 1,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  let rightBotomCube = {
    x1: aMidCube.x2 + 1, x2: aMaxCube.maxX, y1: aMaxCube.minY, y2: aMidCube.y1 - 1,
    z1: aZCoord.z1, z2: aZCoord.z2, state: true
  };

  aDiffCubes.push(leftCube);
  aDiffCubes.push(rightCube);
  aDiffCubes.push(leftTopCube);
  aDiffCubes.push(topCube);
  aDiffCubes.push(rightTopCube);
  aDiffCubes.push(leftBotomCube);
  aDiffCubes.push(botomCube);
  aDiffCubes.push(rightBotomCube);
}

function MergeDiffCubes(aDiffCubes, aCube1, aCube2) {

  let newCube = { x1: Number.MAX_SAFE_INTEGER, x2: -Number.MAX_SAFE_INTEGER, y1: Number.MAX_SAFE_INTEGER, y2: -Number.MAX_SAFE_INTEGER, z1: Number.MAX_SAFE_INTEGER, z2: -Number.MAX_SAFE_INTEGER };

  aDiffCubes.map(a => {

    let diffCubeArrea = ComputeCubeArea(a);

    if (IsIncluded2(a, aCube1, aCube2) && diffCubeArrea > 0) {

      newCube.x1 = Math.min(newCube.x1, a.x1);
      newCube.x2 = Math.max(newCube.x2, a.x2);

      newCube.y1 = Math.min(newCube.y1, a.y1);
      newCube.y2 = Math.max(newCube.y2, a.y2);

      newCube.z1 = Math.min(newCube.z1, a.z1);
      newCube.z2 = Math.max(newCube.z2, a.z2);
    }
  }, this);

  return newCube;
}

function ComputeMidCube(aCube1, aCube2) {
  let midCube = {
    x1: Math.max(aCube1.x1, aCube2.x1), x2: Math.min(aCube1.x2, aCube2.x2),
    y1: Math.max(aCube1.y1, aCube2.y1), y2: Math.min(aCube1.y2, aCube2.y2),
    z1: Math.max(aCube1.z1, aCube2.z1), z2: Math.min(aCube1.z2, aCube2.z2),
    state: true
  };

  return midCube;
}

function ComputeIntersectRects(aCube1, aCube2, aState, aNoOvelapRects) {

  let minX = Math.min(aCube1.x1, aCube1.x2, aCube2.x1, aCube2.x2);
  let maxX = Math.max(aCube1.x1, aCube1.x2, aCube2.x1, aCube2.x2);

  let minY = Math.min(aCube1.y1, aCube1.y2, aCube2.y1, aCube2.y2);
  let maxY = Math.max(aCube1.y1, aCube1.y2, aCube2.y1, aCube2.y2);

  let minZ = Math.min(aCube1.z1, aCube1.z2, aCube2.z1, aCube2.z2);
  let maxZ = Math.max(aCube1.z1, aCube1.z2, aCube2.z1, aCube2.z2);

  let maxCube = { minX: minX, maxX: maxX, minY: minY, maxY: maxY, minZ: minZ, maxZ: maxZ };

  let midCube = {
    x1: Math.max(aCube1.x1, aCube2.x1), x2: Math.min(aCube1.x2, aCube2.x2),
    y1: Math.max(aCube1.y1, aCube2.y1), y2: Math.min(aCube1.y2, aCube2.y2),
    z1: Math.max(aCube1.z1, aCube2.z1), z2: Math.min(aCube1.z2, aCube2.z2),
    state: aState
  };

  let diffCubes = [];

  if (aNoOvelapRects != undefined)
    aNoOvelapRects.push(midCube);

  ComputeDiffCubes(maxCube, midCube, { z1: midCube.z1, z2: midCube.z2 }, diffCubes);

  let gg = [];
  ComputeDiffCubes(maxCube, midCube, { z1: midCube.z2 + 1, z2: maxZ }, gg);

  let uu = [];
  ComputeDiffCubes(maxCube, midCube, { z1: minZ, z2: midCube.z1 - 1 }, uu);

  gg.push({ x1: midCube.x1, x2: midCube.x2, y1: midCube.y1, y2: midCube.y2, z1: midCube.z2 + 1, z2: maxZ });

  diffCubes.push(MergeDiffCubes(gg, aCube1, aCube2));

  uu.push({ x1: midCube.x1, x2: midCube.x2, y1: midCube.y1, y2: midCube.y2, z1: minZ, z2: midCube.z1 - 1 });

  diffCubes.push(MergeDiffCubes(uu, aCube1, aCube2));

  let area1 = ComputeCubeArea(aCube1) + ComputeCubeArea(aCube2);

  let area2 = ComputeCubeArea(midCube) * 2;
  let ff = [];
  for (let i = 0; i < diffCubes.length; i++) {
    let diffCubeArrea = ComputeCubeArea(diffCubes[i]);
    if (IsIncluded2(diffCubes[i], aCube1, aCube2) && diffCubeArrea > 0) {
      area2 += diffCubeArrea;
      ff.push(diffCubeArrea);
      if (aNoOvelapRects != undefined) {

        let found = FindCube(diffCubes[i], aNoOvelapRects);
        if (!found)
          aNoOvelapRects.push(diffCubes[i]);
      }
    }
    else
      ff.push(0);
  }

  if (area1 != area2)
    console.log("Test cube intersect: " + area1 + " != " + area2);
}

function TestCubesIntersect(aCubes) {
  for (let i = 0; i < aCubes.length; i++)
    for (let j = i + 1; j < aCubes.length; j++) {
      let ff = IntersectCubes(aCubes[i], aCubes[j]);
      let ff2 = IntersectCubesSlow(aCubes[i], aCubes[j]);

      console.log(i + " " + j + ": " + ff);
      if (ff != ff2) {
        console.log(ff + " != " + ff2);
      }

      if (ff > 0)
        ComputeIntersectRects(aCubes[i], aCubes[j]);
    }
}

function CountOnCubes(aCubes) {

  let total = 0;
  for (let i = 0; i < aCubes.length - 2; i++) {

    let gg = [];
    for (let j = 0; j < i; j++)
    {
       let ff = IntersectCubes(aCubes[i], aCubes[j]);

       if (ff > 0) {
         if (aCubes[j].state) {

          let mid = ComputeMidCube(aCubes[i], aCubes[j]);
          if (!FindCube(mid, gg))
            gg.push(mid);

           total -= ff;
         }
       }
    }

    while (1) {

      let found = false;
    for (let k = 0; k < gg.length; k++)
    {
      for (let l = k + 1; l < gg.length; l++)
      {
        if (IsIncluded(gg[k], gg[l])) {
          gg.splice(k, 1);
          found = true;
          break;
        }
      }

      if (found)
        break;
    }

    if (!found)
      break;
  }
   

    /*if (aCubes[i].state) {

      let intersect = 0;
      let used = [];
      while (1) {
  
        let newGG = [];
        for (let k = 0; k < gg.length; k++)
          for (let l = k + 1; l < gg.length; l++)
          {
            let ff = IntersectCubes(gg[k], gg[l]);
  
            if (ff > 0) {
              let mid = ComputeMidCube(gg[k], gg[l]);
  
              let ff = IntersectCubes(aCubes[i], mid);
              if (ff > 0) {


              if (!FindCube(mid, used)) {
                intersect += ff;
                used.push(mid);
              }
            }
              if (!FindCube(mid, newGG))
                newGG.push(mid);
          }
        }
  
        if (newGG.length == 0)
          break;
  
        gg = newGG;
      }

      total += ComputeCubeArea(aCubes[i]) + intersect;
    }*/

   console.log(total + " " + i + " " + gg.length);   
  }

  return total;
}

let cubes = util.MapInput('./Day22TestInput2.txt', (aElem) => {

  let bb = aElem.split(' ');

  let cc = bb[1].split(',').map(a => {
    let hh = a.split('=');
    return hh[1].split('..').map(a => { return parseInt(a); });
  });

  return { state: (bb[0] == 'on'), x1: cc[0][0], x2: cc[0][1], y1: cc[1][0], y2: cc[1][1], z1: cc[2][0], z2: cc[2][1] };
}, '\r\n', this);

for (let i = 0; i < cubes.length; i++)
  console.log(i + " " + JSON.stringify(cubes[i]) + " " + ComputeCubeArea(cubes[i]));

//IntersectCubes(cubes[6], cubes[14]);

console.log(CountCubes(cubes, 50));

//IntersectCubes(cubes[0], cubes[1]);

//console.log(CountAllCubes(cubes));

console.log(CountOnCubes(cubes));
