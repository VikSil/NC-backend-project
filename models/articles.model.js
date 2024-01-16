/*

This file contains all controller functionality
pertaining to articles data

*/

const connection = require("../db/connection");

const fetchArticles = () => {
  return connection.query("SELECT * FROM articles").then(({ rows }) => {
    return rows;
  });
};


const fetchArticleById = (article_id) => {
  return connection.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id])
  .then(({ rows }) => {
      if (rows.length === 0) {
                  return Promise.reject({
                    status: 404,
                    msg: "Not Found",
                  });
      } else {
        return rows[0];
      }
  });
};

module.exports = { fetchArticles, fetchArticleById };