package com.wanghuanming.news4you

import com.mongodb.casbah.Imports._

/**
  * description: get similar articles of each article, store there id in mongodb://recommend/similar
  */

//case class Article(
//  id = new ObjectId(),
//  title: String,
//  content: String,
//  keywords: List[List] = List[List](),
//  articleid: Int
//)
//
//case class Recommend(
//  id: ObjectId = new ObjectId(),
//  articleid: Int,
//  similar = List[Int]
//)
//
//object ArticleMap {
//  def toBson(article: Article) = {
//    MongoDBObject(
//      "_id" -> article.id,
//      "title" -> article.title,
//      "content" -> article.content,
//      "keywords" -> article.keywords,
//      "articleid" -> article.articleid
//    )
//  }
//
//  def fromBson(o: MongoDBObject) = {
//    Article(
//      _id = o.as[ObjectId]("_id"),
//      
//    )
//  }
//}
object similariry {
  def main(args: Array[String]) = {
    val news = MongoClient()("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article")
    val recommend = news("recommend.similar")
    val matrix = articles.find().toList
    
    matrix.foreach { article =>
      // get articleid and keywords of each article
      val id = article.as[Double]("articleid").toInt
      val keywords = article.getAsOrElse("keywords", List[BasicDBList]())
      // get similarest 5 articles
      val similarArticles = matrix.map { arti => 
        // similariry between article and arti
        arti.as[Double]("articleid").toInt -> 
          similar(keywords, arti.getAsOrElse("keywords", List[BasicDBList]())) 
        }.sortBy(_._2).map(_._1).reverse.take(5)
      val obj = MongoDBObject("articleid" -> id, "similar" -> similarArticles)
      recommend.save(obj)
    }
  }

  /**
    * @desc: similarity between two articles
    * @return: Double value between 0 and 1, if bigger, then more similar
    */

  def similar(A: List[BasicDBList], B: List[BasicDBList]): Double = {
    val mapA = A.map(list => list(0).toString -> list(1).toString.toDouble).toMap
    val mapB = B.map(list => list(0).toString -> list(1).toString.toDouble).toMap
    // find the keywords they share with
    var intersection = A.map(_(0).toString).intersect(B.map(_(0).toString))
    if (intersection.length == 0)
      return 0.0
    val sum = intersection.map { word =>
      mapA.getOrElse(word, 0.0) * mapB.getOrElse(word, 0.0)
    }.reduce(_ + _)
    val sumA = intersection.map { word =>
      val self = mapA.getOrElse(word, 0.0) 
      self * self
    }.reduce(_ + _)
    val sumB = intersection.map { word => 
      val self = mapB.getOrElse(word, 0.0)
      self * self
    }.reduce(_ + _)
    Math.cos(sum / (Math.sqrt(sumA) * Math.sqrt(sumB)))
  }
}
