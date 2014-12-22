var read = require('easy-read');
var db = require('mongous').Mongous;

db('news.$cmd').auth('ming', '00', function(r) {
	console.log(r);
	db('news.resource').find({}, function(res) {
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
