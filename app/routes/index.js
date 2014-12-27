var express = require('express');
var router = express.Router();
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var property = yaml.safeLoad(fs.readFileSync('../config/property', 'utf-8'));

/* GET home page. */
router.get('/', function(req, res) {
    db('news.$cmd').auth(property.user, property.passwd, function(r) {
        console.log(r);
        db('news.resource')
    });
	var varibles = {
		articles : articles,
		title: 'news 4 you'
	};
	res.render('index', varibles);
});

module.exports = router;
