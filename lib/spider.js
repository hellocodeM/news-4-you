var Spider = require('spiderer');
var db = require('mongous').Mongous;
var yaml = require('js-yaml');
var fs = require('fs');

var sites = yaml.safeLoad(fs.readFileSync('config/source_site.yaml', 'utf-8')).sites;


function resourceSchema(host, path, time, html) {
	this.host = host;
	this.path = path;
	this.time = time;
	this.html = html;
}

var filter = function(err, res, $) {
	console.log($('title').text());
	var links = $('a[href]').map(function() {
		return $(this).attr('href');
	});
	var now = new Date().toString();
	var host = res.request.host;
	var path = res.request.path;
	db('news.resource').insert(new resourceSchema(host, path, now, $.html()));
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
