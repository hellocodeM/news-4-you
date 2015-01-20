var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        var start = Math.floor(Math.random() * 7000);
        db(property.database.label).find({}, 10, start, function(reply) {
            var docs = reply.documents;
            async.map(docs, function(label, cb) {
                var keyword  = label.label;
                var articles = label.articles;
                
                // query title and link for each article
                async.map(articles, function(articleid, callback) {
                    db(property.database.article).find({articleid: articleid}, 1, function(reply2) {
                        var doc = reply2.documents[0];
                        callback(null, {title: doc.title, link: '/article/' + articleid});
                    });
                }, function(err, result) {
                    cb(null, {keyword: keyword, articles: result});
                });
            }, function(err, result) {
                if (err)
                    console.error(err);
                else {
                    console.log(result);
                    
                    res.render('label', {labels : result});
                }
            });
        });
    });
});

module.exports = router;
