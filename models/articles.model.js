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


module.exports = { fetchArticles };