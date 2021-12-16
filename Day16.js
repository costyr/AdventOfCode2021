const util = require('./Util.js');

function AddF(...aArgs) {
  let total = 0;
  for (let i = 0; i < arguments.length; i++)
    total += arguments[i];
  return total;
}

function MulF(...aArgs) {
  let total = 1;
  for (let i = 0; i < arguments.length; i++)
    total *= arguments[i];
  return total;
}

function MinF(...aArgs) {
  return Math.min(...aArgs);
}

function MaxF(...aArgs) {
  return Math.max(...aArgs);
}

function GreaterThanF(aParam1, aParam2) {
  if (aParam1 > aParam2)
    return 1;
  return 0;
}

function LessThanF(aParam1, aParam2) {
  if (aParam1 < aParam2)
    return 1;
  return 0;
}

function EqualF(aParam1, aParam2) {
  if (aParam1 == aParam2)
    return 1;
  return 0;
}

function GetOp(aType) {
  if (aType == 0)
    return "AddF";
  else if (aType == 1)
    return "MulF";
  else if (aType == 2)
    return "MinF";
  else if (aType == 3)
    return "MaxF";
  else if (aType == 5)
    return "GreaterThanF";
  else if (aType == 6)
    return "LessThanF";
  else if (aType == 7)
    return "EqualF";
  return "";
}

function EvalOp(aType, ...aArgs) {
  if (aType == 0)
    return AddF(...aArgs);
  else if (aType == 1)
    return MulF(...aArgs);
  else if (aType == 2)
    return MinF(...aArgs);
  else if (aType == 3)
    return MaxF(...aArgs);
  else if (aType == 5)
    return GreaterThanF(...aArgs);
  else if (aType == 6)
    return LessThanF(...aArgs);
  else if (aType == 7)
    return EqualF(...aArgs);
  return 0;
}

function DecodePackage(aRawPackets, aTotal) {

  if (aRawPackets.length == 0)
    return { l: 0, exp: '', ret: 0 };

  let version = parseInt(aRawPackets.substring(0, 3), 2);
  let type = parseInt(aRawPackets.substring(3, 6), 2);

  aTotal.verSum += version;

  if (type != 4) {
    let lengthType = parseInt(aRawPackets.substring(6, 7), 10);

    let packageLength = 3 + 3 + 1;
    if (lengthType == 0) {
      let pp = aRawPackets.substring(7, 22);
      let totalSubPackLength = parseInt(pp, 2);

      //console.log("ss " + subPackLength);

      let offset = packageLength + 15;
      let subPackLength = totalSubPackLength;

      let exp = '';
      let retValues = [];
      while (subPackLength > 0) {
        let dd = DecodePackage(aRawPackets.substring(offset), total);
        subPackLength -= dd.l;
        offset += dd.l;

        if (exp.length > 0)
          exp += ', ';
        exp += dd.exp;

        retValues.push(dd.ret);
      }

      let fullExp = GetOp(type);
      fullExp += '(' + exp + ')';

      let nextRet = EvalOp(type, ...retValues);

      return { l: packageLength + 15 + totalSubPackLength, exp: fullExp, ret: nextRet };
    }
    else {
      let subPackCount = parseInt(aRawPackets.substring(7, 18), 2);

      //console.log("sc " + subPackCount);

      let offset = packageLength + 11;
      let subPackLength = 0;
      let exp = [];
      let retValues = [];
      for (let i = 0; i < subPackCount; i++) {
        let dd = DecodePackage(aRawPackets.substring(offset), total);
        offset += dd.l;
        subPackLength += dd.l;

        if (exp.length > 0)
          exp += ', ';
        exp += dd.exp;

        retValues.push(dd.ret);
      }

      let fullExp = GetOp(type);
      fullExp += '(' + exp + ')';

      nextRet = EvalOp(type, ...retValues);

      return { l: packageLength + 11 + subPackLength, exp: fullExp, ret: nextRet };
    }
  }
  else {
    length = 0;

    let payloadEncoded = aRawPackets.substring(6);

    let payload = '';
    while (1) {
      let control = payloadEncoded[0];

      payload += payloadEncoded.substring(1, 5);

      length += 5;
      if (control == '0')
        break;

      payloadEncoded = payloadEncoded.substring(5);
    }

    return { l: 3 + 3 + length, exp: parseInt(payload, 2), ret: parseInt(payload, 2) };
  }
}

const kEncodingTable = {
  0: '0000',
  1: '0001',
  2: '0010',
  3: '0011',
  4: '0100',
  5: '0101',
  6: '0110',
  7: '0111',
  8: '1000',
  9: '1001',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111'
};

let rawPackets = util.MapInput('./Day16Input.txt', (aElem) => {
  let pp = kEncodingTable[aElem];
  return pp;

}, '').join('');

//console.log(rawPackets);

let total = { verSum: 0 };

let result = DecodePackage(rawPackets, total);

console.log(total.verSum);
//console.log(result.exp);
console.log(result.ret);

//console.log(eval(result.exp));
