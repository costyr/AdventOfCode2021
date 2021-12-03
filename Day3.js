const util = require('./Util.js');

function Analize(aNumbers) {
  let count = [];

  for (let i = 0; i < 5; i++)
    count[i] = { z: 0, o: 0};

  for (let i = 0; i < aNumbers.length; i++) {
    for (let j = 0; j < aNumbers[i].v.length; j++)
    {
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

  console.log(gama);
  console.log(epsilon);

  return parseInt(gama, 2) * parseInt(epsilon, 2);
}

function Analize2(aNumbers, aMask) {
  
  for (let k = 0; k < aMask.length; k++) {

   let zCount = 0;
   let oCount = 0;
   console.log(k);
  for (let i = 0; i < aNumbers.length; i++) {
    if (aNumbers[i].d)
      continue;

    
   if (aNumbers[i].v[k] != aMask[k])
     aNumbers[i].d = true;
   else
   {
     console.log(aNumbers[i]);

     if ((k + 1) < aMask.length)
     {
      if (parseInt(aNumbers[i].v[k+1], 10) > 0)
        oCount ++;
      else 
        zCount ++;
     }  
   }   
  }
  
  if ((k + 1) < aMask.length)
    {
      if (zCount > oCount)
        aMask[k+1] = '0';
      else 
       aMask[k+1] = '1';  
    }
  }

  console.log(aMask);

  for (let i = 0; i < aNumbers.length; i++)
    if (!aNumbers[i].d)
      console.log(aNumbers[i]);
 
}

let numbers = util.MapInput('./Day3TestInput.txt', (aElem) => { 
  return { v: aElem.split(''), d: false}; 
}, '\r\n');

console.log(numbers);

console.log(Analize(numbers));
console.log(Analize2(numbers, "10110"));
