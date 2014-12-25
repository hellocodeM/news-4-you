package com.wanghuanming.news4you

import com.wanghuanming.TFIDF
import scala.io.Source._
import com.mongodb.casbah.Imports._

object keywordsExtraction {
  def main(args: Array[String]) = {
    val news = MongoClient("localhost", 27017)("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article")
    val cursor = articles.find()
    
    while (cursor.hasNext) {
      val doc = cursor.next
      val keywords = TFIDF.getKeywords(stripTags(doc.getAsOrElse("content", "")), 10, "/opt/data/corpus")
      val res = doc ++ ("keywords" -> keywords)
      articles.save(res)
    }
  }

  def stripTags(content: String) = {
    content.replaceAll("<script.*?script>", "").replaceAll("<[^>]*>", "")
  }
}
