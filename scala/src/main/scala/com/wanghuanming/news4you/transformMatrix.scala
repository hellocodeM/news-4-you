package com.wanghuanming.news4you

import com.mongodb.casbah.Imports._

object TransformMatrix {
  def main(args: Array[String]) = {
    val news = MongoClient()("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article")
    val label = news("recommend.label")

    articles.flatMap { article =>
      val keywords = article.as[List[BasicDBList]]("keywords")
      val articleid = article.as[Double]("articleid").toInt
      
      keywords.map(_(0)).map(_ -> articleid)
    }.groupBy(_._1).foreach { pair =>
      val keyword = pair._1
      val articles = pair._2.map(_._2).toList.distinct
      label.insert(MongoDBObject("label" -> keyword, "articles" -> articles))
    }
  }
}
