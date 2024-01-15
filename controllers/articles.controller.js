/*

This file contains all controller functionality
pertaining to manipulating articles

*/

const { fetchArticles } = require("../models/articles.model");

const getArticles = (request, response) => {
  fetchArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};

module.exports = { getArticles };