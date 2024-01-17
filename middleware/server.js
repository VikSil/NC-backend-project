/*

This file contains all endpoint available on the server
and error handling

*/

const express = require("express");
const {
  getTopics,
  getEndpoints,
} = require("../controllers/general.controller");

const {getArticles} = require("../controllers/articles.controller");
const {
  getComments,
  postComments,
} = require("../controllers/comments.controller");

const server = express();
server.use(express.json());// this will handle body for POST requests

server.get("/api", getEndpoints);
server.get("/api/topics", getTopics);
server.get("/api/articles", getArticles);
server.get("/api/articles/:article_id", getArticles);
server.get("/api/articles/:article_id/comments", getComments);

server.post("/api/articles/:article_id/comments", postComments);

// assume that whatever endpoint was requested does not exist,
// since it was not processed above
server.get('*',(request, response) => {
    response.status(404).send("Invalid URL");
});


//Error handling
server.use((err, request, response, next) => {
  // Postgres Err: null value in input violates non-null constraint
  if (err.code === "23502") {
    response.status(400).send("Invalid inputs");
  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  // Postgres Err: invalid input syntax for integer
  if (err.code === "22P02") {
    response.status(400).send("Invalid URL");
  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  // No record in the DB
  if (err.msg === "Not Found") {
      response.status(404).send(err.msg);
  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  // Wrong query format
  if (err.msg === "Invalid URL") {
    response.status(400).send(err.msg);
  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  console.log(`Probably should do something more sensible with this ${err}`);
  response.status(500).send("Server failure");
});

module.exports = server;
