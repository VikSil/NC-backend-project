/*

This file contains all controller functionality that is 
not major enough to be broken out to a dedicated file

*/

const connection = require("../db/connection");

const fetchTopics = () => {
  return connection.query("SELECT * FROM topics").then(({rows}) => {
    return rows;
  });
};


module.exports = { fetchTopics };