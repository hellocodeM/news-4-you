var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));
var util = require('../../lib/util');

/* GET home page. */
router.get('/', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        // select 10 documents randomly
        var start = Math.floor(Math.random() * 1000);
        console.log(start);
        db('news.resource.article').find({articleid: {$gt: start}}, 10, function(reply) {
            var documents = reply.documents.map(function(doc) {
                // title, content
                return {
                    title: doc.title,
                    digest: util.stripTags(doc.content).substring(0, 40),
                    link: '/article/' + doc.articleid
                };
            })
            var varibles = {};
            varibles.articles = documents;
            varibles.title = '首页|news for you';
            res.render('index', varibles);
        });
    });
});

module.exports = router;
