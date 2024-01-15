/*

This file contains all endpoint available on the server
and (for now) error handling

*/

const express = require("express");
const { getTopics } = require("../controllers/general.controller");

const server = express();

server.get("/api/topics", getTopics);

server.use((err, req, res, next) => {
  res.status(400).send("Invalid URL");
});

module.exports = server;
