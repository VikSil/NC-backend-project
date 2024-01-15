/*

This file contains all endpoint available on the server
and error handling

*/

const express = require("express");
const { getTopics} = require("../controllers/general.controller");

const server = express();
server.use(express.json());

server.get("/api/topics", getTopics);


// assume that all other endpoints do not exist, since not processed above
server.get('*',(request, response) => {
    response.status(404).send("Invalid URL");
});



// Error handling, to be adjusted later
server.use((err, request, response, next) => {
  // Postgres Err: null value in input violates non-null constraint
  if (err.code === "23502") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

// Postgres Err: invalid input syntax for integer
server.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  // No record in the DB
  if (err.message === "Not Found") {

      response.status(404).send({ msg: "the thing you are looking for does not exist" });

  } else {
    next(err);
  }
});

server.use((err, request, response, next) => {
  console.log(`Probably should do something more sensible with this ${err}`);
  response.status(500).send("Server failure");
});

module.exports = server;
