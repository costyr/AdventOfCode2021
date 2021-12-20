const { toASCII } = require('punycode');
const util = require('./Util.js');

const kOrientationTransform = [1, -1];

function Create3DOrientationTransform() {

  let orientationTransform3D = [];
  for (let i = 0; i < kOrientationTransform.length; i++)
    for (let j = 0; j < kOrientationTransform.length; j++)
      for (let k = 0; k < kOrientationTransform.length; k++)
        orientationTransform3D.push([ kOrientationTransform[i], kOrientationTransform[j], kOrientationTransform[k]]);
  return orientationTransform3D;
}

function FindMinMax(aScannerBeacons) {

  let minMax = [];
  for (let i = 0; i < aScannerBeacons.length; i++)
  {
    let min = [ Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER ];
    let max = [ 0, 0, 0 ];

    for (let j = 0; j < aScannerBeacons[i].length; j++)
    {
      
        if (aScannerBeacons[i][j].x < min[0])
          min[0] = aScannerBeacons[i][j].x;

          if (aScannerBeacons[i][j].y < min[1])
          min[1] = aScannerBeacons[i][j].y;

          if (aScannerBeacons[i][j].z < min[2])
          min[2] = aScannerBeacons[i][j].z;
      
     
        if (aScannerBeacons[i][j].x > max[0])
          max[0] = aScannerBeacons[i][j].x;

        if (aScannerBeacons[i][j].y > max[1])
          max[1] = aScannerBeacons[i][j].y;

        if (aScannerBeacons[i][j].z > max[2])
          max[2] = aScannerBeacons[i][j].z;
    }
    
    minMax.push([ min[0], min[1], min[2], max[0], max[1], max[2] ]);
  }

  return minMax;
}

function GenerateAllBeaconPositions(aScannerBeacons, a3DOrientationTransform) {

  let all = [];
  for (let k = 0; k < a3DOrientationTransform.length; k++) {

    let hh = [];
    for (let i = 0; i < aScannerBeacons.length; i++)  {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh.push({ x :x, y: y, z: z});
      //hh.push({ x :y, y: z, z: x});
      //hh.push({ x :z, y: x, z: y});
   }

    let hh1 = []
    for (let i = 0; i < aScannerBeacons.length; i++)  {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      //hh.push({ x :x, y: y, z: z});
      hh1.push({ x :y, y: z, z: x});
      //hh.push({ x :z, y: x, z: y});
   }

   let hh2 = [];
    for (let i = 0; i < aScannerBeacons.length; i++)  {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      //hh.push({ x :x, y: y, z: z});
      //hh.push({ x :y, y: z, z: x});
      hh2.push({ x :z, y: x, z: y});
   }

   all.push(hh);
   all.push(hh1);
   all.push(hh2);
  }

 console.log (all.length);
  return all;
}

function Analize(aScanners, a3DOrientationTransform, aMinMax) {
  let bMap = []
  let hh = [];
  for (let i = 0; i < aScanners.length; i++)
    hh.push(GenerateAllBeaconPositions(aScanners[i], a3DOrientationTransform, aMinMax[i], bMap));

  for (let i = 0; i < a3DOrientationTransform.length; i++)
    for (let j = 0; j < a3DOrientationTransform.length; j++)
    for (let i1 = 0; i1 < a3DOrientationTransform.length; i1++)
    for (let j2 = 0; j2 < a3DOrientationTransform.length; j2++)
    for (let j3 = 0; j3 < a3DOrientationTransform.length; j3++)
  {
    let oo = [];
    for (let u = 0; u < hh[0][i].length; u++)
      oo.push[hh[0][i][u].x + "_" + hh[0][i][u].y + "_" + hh[0][i][u].z] = 0;
    for (let k = 0; k < hh[1][j].length; k++)
      oo[hh[1][j][k].x + "_" + hh[1][j][k].y + "_" + hh[1][j][k].z] = 0;

      for (let u1 = 0; u1 < hh[0][i].length; u1++)
      oo.push[hh[2][i1][u1].x + "_" + hh[2][i1][u1].y + "_" + hh[2][i1][u1].z] = 0;
    
      for (let k1 = 0; k1 < hh[1][j].length; k1++)
      oo[hh[3][j2][k1].x + "_" + hh[3][j2][k1].y + "_" + hh[3][j2][k1].z] = 0;

      for (let k3 = 0; k3 < hh[1][j].length; k3++)
      oo[hh[4][j3][k3].x + "_" + hh[4][j3][k3].y + "_" + hh[4][j3][k3].z] = 0;

    //console.log(oo);
          
  }
      
  //console.log(JSON.stringify(hh, null, 2));
  return bMap;
}

let total = 0;

let scanners = util.MapInput('./Day19TestInput2.txt', (aElem) => {

  let beacons = aElem.split('\r\n').splice(1).map((aRawCoord) => { 
    let coords = aRawCoord.split(','); 
    return {x: parseInt(coords[0]), y: parseInt(coords[1]), z: parseInt(coords[2])};
  } );
  
  total += beacons.length;

  return beacons;
}, '\r\n\r\n', this);

console.log(scanners);

console.log(total);

let tt = Create3DOrientationTransform();

let mm =GenerateAllBeaconPositions(scanners[0], tt);

console.log(mm);

//console.log(Analize(scanners, tt, mm));