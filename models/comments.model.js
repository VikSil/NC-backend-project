/*

This file contains all controller functionality
pertaining to comments data

*/

const connection = require("../db/connection");

const fetchComments = (article_id) => {
  return connection
    .query(
      `
    SELECT * from comments
    WHERE article_id = $1
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = { fetchComments };
