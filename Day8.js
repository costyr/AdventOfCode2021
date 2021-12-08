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
    }

  }

  for (let key in aEncodingMap) {

    let value = aEncodingMap[key];

    if (value.code == -1) {
      let nn1 = key.split('');
      nn1.push(key1.key[0]);
      let nn1_ = nn1.sort().join('');

      let nn2 = key.split('');
      nn2.push(key1.key[1]);
      let nn2_ = nn2.sort().join('');

      if (nn1_ == key9.key || nn2_ == key9.key) {
        value.code = 5;
        value.p = [5]
      }
    }

  }

  for (let key in aEncodingMap) {

    let value = aEncodingMap[key];

    if (value.code == -1) {
      value.code = 2;
      value.p = [2]
    }
  }

  //console.log(aEncodingMap);
}

function Analize2(aSegments) {

  let total = 0;
  for (let i = 0; i < aSegments.length; i++) {

    let encodingMap = [];
    for (let j = 0; j < aSegments[i].l.length; j++) {
      let ff = aSegments[i].l[j];
      if (ff.length == 2)
        encodingMap[ff] = { code: 1, p: [0, 9] };
      else if (ff.length == 3)
        encodingMap[ff] = { code: 7, p: [0, 3, 9] };
      else if (aSegments[i].l[j].length == 4)
        encodingMap[ff] = { code: 4, p: [9] };
      else if (aSegments[i].l[j].length == 5)
        encodingMap[ff] = { code: -1, p: [2, 3, 5] };
      else if (aSegments[i].l[j].length == 6)
        encodingMap[ff] = { code: -1, p: [0, 6, 9] };
      else if (aSegments[i].l[j].length == 7)
        encodingMap[ff] = { code: 8, p: [] };
    }

    Decode(encodingMap);

    let factor = 1000;
    let number = 0;
    for (let j = 0; j < aSegments[i].r.length; j++) {

      let ff = aSegments[i].r[j];

      number += factor * encodingMap[ff].code;
      factor /= 10;
    }

    total += number;

  }

  return total;
}

let segments = util.MapInput('./Day8Input.txt', (aElem) => {
  let raw = aElem.split(' | ');
  return { l: raw[0].split(' ').map(aElem => aElem.split('').sort().join('')), r: raw[1].split(' ').map(aElem => aElem.split('').sort().join('')) };
}, '\r\n');

//console.log(segments);

console.log(Analize(segments));

console.log(Analize2(segments));
