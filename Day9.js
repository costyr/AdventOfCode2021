const { parse } = require('path/posix');
const util = require('./Util.js');

function Analize(aSegments) {

  let mm = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < aSegments.length; i++)
    for (let j = 0; j < aSegments[i].r.length; j++)
      mm[aSegments[i].r[j].length] += 1;

  return mm[2] + mm[3] + mm[4] + mm[7];
}

function ContainsSegment(aSegment, aSubSegment) {
  for (let i = 0; i < aSubSegment.length; i++)
    if (aSegment.indexOf(aSubSegment[i]) == -1)
      return false;
  return true;
}

function Decode(aEncodingMap) {

  let key7 = null;
  let key1 = null;
  let key9 = null;

  let count = 4;
  while (count > 3) {
    count = 0;
    for (let key in aEncodingMap) {

      let value = aEncodingMap[key];

      if (value.code == -1) {
        count++;
        for (let key2 in aEncodingMap) {
          let valueX = aEncodingMap[key2];

          if (valueX.code != -1) {
            if (!ContainsSegment(key, key2)) {
              for (let i = 0; i < valueX.p.length; i++) {
                let index = value.p.indexOf(valueX.p[i]);
                if (index != -1)
                  value.p.splice(index, 1);
              }

              let index = value.p.indexOf(valueX.code);
              if (index != -1)
                value.p.splice(index, 1);

              if (value.p.length == 1)
                aEncodingMap[key].code = value.p[0];
            }
          }
        }
      }
      else {
        if (value.code == 7 && !key7)
          key7 = { key: key, p: value.p };

        if (value.code == 1 && !key1)
          key1 = { key: key, p: value.p };

        if (value.code == 9 && !key9)
          key9 = { key: key, p: value.p };
      }

    }

  }

  for (let key in aEncodingMap) {

    let value = aEncodingMap[key];

    if (value.code == -1) {
      if (ContainsSegment(key, key7.key)) {
        value.code = 3;
        value.p = [3];
      }
      else {
        let nn1 = (key + key1.key[0]).split('').sort().join('');
        let nn2 = (key + key1.key[1]).split('').sort().join('');

        if (nn1 == key9.key || nn2 == key9.key) {
          value.code = 5;
          value.p = [5]
        }
        else {
          value.code = 2;
          value.p = [2]
        }
      }
    }

  }
}

function GetN(aMap, aX, aY) {
  let pp = [];
  const neighboursTransform = [ [0 , 1], [ 0, -1], [ 1, 0], [ -1, 0] ];
  for (let k = 0; k < neighboursTransform.length; k++)
      {
        let x = aX + neighboursTransform[k][0];
        let y = aY + neighboursTransform[k][1];

        if (x >= 0 && x < aMap[aX].length && y >= 0 && y < aMap.length)
        {
          pp.push(aMap[y][x]);
        }
      }
  return pp;
}

function Analize2(aMap) {
  
  const neighboursTransform = [ [0 , 1], [ 0, -1], [ 1, 0], [ -1, 0] ];

  let total = 0;
  for(let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
    {
      let isMin = true;
      for (let k = 0; k < neighboursTransform.length; k++)
      {
        let x = j + neighboursTransform[k][0];
        let y = i + neighboursTransform[k][1];

        if (x >= 0 && x < aMap[i].length && y >= 0 && y < aMap.length)
        {
          let nn = aMap[y][x];

          if (nn <= aMap[i][j]) {
            isMin = false;
            break;
          }
        }
      }

      if (isMin) {
        total += aMap[i][j] + 1;
        console.log(i + " " + j + " " + aMap[i][j] + " " + GetN(aMap, j, i));
      }
    }

  return total;
}

let map = util.MapInput('./Day9Input.txt', (aElem) => {
  return aElem.split('').map(a=> parseInt(a));
}, '\r\n');

console.log(map);

//console.log(Analize(segments));

console.log(Analize2(map));
