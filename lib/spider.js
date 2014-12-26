var Spider = require('spiderer');
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');
var URL = require('url');
var ent = require('ent');
var read = require('easy-read');

var sites = yaml.safeLoad(fs.readFileSync('config/source_site.yaml', 'utf-8')).sites;


function resourceSchema(host, path, time, html, title, content) {
	this.host = host;
	this.path = path;
	this.time = time;
	this.html = html;
	this.title = title;
	this.content = content;
}

var filter = function(err, res, $) {
	console.log($('title').text());
	var links = $('a[href]').map(function() {
		return $(this).attr('href');
	});
	var now = new Date();
	var host = res.request.host;
	var path = decodeURI(res.request.path);
	var html = ent.decode($.html());
	// console.log(ent.decode($.html()));
	// decode html entity 
	// get content and article from readability
	read(html, function(res) {
		var title = res.title || '';
		var content = res.content || '';
		var resourceObj = new resourceSchema(host, path, now, html, title, content);
		db('news.resource').insert(resourceObj);
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
exports.start = function() {
	db('news.$cmd').auth('ming', '00', function(r) {
		console.log(r);
		var spider = new Spider(config);
		spider.start(function() {
			process.exit();
		});
	});
}
