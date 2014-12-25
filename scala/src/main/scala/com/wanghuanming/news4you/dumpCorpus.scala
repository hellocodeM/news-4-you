package com.wanghuanming.news4you

import com.mongodb.casbah.Imports._
import com.wanghuanming.TFIDF
import java.io.PrintWriter

object dumpCorpus {
  def main(args: Array[String]) = {
    val news = MongoClient()("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article")
    var i = 0
    val cursor = articles.find(MongoDBObject(), MongoDBObject("content" -> 1))
    
    while (cursor.hasNext) {
      i += 1
      val doc = cursor.next
      val writer = new PrintWriter("/opt/data/corpus/article" + i) 
      writer.println(doc("content"))
      writer.close
    }
  }

  def stripTags(content: String) = {
    content.replaceAll("<script.*?script>", "").replaceAll("<[^>]*>", "")
  }
}
