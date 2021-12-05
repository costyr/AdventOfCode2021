const util = require('./Util.js');
const matrix = require('./Matrix.js');

function IsHorzLine(aLineCoords) {
  if ((aLineCoords.y1 == aLineCoords.y2) &&
    (aLineCoords.x1 != aLineCoords.x2))
    return true;
  return false;
}

function IsVertLine(aLineCoords) {
  if ((aLineCoords.y1 != aLineCoords.y2) &&
    (aLineCoords.x1 == aLineCoords.x2))
    return true;
  return false;
}

function DrawLine(aMap, aLineCoords, aDrawAllLines) {

  if (IsHorzLine(aLineCoords)) {
    let startX = aLineCoords.x1;
    let endX = aLineCoords.x2;

    if (startX > endX) {
      startX = aLineCoords.x2;
      endX = aLineCoords.x1;
    }

    for (let i = startX; i <= endX; i++) {
      let val = aMap.GetValue(aLineCoords.y1, i);
      aMap.SetValue(aLineCoords.y1, i, val + 1);
    }
  }
  else if (IsVertLine(aLineCoords)) {
    let startY = aLineCoords.y1;
    let endY = aLineCoords.y2;

    if (startY > endY) {
      startY = aLineCoords.y2;
      endY = aLineCoords.y1;
    }

    for (let i = startY; i <= endY; i++) {
      let val = aMap.GetValue(i, aLineCoords.x1);
      aMap.SetValue(i, aLineCoords.x1, val + 1);
    }
  }
  else if (aDrawAllLines) {

    let x1 = aLineCoords.x1;
    let y1 = aLineCoords.y1;

    let x2 = aLineCoords.x2;
    let y2 = aLineCoords.y2;

    let i = x1;
    let j = y1;
    if (x1 < x2) {
      if (y1 < y2) {
        for (; i <= x2 && j <= y2; i++, j++) {
          let val = aMap.GetValue(j, i);
          aMap.SetValue(j, i, val + 1);
        }
      }
      else
        for (; i <= x2 && j >= y2; i++, j--) {
          let val = aMap.GetValue(j, i);
          aMap.SetValue(j, i, val + 1);
        }
    }
    else {
      if (y1 < y2) {
        for (; i >= x2 && j <= y2; i--, j++) {
          let val = aMap.GetValue(j, i);
          aMap.SetValue(j, i, val + 1);
        }
      }
      else
        for (; i >= x2 && j >= y2; i--, j--) {
          let val = aMap.GetValue(j, i);
          aMap.SetValue(j, i, val + 1);
        }
    }
  }
}

function DrawLines(aLines, aWidth, aHeight, aDrawAllLines) {

  let map = new matrix.Matrix(aWidth, aHeight, 0);

  for (let i = 0; i < aLines.length; i++)
    DrawLine(map, aLines[i], aDrawAllLines);

  let count = 0;
  for (let i = 0; i < map.mMatix.length; i++)
    for (let j = 0; j < map.mMatix[i].length; j++)
      if (map.mMatix[i][j] > 1)
        count++;

  //map.Print('', (aElem)=>{  return aElem == 0 ? '.' : aElem;});
  return count;
}

function FindMinMax(aLines) {

  let max = 0;
  for (let i = 0; i < aLines.length; i++) {
    if (aLines[i].x1 > max)
      max = aLines[i].x1;
    if (aLines[i].x2 > max)
      max = aLines[i].x2;

    if (aLines[i].y1 > max)
      max = aLines[i].y1;
    if (aLines[i].y2 > max)
      max = aLines[i].y2;

  }

  return max + 1;
}

let lines = util.MapInput('./Day5Input.txt', (aElem) => {
  let rawPoints = aElem.split(' -> ');

  let start = rawPoints[0].split(',');
  let end = rawPoints[1].split(',');

  return { x1: parseInt(start[0]), y1: parseInt(start[1]), x2: parseInt(end[0]), y2: parseInt(end[1]) };
}, '\r\n');

let max = FindMinMax(lines);

let count = DrawLines(lines, max, max, false);

console.log(count);

count = DrawLines(lines, max, max, true);

console.log(count);
