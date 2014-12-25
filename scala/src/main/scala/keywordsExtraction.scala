package main.scala

import com.mongodb.casbah.Imports._
import com.wanghuanming.TFIDF

object main {
  def main(args: Array[String]) = {
    val keywords = TFIDF.getKeywords("hello world", 5, "/tmp/shakespear")
    keywords.foreach(println)
  }
}
