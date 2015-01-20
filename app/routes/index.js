var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var property = yaml.safeLoad(fs.readFileSync('../config/property.yaml', 'utf-8'));
var util = require('../../lib/util');
var logger = require('morgan');

/* GET home page. */
router.get('/', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        var start = Math.floor(Math.random() * 1000);
        db(property.database.article).find({articleid: {$gt: start}}, property.index.articles, function(reply) {
            // debug
//            reply.documents.forEach(function(doc) {
//                console.log(doc.articleid);
//            });
            var documents = reply.documents.map(function(doc) {
                return {
                    title: doc.title,
                    digest: util.stripTags(doc.content).substring(0, property.index.digestLength),
                    link: '/article/' + doc.articleid
                };
            });
            var varibles = {};
            varibles.articles = documents;
            varibles.title = '首页|news for you';
            res.render('index', varibles);
        });
    });
});

module.exports = router;
