const util = require('./Util.js');

const kOrientationTransform = [1, -1];

function Create3DOrientationTransform() {

  let orientationTransform3D = [];
  for (let i = 0; i < kOrientationTransform.length; i++)
    for (let j = 0; j < kOrientationTransform.length; j++)
      for (let k = 0; k < kOrientationTransform.length; k++)
        orientationTransform3D.push([kOrientationTransform[i], kOrientationTransform[j], kOrientationTransform[k]]);
  return orientationTransform3D;
}

const tt = Create3DOrientationTransform();

function ExistsTransform(aAll, aTransform) {
  for (let i = 0; i < aAll.length; i++) {
    let found = true;
    for (let j = 0; j < aTransform.length; j++)
      if (aTransform[j].x != aAll[i][j].x ||
        aTransform[j].y != aAll[i][j].y ||
        aTransform[j].z != aAll[i][j].z) {
        found = false;
        break;
      }
    if (found)
      return true;
  }

  return false;
}

function GenerateAllBeaconPositions(aScannerBeacons, a3DOrientationTransform) {

  let all = [];
  for (let k = 0; k < a3DOrientationTransform.length; k++) {

    let hh = [];
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh.push({ x: x, y: y, z: z });
    }

    let hh4 = [];
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh4.push({ x: x, y: z, z: y });
    }

    let hh1 = []
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh1.push({ x: y, y: z, z: x });
    }

    let hh5 = []
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh5.push({ x: y, y: x, z: z });
    }

    let hh2 = [];
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh2.push({ x: z, y: x, z: y });
    }

    let hh6 = [];
    for (let i = 0; i < aScannerBeacons.length; i++) {

      let x = aScannerBeacons[i].x * a3DOrientationTransform[k][0];
      let y = aScannerBeacons[i].y * a3DOrientationTransform[k][1];
      let z = aScannerBeacons[i].z * a3DOrientationTransform[k][2];

      hh6.push({ x: z, y: y, z: x });
    }

    if (!ExistsTransform(all, hh))
      all.push(hh);

    if (!ExistsTransform(all, hh1))
      all.push(hh1);

    if (!ExistsTransform(all, hh2))
      all.push(hh2);

    if (!ExistsTransform(all, hh4))
      all.push(hh4);

    if (!ExistsTransform(all, hh5))
      all.push(hh5);

    if (!ExistsTransform(all, hh6))
      all.push(hh6);
  }

  return all;
}

function VerifyRelativeScannerPosition(aZeroBasedBeacons, aScannerBeacons, aX, aY, aZ) {
  let sameBeacons = [];
  for (let i = 0; i < aZeroBasedBeacons.length; i++)
    for (let j = 0; j < aScannerBeacons.length; j++)
      if ((aScannerBeacons[j].x + aX == aZeroBasedBeacons[i].x) &&
        (aScannerBeacons[j].y + aY == aZeroBasedBeacons[i].y) &&
        (aScannerBeacons[j].z + aZ == aZeroBasedBeacons[i].z))
        sameBeacons.push(aScannerBeacons[j]);

  return sameBeacons;
}

function ComputeDiffBeacons(aScannerBeacons, aExclude) {
  let diffBeacons = [];

  for (let i = 0; i < aScannerBeacons.length; i++) {
    let bb = aScannerBeacons[i];
    let index = aExclude.findIndex(aElem => { return aElem.x == bb.x && aElem.y == bb.y && aElem.z == bb.z; });

    if (index == -1)
      diffBeacons.push(bb);
  }

  return diffBeacons;
}

function FindRelativeScannerPosition(aZeroBasedBeacons, aScannerBeacons) {

  let max = 0;
  for (let i = 0; i < aZeroBasedBeacons.length; i++)
    for (let j = 0; j < aScannerBeacons.length; j++) {
      let x = aZeroBasedBeacons[i].x - aScannerBeacons[j].x;
      let y = aZeroBasedBeacons[i].y - aScannerBeacons[j].y;
      let z = aZeroBasedBeacons[i].z - aScannerBeacons[j].z;

      let sameBeacons = VerifyRelativeScannerPosition(aZeroBasedBeacons, aScannerBeacons, x, y, z);

      if (sameBeacons.length >= 12) {

        let diffBeacons = ComputeDiffBeacons(aScannerBeacons, sameBeacons);
        return { coord: { x: x, y: y, z: z }, diffBeacons: diffBeacons, count: sameBeacons.length };
      }
    }

  return { coord: { x: Number.MAX_SAFE_INTEGER, y: 0, z: 0 }, diffBeacons: [], count: 0 };
}

function SearchRelativeScannerPositionInMultivers(aAllScanners, aZeroBasedBeacons, aScannerBeaconsIndex) {

  for (let j = 0; j < aAllScanners[aScannerBeaconsIndex].length; j++) {
    let result = FindRelativeScannerPosition(aZeroBasedBeacons, aAllScanners[aScannerBeaconsIndex][j]);

    if (result.coord.x < Number.MAX_SAFE_INTEGER) {
      for (let k = 0; k < result.diffBeacons.length; k++) {

        let x = result.coord.x + result.diffBeacons[k].x;
        let y = result.coord.y + result.diffBeacons[k].y;
        let z = result.coord.z + result.diffBeacons[k].z;

        aZeroBasedBeacons.push({ x: x, y: y, z: z });
      }
      return { z: 0, b: j, pos: result.coord, count: result.count };
    }
  }

  return { z: -1 };
}

function ReduceBeacons(aScanners, aAllScanners) {
  let merged = [];

  let zeroBasedBeacons = [...aScanners[0]];

  let scanners = [{ x: 0, y: 0, z: 0 }];
  while (1) {

    let found = false;

    for (let j = 1; j < aScanners.length; j++) {
      if (merged[j] === undefined) {
        let ret = SearchRelativeScannerPositionInMultivers(aAllScanners, zeroBasedBeacons, j);
        if (ret.z != -1) {
          console.log("Scanner " + j + " position relative to 0: ");

          scanners[j] = ret.pos;

          console.log(ret.pos);
          found = true;

          merged[j] = 0;
        }
      }
    }
    if (!found)
      break;
  }

  let maxDist = 0;
  for (let i = 0; i < scanners.length; i++)
    for (let j = i + 1; j < scanners.length; j++) {
      dist = Math.abs(scanners[i].x - scanners[j].x) +
        Math.abs(scanners[i].y - scanners[j].y) +
        Math.abs(scanners[i].z - scanners[j].z);

      if (dist > maxDist)
        maxDist = dist;
    }

  return { part1: zeroBasedBeacons.length, part2: maxDist };
}

let scanners = util.MapInput('./Day19Input.txt', (aElem) => {

  let beacons = aElem.split('\r\n').splice(1).map((aRawCoord) => {
    let coords = aRawCoord.split(',');
    return { x: parseInt(coords[0]), y: parseInt(coords[1]), z: parseInt(coords[2]) };
  });

  return beacons;
}, '\r\n\r\n', this);

let allScanners = [];
for (let i = 0; i < scanners.length; i++)
  allScanners.push(GenerateAllBeaconPositions(scanners[i], tt));

let result = ReduceBeacons(scanners, allScanners);

console.log(result.part1);
console.log(result.part2);
