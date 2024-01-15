/*

This file contains all controller functionality that is 
not major enough to be broken out to a dedicated file

*/

// gets all topics from the DB

const { fetchTopics, readEndpoints } = require("../models/general.model");

const getEndpoints = (request, response) => {
  readEndpoints().then((endpoints) =>{
    response.status(200).send({ endpoints });
  })

};

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

module.exports = { getTopics, getEndpoints };