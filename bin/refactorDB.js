// mongo script

db.resource.html.drop();
db.resource.article.drop();

var cursor = db.resource.find();
while (cursor.hasNext()) {
	var doc = cursor.next();
	var article = {};
	article.title = doc.title;
	article.content = doc.content;
	article._id = doc._id;
	delete doc.title;
	delete doc.content;
	db.resource.html.insert(doc);
	db.resource.article.insert(article);
}

