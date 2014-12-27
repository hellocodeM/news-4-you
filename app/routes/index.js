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
        db('news.resource.article').find({}, 10, function(reply) {
            var documents = reply.documents.map(function(doc) {
                // title, content
                return {
                    title: doc.title,
                    digest: util.stripTags(doc.content).slice(0, 30),
                    link: '/article/' + doc._id
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
