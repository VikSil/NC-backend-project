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

const fetchTopics = () => {
  return connection.query("SELECT * FROM topics").then(({rows}) => {
    return rows;
  });
};

const fetchUserByName = (username) => {
  return connection
    .query(
      `
  SELECT * FROM users 
  WHERE username = $1`,
      [username]
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
}


module.exports = { fetchTopics, readEndpoints, fetchUserByName };