var read = require('easy-read');
var db = require('mongous').Mongous;
var fs = require('fs');
var yaml = require('js-yaml');

var property = yaml.safeLoad(fs.readFileSync('config/proper.yaml'));

db('news.$cmd').auth(property.user,property.passwd, function(r) {
	console.log(r);
	db('news.resource').find({title: {$exists: false}}, function(res) {
		res.documents.forEach(function(doc) {
			if (doc.html) 
				read(doc.html, function(res) {
					var content = res.content;
					var title = res.title;
					db('news.resource').update({_id : doc._id}, {$set: {
						title: title,
						content: content
					}});
				});
			else 
				console.log('no html');
		});
		console.log('finish');
	});
});
