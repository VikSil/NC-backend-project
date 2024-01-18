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
    })
};

insertComment = (article_id, body) => {
  return connection
    .query(
      `INSERT INTO comments
        (body,  author,article_id)
        VALUES
        ($1, $2, $3)
        RETURNING *`,
      [body.body, body.username, article_id]
    )
    .then(({ rows: rows }) => {
      return rows[0];
    });
};

dropCommentById = (comments) => {
  return connection
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *`,
      [comments]
    )
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

module.exports = { fetchComments, insertComment, dropCommentById };
