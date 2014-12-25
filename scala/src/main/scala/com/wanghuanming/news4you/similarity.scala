package com.wanghuanming.news4you

import com.mongodb.casbah.Imports._

/**
  * description: get similar articles of each article, store there id in mongodb://recommend/similar
  */
object similariry {
  def main(args: Array[String]) = {
    val news = MongoClient()("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article")
    val recommend = news("recommend.similar")
    val matrix = articles.find(MongoDBObject(), MongoDBObject("_id" -> 1, "keywords" -> 1)).toList
    
    matrix.foreach { article =>
      // get keywords of each article
      val id = article.getAsOrElse("_id", new ObjectId())
      val keywords = article.getAsOrElse("keywords", List[BasicDBList]())
      // get similar articles
      val res = matrix.map { arti => 
        arti.getAsOrElse("_id", new ObjectId()) -> 
          similar(keywords, arti.getAsOrElse("keywords", List[BasicDBList]())) 
        }.sortBy(_._2).map(_._1).reverse.take(5)
      val obj = MongoDBObject("_id" -> id, "similar" -> res)
      recommend.insert(obj)
    }
  }


  def similar(A: List[BasicDBList], B: List[BasicDBList]): Double = {
    val mapA = A.map(list => list(0).toString -> list(1).toString.toDouble).toMap
    val mapB = B.map(list => list(0).toString -> list(1).toString.toDouble).toMap
    val share = mapA.map(_._1).toList.union(mapB.map(_._1).toList).distinct
    if (share.length == 0)
      return 0.0
    val sum = share.map { word =>
      mapA.getOrElse(word, 0.0) * mapB.getOrElse(word, 0.0)
    }.reduce(_ + _)
    val sumA = share.map { word =>
      val self = mapA.getOrElse(word, 0.0) 
      self * self
    }.reduce(_ + _)
    val sumB = share.map { word => 
      val self = mapB.getOrElse(word, 0.0)
      self * self
    }.reduce(_ + _)
    Math.cos(sum / (Math.sqrt(sumA) * Math.sqrt(sumB)))
  }
}
