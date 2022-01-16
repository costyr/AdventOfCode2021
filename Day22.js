const util = require('./Util.js');

function ComputeTotal(aCubesMap) {
  let total = 0;
  for (let key in aCubesMap)
    if (aCubesMap[key] > 0)
      total++;
  return total;
}

function CountCubes(aCubes, aSize, aCubesCount) {
  let cubesMap = [];
  aCubes.map((a, aIndex) => {

    if (aIndex > aCubesCount - 1)
      return;

    let intersect = 0;
    let offIntersect = 0;
    for (let i = Math.max(-aSize, a.x1); i <= Math.min(a.x2, aSize); i++)
      for (let j = Math.max(-aSize, a.y1); j <= Math.min(a.y2, aSize); j++)
        for (let k = Math.max(-aSize, a.z1); k <= Math.min(a.z2, aSize); k++) {
          let ptId = i + "_" + j + "_" + k;

          if (cubesMap[ptId] == 1)
            intersect++;

          if (cubesMap[ptId] == 0)
            offIntersect++;

          cubesMap[ptId] = a.state ? 1 : 0;
        }

    //let total = ComputeTotal(cubesMap);
    //console.log(total + " " + aIndex + ": " + intersect + " " + offIntersect);

  }, this);

  return ComputeTotal(cubesMap);;
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

function IntersectCubes(aCube1, aCube2) {

  let xOverlap = Math.max(-1, Math.min(aCube1.x2, aCube2.x2) - Math.max(aCube1.x1, aCube2.x1)) + 1;
  let yOverlap = Math.max(-1, Math.min(aCube1.y2, aCube2.y2) - Math.max(aCube1.y1, aCube2.y1)) + 1;
  let zOverlap = Math.max(-1, Math.min(aCube1.z2, aCube2.z2) - Math.max(aCube1.z1, aCube2.z1)) + 1;

  let overlapArea = xOverlap * yOverlap * zOverlap;

  return overlapArea;
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

function ComputeInnerCube(aCube1, aCube2) {
  let innerCube = {
    x1: Math.max(aCube1.x1, aCube2.x1), x2: Math.min(aCube1.x2, aCube2.x2),
    y1: Math.max(aCube1.y1, aCube2.y1), y2: Math.min(aCube1.y2, aCube2.y2),
    z1: Math.max(aCube1.z1, aCube2.z1), z2: Math.min(aCube1.z2, aCube2.z2),
    state: true
  };

  return innerCube;
}

function ReduceIncludedCubes(aCubes) {
  while (1) {
    let found = false;
    for (let i = 0; i < aCubes.length; i++) {
      for (let j = i + 1; j < aCubes.length; j++) {
        if (IsIncluded(aCubes[i], aCubes[j])) {
          aCubes.splice(i, 1);
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
}

function ComputeCubesArea(aCubes) {
  let total = 0;
  for (let i = 0; i < aCubes.length; i++) {

    let ii = 0;
    let ee = [];
    for (let j = 0; j < i; j++) {
      let ff = IntersectCubes(aCubes[i], aCubes[j]);
      if (ff > 0) {
        ee.push(ComputeInnerCube(aCubes[i], aCubes[j]));
        ii += ff;
      }
    }

    if (ee.length == 2) {
      let ff = IntersectCubes(ee[0], ee[1]);
      if (ff > 0)
        ii -= ff;
    }
    else if (ee.length > 2)
      ii = ComputeCubesArea(ee);

    total += ComputeCubeArea(aCubes[i]) - ii;
  }

  return total;
}

function CountOnCubes(aCubes, aCubesCount) {

  let total = 0;
  for (let i = 0; i < aCubesCount; i++) {

    let ggOn = [];
    let ggOff = [];
    let ggOff2 = [];
    let ggOff3 = [];
    let ggOff4 = [];
    let ggOff5 = [];
    let ggOff6 = [];
    let ggOff7 = [];
    for (let j = 0; j < i; j++) {
      let ff = IntersectCubes(aCubes[i], aCubes[j]);

      if (ff > 0) {

        let mid = ComputeInnerCube(aCubes[i], aCubes[j]);


        if (!FindCube(mid, ggOn))
          ggOn.push(mid);

        if (aCubes[j].state) {

          for (let k = 0; k < ggOff.length; k++) {

            let vv = IntersectCubes(ggOff[k], mid);
            if (vv > 0) {
              let midOff = ComputeInnerCube(ggOff[k], mid);

              if (!FindCube(midOff, ggOff2)) {

                ggOff2.push(midOff);
              }
            }
          }

          for (let k = 0; k < ggOff3.length; k++) {
            let vv = IntersectCubes(ggOff3[k], mid);
            if (vv > 0) {

              let midOff = ComputeInnerCube(ggOff3[k], mid);

              if (!FindCube(midOff, ggOff4))
                ggOff4.push(midOff);
            }
          }

          for (let k = 0; k < ggOff5.length; k++) {
            let vv = IntersectCubes(ggOff5[k], mid);
            if (vv > 0) {

              let midOff = ComputeInnerCube(ggOff5[k], mid);

              if (!FindCube(midOff, ggOff6))
                ggOff6.push(midOff);
            }
          }
        }
        else {

          for (let k = 0; k < ggOff2.length; k++) {
            let vv = IntersectCubes(ggOff2[k], mid);
            if (vv > 0) {

              let midOff = ComputeInnerCube(ggOff2[k], mid);

              if (!FindCube(midOff, ggOff3))
                ggOff3.push(midOff);
            }
          }

          for (let k = 0; k < ggOff4.length; k++) {
            let vv = IntersectCubes(ggOff4[k], mid);
            if (vv > 0) {

              let midOff = ComputeInnerCube(ggOff4[k], mid);

              if (!FindCube(midOff, ggOff5))
                ggOff5.push(midOff);
            }
          }

          for (let k = 0; k < ggOff6.length; k++) {
            let vv = IntersectCubes(ggOff6[k], mid);
            if (vv > 0) {

              let midOff = ComputeInnerCube(ggOff6[k], mid);

              if (!FindCube(midOff, ggOff7))
                ggOff7.push(midOff);
            }
          }

          if (!FindCube(mid, ggOff))
            ggOff.push(mid);
        }

        //total -= ff;
      }
    }

    ReduceIncludedCubes(ggOn);

    let totalVV = 0;
    if (ggOff2.length > 0) {
      ReduceIncludedCubes(ggOff2);

      let uu = ComputeCubesArea(ggOff2);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV += uu;
    }

    if (ggOff3.length > 0) {
      ReduceIncludedCubes(ggOff3);

      let uu = ComputeCubesArea(ggOff3);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV -= uu;
    }

    if (ggOff4.length > 0) {
      ReduceIncludedCubes(ggOff4);

      let uu = ComputeCubesArea(ggOff4);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV += uu;
    }

    if (ggOff5.length > 0) {
      ReduceIncludedCubes(ggOff5);

      let uu = ComputeCubesArea(ggOff5);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV -= uu;
    }

    if (ggOff6.length > 0) {
      ReduceIncludedCubes(ggOff6);

      let uu = ComputeCubesArea(ggOff6);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV += uu;
    }

    if (ggOff7.length > 0) {
      ReduceIncludedCubes(ggOff7);

      let uu = ComputeCubesArea(ggOff7);

      //console.log("Found on/off partial intersection: " + uu);
      totalVV -= uu;
    }

    let ccOff = ComputeCubesArea(ggOff) - totalVV;

    cc = ComputeCubesArea(ggOn) - ccOff;

    if (aCubes[i].state)
      total += ComputeCubeArea(aCubes[i]) - cc;
    else
      total -= cc;

    //console.log(total + " " + i + " " + cc + " " + ccOff);
  }

  return total;
}

let cubes = util.MapInput('./Day22Input.txt', (aElem) => {

  let bb = aElem.split(' ');

  let cc = bb[1].split(',').map(a => {
    let hh = a.split('=');
    return hh[1].split('..').map(a => { return parseInt(a); });
  });

  return { state: (bb[0] == 'on'), x1: cc[0][0], x2: cc[0][1], y1: cc[1][0], y2: cc[1][1], z1: cc[2][0], z2: cc[2][1] };
}, '\r\n', this);

//for (let i = 0; i < cubes.length; i++)
//  console.log(i + " " + JSON.stringify(cubes[i]) + " " + ComputeCubeArea(cubes[i]));

console.log(CountCubes(cubes, 50, cubes.length));

console.log(CountOnCubes(cubes, cubes.length));
