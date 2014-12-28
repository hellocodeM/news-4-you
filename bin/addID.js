// mongo script

var index = 1;
var cursor = db.resource.article.find();
while (cursor.hasNext()) {
    var doc = cursor.next();
    doc.articleid = index++;
    db.resource.article.save(doc);
}

