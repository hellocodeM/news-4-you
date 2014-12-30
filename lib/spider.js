var Spider = require('spiderer');
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var URL = require('url');
var ent = require('ent');
var read = require('easy-read');

var sites  = yaml.safeLoad(fs.readFileSync('config/source_site.yaml', 'utf-8')).sites;
var property = yaml.safeLoad(fs.readFileSync('config/property.yaml', 'utf-8'));


function HTMLSchema(host, path, time, html) {
    this.host = host;
    this.path = path;
    this.time = time;
    this.html = html;
}

function ArticleSchema(title, content) {
    this.title = title;
    this.content = content;
}

var filter = function(err, response, $) {
	console.log($('title').text());
	var links = $('a[href]').map(function() {
		return $(this).attr('href');
	});
	var now = new Date();
	var host = response.req._headers.host;
	var path = decodeURI(response.req.path);
	var html = response.body;
	// get content and article with readability
	read(html, function(res) {
		var title = res.title || '';
		var content = res.content || '';
        var HTML = new HTMLSchema(host, path, now, html);
        var article = new ArticleSchema(title, content);
        db('news.resource.html').insert(HTML);
        db('news.resource.article').insert(article);
	});
	return links;
};

var config = {
	startURLs: sites, 
	filter: filter,
	interval: 4 * 1000,
	log: true
};

// connect to the db and start spider
exports.start = function(cb) {
	db('news.$cmd').auth(property.user, property.passwd, function(r) {
		console.log(r);
		var spider = new Spider(config);
        spider.start(cb);
	});
}
