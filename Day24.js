const util = require('./Util.js');

function InpInst(aVarMap, aOp, aInput) {
  aVarMap[aOp] = aInput.stream[aInput.pos];
  aInput.pos++;
}

function AddInst(aVarMap, aOp1, aOp2) {
    let op1 = GetOpValue(aOp1, aVarMap);
    let op2 = GetOpValue(aOp2, aVarMap);
  
  aVarMap[aOp1] = op1 + op2;
}

function MulInst(aVarMap, aOp1, aOp2) {
    let op1 = GetOpValue(aOp1, aVarMap);
    let op2 = GetOpValue(aOp2, aVarMap);
    
    aVarMap[aOp1] = op1 * op2;  
}

function DivInst(aVarMap, aOp1, aOp2) {
    let op1 = GetOpValue(aOp1, aVarMap);
    let op2 = GetOpValue(aOp2, aVarMap);
    
    aVarMap[aOp1] = Math.floor(op1 / op2);  
}

function ModInst(aVarMap, aOp1, aOp2) {
    let op1 = GetOpValue(aOp1, aVarMap);
    let op2 = GetOpValue(aOp2, aVarMap);
    
    aVarMap[aOp1] = op1 % op2;  
}

function EqualInst(aVarMap, aOp1, aOp2) {
    let op1 = GetOpValue(aOp1, aVarMap);
    let op2 = GetOpValue(aOp2, aVarMap);
    
    aVarMap[aOp1] = op1 == op2 ? 1 : 0;  
}

function ExecuteInst(aInst, aVarMap, aInput) {
  if (aInst.inst == 'inp')
    InpInst(aVarMap, aInst.op1, aInput);
  else if (aInst.inst == 'add')
    AddInst(aVarMap, aInst.op1, aInst.op2, aInput);
  else if (aInst.inst == 'mul')
    MulInst(aVarMap, aInst.op1, aInst.op2, aInput);    
  else if (aInst.inst == 'div')
    DivInst(aVarMap, aInst.op1, aInst.op2, aInput); 
  else if (aInst.inst == 'mod')
    ModInst(aVarMap, aInst.op1, aInst.op2, aInput);        
  else if (aInst.inst == 'eql')
    EqualInst(aVarMap, aInst.op1, aInst.op2, aInput); 
  else
    console.log("Invalid instruction");       
}

function RunProgram(aInsts, aVarMap, aInput, aStart, aEnd) {
    for (let i = aStart; i < aEnd; i++)
      ExecuteInst(aInsts[i], aVarMap, aInput);
}

function ParseOp(aOp) {
    if (aOp == 'x' || aOp == 'y' || aOp == 'z' || aOp == 'w')
      return aOp;
    else if (aOp == undefined)
      return null;
    else
     return parseInt(aOp);
}

function GetOpValue(aOp, aVarMap) {
    if (aOp == 'x' || aOp == 'y' || aOp == 'z' || aOp == 'w')
      return aVarMap[aOp];
    else 
      return aOp;
} 

function InputFromNumber(aNumber) {
  return { stream: aNumber.toString().split(''), pos: 0 };  
}

function PrintVarMap(aVarMap) {
    let line = '';
    for (let key in aVarMap) {
      if (line.length > 0)
        line += ', ';
      else
        line += '{ ';
      line += key + ": " + aVarMap[key];
    }
    line += ' }';
   return line; 
}

function TestSubProgram(aInsts, aIndex, aTestResultValue, aModelNumber, aState, aRecurse, aFindMax) {

  console.log(util.CopyObject(aModelNumber).reverse().join(''));

   if (aModelNumber.length == 14) {
    //if (aTestResultValue == 0)
     //  aResult.found = true;
      let msg = aFindMax ? "Largest model number: " : "Smallest model number: ";
      console.log(msg + aModelNumber.reverse().join(''));
      aState.found = true;
     return;
   }

   if (aState.found)
     return;

   let i = aFindMax ? 9 : 1;
   while ((aFindMax ? i > 0 : i < 10)) {

    if (aState.found)
      return;

    let searchRange = 26;
    if (aIndex < 13)
      searchRange = 10000;
    /*else if (aIndex < 8 && aIndex >= 6)
      searchRange = 100000;
    else 
      searchRange = 1000000;*/

    for (let j = 0; j < searchRange; j++) {

      if (aState.found)
      return;

    let varMap = [];
    varMap['x'] = 0;
    varMap['y'] = 0;
    varMap['z'] = j;
    varMap['w'] = 0;
    
    let input = { stream: [i], pos: 0 };
     RunProgram(aInsts, varMap, input, aIndex * 18, (aIndex + 1) * 18);

    //if (!aRecurse)
     // console.log(i + " " + " " +  varMap['z']);
     
     if (varMap['z'] == aTestResultValue) {
       let newModelNumber = util.CopyObject(aModelNumber);
       newModelNumber.push(i);
       if (aRecurse)
         TestSubProgram(aInsts, aIndex - 1, j, newModelNumber, aState, aRecurse, aFindMax);

       //console.log(i + " " + " " +  j);
     }
    }
    if (aFindMax)
      i--;
    else 
      i++;
   }

   //console.log("Not found: " + aIndex + " " + aTestResultValue);
}

let insts = util.MapInput('./Day24Input.txt', (aElem, aIndex) => {
    let rawInst = aElem.split(' ');
   
    return { inst: rawInst[0], op1: ParseOp(rawInst[1]), op2: ParseOp(rawInst[2]) };

  }, '\r\n', this);

console.log(insts);

let varMap = [];
varMap['x'] = 0;
varMap['y'] = 0;
varMap['z'] = 0;
varMap['w'] = 0;

//let input = { stream: [1, 3, 5, 7, 9, 2, 4, 6, 8, 9, 9, 9, 9, 9], pos: 0 };

//RunProgram(insts, varMap, input, 0, 14 * 18);

//console.log(varMap);

//FindMax(insts);

//let testResultValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 19, 0];

//for (let i = 0; i < 14; i++) {

//console.log();
TestSubProgram(insts, 13, 0, [], { found: false }, true, true);
TestSubProgram(insts, 13, 0, [], { found: false }, true, false);
//}