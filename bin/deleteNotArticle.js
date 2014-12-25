// mongo script

var cursor = db.resource.article.find();
while (cursor.hasNext()) {
	var doc = cursor.next();
	if (doc.content.indexOf("unable to parse article content") != -1)
		doc.keywords = null;
	db.resource.article.save(doc);
}
