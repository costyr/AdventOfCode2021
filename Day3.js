const util = require('./Util.js');

function Analize(aNumbers) {
  let count = [];

  for (let i = 0; i < aNumbers[0].v.length; i++)
    count[i] = { z: 0, o: 0 };

  for (let i = 0; i < aNumbers.length; i++) {
    for (let j = 0; j < aNumbers[i].v.length; j++) {
      let nr = parseInt(aNumbers[i].v[j], 10);
      if (nr > 0)
        count[j].o++;
      else
        count[j].z++;
    }
  }

  let gama = '';
  for (let i = 0; i < count.length; i++)
    if (count[i].z > count[i].o)
      gama += '0';
    else
      gama += '1';

  let epsilon = '';
  for (let i = 0; i < count.length; i++)
    if (count[i].z < count[i].o)
      epsilon += '0';
    else
      epsilon += '1';

  return { v: parseInt(gama, 2) * parseInt(epsilon, 2), g: gama, e: epsilon };
}

function AnalizeO(aNumbers, aMask) {

  let rr = aNumbers.length;
  for (let k = 0; k < aMask.length; k++) {

    let zCount = 0;
    let oCount = 0;

    if (rr == 1)
      break;

    for (let i = 0; i < aNumbers.length; i++) {
      if (aNumbers[i].d)
        continue;


      if (aNumbers[i].v[k] != aMask[k]) {
        aNumbers[i].d = true;
        rr--;
      }
      else {
        if ((k + 1) < aMask.length) {
          if (parseInt(aNumbers[i].v[k + 1], 10) > 0)
            oCount++;
          else
            zCount++;
        }
      }
    }

    if ((k + 1) < aMask.length) {
      if (zCount > oCount)
        aMask[k + 1] = '0';
      else
        aMask[k + 1] = '1';
    }
  }

  for (let i = 0; i < aNumbers.length; i++)
    if (!aNumbers[i].d) {
      let nn = "";
      for (let j = 0; j < aNumbers[i].v.length; j++)
        nn += aNumbers[i].v[j];

      return parseInt(nn, 2);
    }

}

function AnalizeC02(aNumbers, aMask) {

  let rr = aNumbers.length;
  for (let k = 0; k < aMask.length; k++) {

    let zCount = 0;
    let oCount = 0;

    if (rr == 1)
      break;

    for (let i = 0; i < aNumbers.length; i++) {
      if (aNumbers[i].d)
        continue;


      if (aNumbers[i].v[k] != aMask[k]) {
        aNumbers[i].d = true;
        rr--;
      }
      else {
        if ((k + 1) < aMask.length) {
          if (parseInt(aNumbers[i].v[k + 1], 10) > 0)
            oCount++;
          else
            zCount++;
        }
      }
    }

    if ((k + 1) < aMask.length) {
      if (zCount <= oCount)
        aMask[k + 1] = '0';
      else
        aMask[k + 1] = '1';
    }
  }

  for (let i = 0; i < aNumbers.length; i++)
    if (!aNumbers[i].d) {

      let nn = "";
      for (let j = 0; j < aNumbers[i].v.length; j++)
        nn += aNumbers[i].v[j];

      return parseInt(nn, 2);
    }

}

let numbers = util.MapInput('./Day3Input.txt', (aElem) => {
  return { v: aElem.split(''), d: false };
}, '\r\n');

let r = Analize(numbers);

console.log(r.v);

let oo = AnalizeO(numbers, r.g.split(''));

for (let i = 0; i < numbers.length; i++)
  numbers[i].d = false;

let c02 = AnalizeC02(numbers, r.e.split(''));

console.log(oo * c02);
