/*

This file contains all controller functionality that is 
not major enough to be broken out to a dedicated file

*/

const {
  fetchTopics,
  readEndpoints,
  fetchUsers,
} = require("../models/general.model");

const getEndpoints = (request, response) => {
  readEndpoints().then((endpoints) =>{
    response.status(200).send({ endpoints });
  })

};

const getUsers = (request, response) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

const getTopics = (request, response) => {
  fetchTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};



module.exports = { getTopics, getEndpoints, getUsers };