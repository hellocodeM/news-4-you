var ObjectID = require('../lib/objectid').ObjectID;
var db = require('mongous').Mongous;

db('news.$cmd').auth('ming', '00', function(r) {
    console.log(r);
    db('news.resource.article').find({}, 1, function(reply) {
        var _id = reply.documents[0]._id;
        console.log(typeof _id);
        var id = new ObjectID(_id.toString());
        console.log(typeof id);
        console.log(_id == id)
    })
})
