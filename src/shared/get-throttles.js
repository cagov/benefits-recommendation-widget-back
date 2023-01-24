// get the throttle info, return it
// we can't do stuff like this inside a lambda because the file system structure is different: JSON.parse(fs.readFileSync('../get-benefits/throttles.json','utf8'));

const throttleConfig = require(`./throttles.json`);

exports.default = function() {
  return throttleConfig;
}