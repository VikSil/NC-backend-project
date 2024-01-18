/*

This file contains all controller functionality
pertaining to manipulating comments

*/

const {
  fetchComments,
  insertComment,
  dropCommentById,
} = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

const getComments = (request, response, next) => {
  const { article_id } = request.params;
  if (article_id) {
    fetchArticleById(article_id)
    .then((article) =>
        fetchComments(article_id))
    .then((comments) => {
        response.status(200).send({ comments });
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
    insertComment(article_id, body)
    .then((comment) => {
    response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
    }
}

const deleteCommentById = (request, response, next) =>{
    const { comment_id } = request.params;
    dropCommentById(Number(comment_id))
      .then(() => {
        response.status(204).send();
      })
      .catch((err) => {
        next(err);
      });
}

module.exports = { getComments, postComments, deleteCommentById };
