/*

This file contains all controller functionality
pertaining to manipulating articles

*/

const {
  fetchArticles,
  fetchArticleById,
  updateVotes,
} = require("../models/articles.model");
const { fetchTopicBySlug } = require("../models/general.model");

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
  else {
    const { sort_by, topic } = request.query;

    const promises = [fetchArticles(sort_by, topic)];
    if (topic){
      // Semicolon in usernames prohibited at registration
      // to guard against injections
      if (topic.includes(";")){
        response.status(404).send("Invalid URL");
      }
      promises.push(fetchTopicBySlug(topic))
    }

    Promise.all(promises)
      .then((responses) => {
        const articles = responses[0];
        response.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });  
  }
};

const patchVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  if (article_id) {
    fetchArticleById(article_id)
      .then((article) => updateVotes(article_id, body))
      .then((article) => {
            response.status(200).send({ article });
          })          
      .catch((err) => {
        next(err);
      });
  }
};

module.exports = { getArticles, patchVotes };

