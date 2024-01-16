/*

This file contains all controller functionality
pertaining to manipulating articles

*/

const { fetchArticles, fetchArticleById } = require("../models/articles.model");

const getArticles = (request, response, next) => {
  const { article_id } = request.params;
  if (article_id){
    fetchArticleById(article_id)
      .then((article) => {
        response.status(200).send({ article });
      })
      .catch((err) => {
        next(err);
      });
  }
  else{
    const { sort_by } = request.query;
    fetchArticles(sort_by)
      .then((articles) => {
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });  
}
};

module.exports = { getArticles };

