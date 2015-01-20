var yaml = require('js-yaml');
var fs   = require('fs');

var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml'));

console.log(property);
