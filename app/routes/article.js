var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var async = require('async');

var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));

/* GET home page. */
router.get('/:articleid', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        var articleid = parseInt(req.params.articleid);
        db(property.database.article).find({articleid : articleid}, 1, function(reply) {
            var doc = reply.documents[0];
            if (!doc)
                doc = { title: 'oops', content: 'we can not find the article you want', keywords: [] };
            else {
                // find the keywords
                if (doc.keywords)
                    doc.keywords = doc.keywords.map(function(keyword) {
                        return keyword[0];
                    });
                else
                    doc.keywords = [];
                // find the articleid of similar articles and find the meta data or these articles
                db(property.database.similar).find({articleid: doc.articleid}, function(reply2) {
                    async.map(reply2.documents[0].similar, function(arti, cb) {
                        db(property.database.article).find({articleid: arti}, 1, function(reply3) {
                            var doc = reply3.documents[0];
                            cb(null, {title: doc.title, link: '/article/' + doc.articleid});
                        });
                    }, function(err, result) {
                        if (err)
                            console.log(err);
                        else {
                            res.render('article', {
                                title: doc.title,
                                content: doc.content,
                                keywords: doc.keywords,
                                recommends: result 
                            });
                        }
                    });
                });
            }
        });
    });
});

module.exports = router;
