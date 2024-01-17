/*

This file contains all controller functionality
pertaining to manipulating comments

*/

const { fetchComments } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

const getComments = (request, response, next) => {
  const { article_id } = request.params;
  if (article_id) {

    fetchArticleById(article_id)
    .then((article) =>{
            fetchComments(article_id).then((comments) => {
              response.status(200).send({ comments });
            });
    })
      .catch((err) => {
        next(err);
      });
  }
};

module.exports = { getComments };
