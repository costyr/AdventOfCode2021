const { count } = require('console');
const util = require('./Util.js');

function IsNumeric(aChar) {
  if (aChar >= '0' && aChar <= '9')
    return true;
  return false;
}

function CountNested(aStack) {
  let count = 0;
  for (let i = 0; i < aStack.length; i++)
    if (aStack[i] == ']')
      count--;
    else if (aStack[i] == '[')
      count ++;

  return count;
}

function SplitNumber(aStack) {
  if (aStack[aStack.length - 1] > 9)
  {
    let ss = aStack.pop();
    let ll = Math.floor(ss / 2);
    let rr = Math.ceil(ss / 2);

    aStack.push('[');
    aStack.push(ll);
    aStack.push(rr);
    aStack.push(']');

    return true;
  }

  return false;
}

function ExplodeSplitSnailfishNumber(aNumber, aExplode) {

  let stack = [];
  let state = 0;
  let right = 0;
  let exploded = false;
  let splited = false;
  let willExplode = false;
  for (let i = 0; i < aNumber.length; i++) {
    switch (state) {
      case 0:
        {
          if (aNumber[i] == '[') {
            stack.push('[');
            
            if (!willExplode)
              willExplode = (CountNested(stack) > 4);
          }
          else if (IsNumeric(aNumber[i])) {
            let nr = parseInt(aNumber[i]);
            stack.push(nr);

            state = 1;
          }
          else if (aNumber[i] == ']') {
            if (aExplode && willExplode && (!exploded && !splited)) {
              right = stack.pop();
              let left = stack.pop();
              stack.pop();

              let ii = -1;
              for (let k = stack.length - 1; k >= 0; k--)
              if (stack[k] != '[' && stack[k] != ']') {
                ii = k;
                break;
              };

              if (ii != -1)
                stack[ii] += left;
              
              stack.push(0);

              exploded = true;
            }
            else {
              stack.push(']');
            }
          }
          break;
        }
      case 1:
        {
          if (aNumber[i] == ',' || aNumber[i] == ']') {
            state = 0;
            if (aNumber[i] == ']')
              i--;
            
            if (!aExplode && !exploded && !splited)
              splited = SplitNumber(stack);

            if (right > 0) {
              stack.push(stack.pop() + right);  
              right = 0;
            }
          }
          else {
            stack.push(stack.pop() * 10 + parseInt(aNumber[i]));
          }
          break;
        }
    }
  }

  let newNumber = '';
  for (let i = 0; i < stack.length; i++) {
    if (stack[i] == '[' || stack[i] == ']') {
      newNumber += stack[i];

      if ((i + 1) < stack.length && stack[i] == ']' && stack[i + 1] != ']')
        newNumber += ",";
    }
    else
    {
      newNumber += stack[i];
      if ((i + 1) < stack.length && stack[i + 1] != ']')
          newNumber += ",";
    }
  }

  /*if (exploded) 
    process.stdout.write("exploded -> ");
  if (splited) 
    process.stdout.write("splited  -> ");*/

  return { e: exploded || splited, v: newNumber };
}

function ReduceSnailfishNumber(aNumber) {
  
  //console.log(aNumber);

  let number = aNumber;
  while (1) {
    let result = ExplodeSplitSnailfishNumber(number, true);

    if (result.e) {
      //console.log(result.v/*.replace(/\[|\]/g, '')*/);  
      number = result.v;
      continue;
    }

    let result2 = ExplodeSplitSnailfishNumber(number, false);

    if (result2.e)
    {
      //console.log(result2.v/*.replace(/\[|\]/g, '')*/);  
      number = result2.v;
      continue;
    }

    return number;
  }
}

function Mag(aVal1, aVal2) {
  return 3 * aVal1 + 2 * aVal2;
}

function AddSnailfishNumbers(aNr1, aNr2) {
  let addedNumber = '[' + aNr1 + "," + aNr2 + "]";
  return ReduceSnailfishNumber(addedNumber);
}

function FindMax(aSnailfishNumbers) {

  let max = 0;
  for (let i = 0; i < aSnailfishNumbers.length; i++)
    for (let j = 0; j < aSnailfishNumbers.length; j++)
    {
      if (i != j)
      {
        let nn1 = AddSnailfishNumbers(snailfishNumbers[i], snailfishNumbers[j]);

        let m1 = eval(nn1.replace(/\[/g, 'Mag(').replace(/\]/g, ')'));

        if (m1 > max)
          max = m1;

        let nn2 = AddSnailfishNumbers(snailfishNumbers[j], snailfishNumbers[i]);

        let m2 = eval(nn2.replace(/\[/g, 'Mag(').replace(/\]/g, ')'));

        if (m2 > max)
          max = m2;
      }
    }

  return max;
}

let snailfishNumbers = util.MapInput('./Day18Input.txt', (aElem) => {
  return aElem;
}, '\r\n');

//console.log(snailfishNumbers);

//console.log(ReduceSnailfishNumber('[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]'));
//console.log(ExplodeSplitSnailfishNumber('[[[[0,7],4],[7,[[8,4],9]]],[1,1]]').v);
//console.log(ExplodeSplitSnailfishNumber('[[[[0,7],4],[15,[0,13]]],[1,1]]').v);
//console.log(ReduceSnailfishNumber('[[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]]'));

//console.log(ReduceSnailfishNumber('[[[[4,0],[5,4]],[[7,7],[6,0]]],[[7,[5,5]],[[5,7],[[0,11],[8,8]]]]]'));

//console.log(ReduceSnailfishNumber('[[[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]],[2,9]]'));

let nn = snailfishNumbers[0];
for (let i = 1; i < snailfishNumbers.length; i++) {
  //console.log();
  //console.log(nn);
  //console.log(snailfishNumbers[i]);
nn = AddSnailfishNumbers(nn, snailfishNumbers[i]);
//console.log(nn);
}

//console.log(nn);

console.log(eval(nn.replace(/\[/g, 'Mag(').replace(/\]/g, ')')));

console.log(FindMax(snailfishNumbers));