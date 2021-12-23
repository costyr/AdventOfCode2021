const util = require('./Util.js');

let map = util.MapInput('./Day23TestInput.txt', (aElem) => {

  return aElem.split('');

  }, '\r\n', this);

  console.log(map);
