/*

This file contains all controller functionality
pertaining to articles data

*/

const connection = require("../db/connection");


const fetchArticles = (sort_by = "date", topic) => {
  const validSortCols = ["date", "created_at", "title", "author"];
  const sortByArray = sort_by.split(",");

  for (let item of sortByArray) {
    if (!validSortCols.includes(item)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid URL",
      });
    }
  }
  if (sort_by === "date") {
    sort_by = "created_at DESC";
  }

  let whereClause = "  "
  if (topic){
    whereClause  = ` WHERE a.topic = '${topic}' `
  }

  const queryString =
    `
    SELECT a.author, a.title, a.article_id, a.topic,
           a.created_at, a.votes, a.article_img_url,
           count(c.comment_id)::int as comment_count
     FROM articles as a
     LEFT JOIN comments as c 
     ON a.article_id = c.article_id` +
     whereClause +
    `GROUP BY a.article_id
     ORDER BY a.${sort_by}`;

  return connection.query(queryString).then(({ rows }) => {
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

const updateVotes = (article_id, body) => {
  return connection
    .query(
      `
  UPDATE articles
  SET votes = votes+ $1
  WHERE article_id = $2
  RETURNING *
  `,
      [body.inc_votes, article_id]
    )
    .then(({ rows: rows }) => {
      return rows[0];
    });
};

module.exports = { fetchArticles, fetchArticleById, updateVotes };