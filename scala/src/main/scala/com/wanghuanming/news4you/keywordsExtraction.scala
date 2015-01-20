package com.wanghuanming.news4you

import com.wanghuanming.TFIDF
import scala.io.Source._
import com.mongodb.casbah.Imports._

import java.io.{File, PrintWriter}

object keywordsExtraction {
  def main(args: Array[String]) = {
    val news = MongoClient("localhost", 27017)("news")
    news.authenticate("ming", "00")
    val articles = news("resource.article2")

    // dump corpus if not exists
    if (new File("/opt/data/corpus").listFiles.length == 0) {
      println("start dump corpus")
      val cursor = articles.find()
      var i = 1

      while (cursor.hasNext) {
        val doc = cursor.next
        val writer = new PrintWriter("/opt/data/corpus/article" + i)
        writer.println(stripTags(doc.as[String]("content")))
        writer.close
        i += 1
      }
    }
    // extract keywords
    val cursor = articles.find()
    while (cursor.hasNext) {
      val doc = cursor.next
      val keywords = TFIDF.getKeywords(stripTags(doc.as[String]("content")), 10, "/opt/data/corpus")
        val res = doc ++ ("keywords" -> keywords)
        articles.save(res)
      }
    }

    def stripTags(content: String) = {
      content.replaceAll("<script.*?script>", "").replaceAll("<[^>]*>", "")
    }
  }
