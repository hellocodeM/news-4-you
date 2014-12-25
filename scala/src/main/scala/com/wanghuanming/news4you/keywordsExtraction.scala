package com.wanghuanming.news4you

import com.wanghuanming.TFIDF
import scala.io.Source._
import com.mongodb.casbah.Imports._

object main {
  def main(args: Array[String]) = {
    val news = MongoClient("localhost", 27017)("news")
    news.authenticate("ming", "00")
    val test = news("test")
  }
}
