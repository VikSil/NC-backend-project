/*

This file contains all controller functionality that is 
not major enough to be broken out to a dedicated file

*/

const connection = require("../db/connection");
const fs = require("fs/promises");

const readEndpoints = () =>{
  const endpointsDoc = `${__dirname}/../endpoints.json`;

  return fs.readFile(endpointsDoc, "utf-8")
    .then((fileContent) => {
    return JSON.parse(fileContent);
  });
};

const fetchUsers = () => {
  return connection.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

const fetchTopics = () => {
  return connection.query("SELECT * FROM topics").then(({rows}) => {
    return rows;
  });
};


module.exports = { fetchTopics, readEndpoints, fetchUsers };