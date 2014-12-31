var read = require('easy-read');
var db = require('mongous').Mongous;
var fs = require('fs');
var yaml = require('js-yaml');

var property = yaml.safeLoad(fs.readFileSync('config/property.yaml'));

db('news.$cmd').auth(property.user,property.passwd, function(r) {
	console.log(r);
    db('news.resource.html').find({}, function(res) {
        var docs = res.documents;
        docs.forEach(function(doc) {
            db('news.resource.article2').find({_id: doc._id}, function(reply) {
                var exist = reply.documents[0];
                if (!exist) {
                    read(doc.html, function(result) {
                        db('news.resource.article2').insert({_id: doc._id, title: result.title, content: result.content});
                    });
                }
            });
        });
    });
});
