var db = require('mongous').Mongous;
var ObjectID = require('../lib/objectid').ObjectID;

db('news.$cmd').auth('ming', '00', function(r) {
    console.log(r);
    db('news.resource.article').find({articleid: 1}, 1, function(reply) {
    console.log(reply);
    });
});
