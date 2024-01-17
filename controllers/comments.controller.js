/*

This file contains all controller functionality
pertaining to manipulating comments

*/

const { fetchComments, insertComment } = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");
const { fetchUserByName } = require("../models/general.model");

const getComments = (request, response, next) => {
  const { article_id } = request.params;
  if (article_id) {

    fetchArticleById(article_id)
    .then((article) =>{
            fetchComments(article_id)
              .then((comments) => {
                response.status(200).send({ comments });
              })
              .catch((err) => {
                console.log(err);
                next(err);
              });
    })
      .catch((err) => {
        next(err);
      });
  }
};

const postComments = (request, response, next) =>{
  const { article_id } = request.params;
  const {body} = request
  if (article_id) {
    fetchArticleById(article_id)
    .then((article) =>{
        fetchUserByName(body.username)
          .then((user) => {
            insertComment(article_id, body)
              .then((comment) => {
                response.status(201).send({ comment });
              })
              .catch((err) => {
                console.log(err);
                next(err);
              });
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
    })
    .catch((err) => {
        console.log(err);
      next(err);
    });
}
}

module.exports = { getComments, postComments };
