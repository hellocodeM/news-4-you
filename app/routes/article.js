var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var ObjectID = require('../../lib/objectid').ObjectID;

var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));

/* GET home page. */
router.get('/:_id', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        var _id = new ObjectID(req.params._id);
        db('news.resource.article').find({_id : _id}, 1, function(reply) {
            console.log(reply);
            var doc = reply.documents[0];
            console.log(doc);
            if (!doc)
                doc = { title: 'oops', content: 'we can not find the article you want' };
            res.render('article', doc);
        });
    });
});

module.exports = router;
