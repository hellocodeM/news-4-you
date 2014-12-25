package com.wanghuanming.news4you

import com.mongodb.casbah.Imports._
import com.wanghuanming.TFIDF

object main {
  def main(args: Array[String]) = {
    val news = MongoClient()("news")
    news.authenticate("ming", "00")
    val resource = news("resource")
    val limit = MongoDBObject("")
  }
}
