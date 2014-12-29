// mongo script

//var index = 1;
//var cursor = db.resource.article.find();
//while (cursor.hasNext()) {
//    var doc = cursor.next();
//    doc.articleid = index++;
//    db.resource.article.save(doc);
//}
//

var cursor = db.recommend.similar.find();
while (cursor.hasNext()) {
    var doc = cursor.next();
    var id = doc._id;
    doc.articleid = db.resource.article.findOne({_id: id}).articleid;
    doc.similar = doc.similar.map(function(_id) {
        return db.resource.article.findOne({_id: _id}).articleid;
    });
    db.recommend.similar.save(doc);
}
