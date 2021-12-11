const util = require('./Util.js');

function ComputeErrorScore(aError) {

  let score = ['(', '[', '{', '<'];

  let total = 0;
  for (let i = aError.length - 1; i >= 0; i--)
    total = total * 5 + score.indexOf(aError[i]) + 1;

  return total;
}

function ComputeScore(aLine) {

  let stack = [];
  let ss = '[{(<';
  for (let i = 0; i < aLine.length; i++) {
    if (ss.indexOf(aLine[i]) != -1)
      stack.push(aLine[i]);
    else {
      let top = stack[stack.length - 1];

      if ((top == '[' && aLine[i] == ']') ||
        (top == '{' && aLine[i] == '}') ||
        (top == '(' && aLine[i] == ')') ||
        (top == '<' && aLine[i] == '>'))
        stack.pop();
      else {
        if (aLine[i] == ')')
          return { d: 0, s: 3 };
        else if (aLine[i] == ']')
          return { d: 0, s: 57 };
        else if (aLine[i] == '}')
          return { d: 0, s: 1197 };
        else
          return { d: 0, s: 25137 };
      }
    }
  }

  return { d: 1, s: ComputeErrorScore(stack) };
}

function Analize(aNavSintax) {
  let total = 0;
  let incompleteScores = [];
  for (let i = 0; i < aNavSintax.length; i++) {
    let ss = ComputeScore(aNavSintax[i]);

    if (ss.d == 0)
      total += ss.s;
    else
      incompleteScores.push(ss.s);
  }

  incompleteScores.sort((a, b) => { return a - b; });

  let midScoreIndex = Math.floor(incompleteScores.length / 2);

  return { part1: total, part2: incompleteScores[midScoreIndex] };
}

let navSintax = util.MapInput('./Day10Input.txt', (aElem) => {
  return aElem;
}, '\r\n');

let ret = Analize(navSintax);

console.log(ret.part1);
console.log(ret.part2);
