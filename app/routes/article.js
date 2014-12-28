var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var ObjectID = require('../../lib/objectid').ObjectID;

var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));

/* GET home page. */
router.get('/:articleid', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        var articleid = parseInt(req.params.articleid);
        db('news.resource.article').find({articleid : articleid}, 1, function(reply) {
            var doc = reply.documents[0];
            if (!doc)
                doc = { title: 'oops', content: 'we can not find the article you want', keywords: [] };
            else {
                doc.keywords = doc.keywords.map(function(keyword) {
                    return keyword[0];
                });
            }
            res.render('article', doc);
        });
    });
});

module.exports = router;
