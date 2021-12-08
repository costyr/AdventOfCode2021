const util = require('./Util.js');

function Analize(aSegments) {

  let mm = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < aSegments.length; i++) 
     for (let j = 0; j < aSegments[i].r.length; j++)
       mm[aSegments[i].r[j].length] += 1;

  return mm[2] + mm[3] + mm[4] + mm[7];
}

function Decode(aEncodingMap) {
  for (let key in aEncodingMap) {
    console.log(key + "=>" + aEncodingMap[key]);
  }   
}

function Analize2(aSegments) {
  for (let i = 0; i < aSegments.length; i++) {

    let encodingMap = [];
    for (let j = 0; j < aSegments[i].l.length; j++)
    {
      let ff = aSegments[i].l[j];
      if (ff.length == 2)
        encodingMap[ff] = { code: 1, p: [ 0, 9 ] };
      else if (ff.length == 3) 
        encodingMap[ff] = { code: 7, p: [ 0, 3, 9 ] };
      else if (aSegments[i].l[j].length == 4)
        encodingMap[ff] = { code: 4, p: [ 9 ] };
      else if (aSegments[i].l[j].length == 5)
        encodingMap[ff] = { code: -1, p: [ 2, 3, 5 ] };
      else if (aSegments[i].l[j].length == 6) 
        encodingMap[ff] = { code: -1, p: [ 0, 6, 9 ] };
      else if (aSegments[i].l[j].length == 7) 
        encodingMap[ff] = { code: 8, p: [] };
    }

    console.log(encodingMap);
    
    Decode(encodingMap);
  }              
}

let segments = util.MapInput('./Day8TestInput2.txt', (aElem) => {
  let raw = aElem.split(' | ');
  return { l: raw[0].split(' ').map(aElem => aElem.split('').sort().join('')), r: raw[1].split(' ').map(aElem => aElem.split('').sort().join(''))};
}, '\r\n');

console.log(segments);

console.log(Analize(segments));

Analize2(segments);
