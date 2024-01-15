const request = require("supertest");
const server = require("../middleware/server");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("server --> nc_news_test", () =>{
    describe("General error handling", () =>{ 
        test("Returns status code 404 to request to non-existant endpoint", () => {
            return request(server).get("/api/thisDoesNotExist").expect(404);
        });
        test("Returns error message to request to non-existant endpoint", () => {
            return request(server)
              .get("/api/thisDoesNotExist")
              .then((result) => {
                expect(result.error.text).toEqual("Invalid URL");
              });
        });
    });
    
    describe("GET /api/topics", () =>{ 
        test("Returns status code 200 to correct requests", () => {
            return request(server).get("/api/topics").expect(200);
        });
        test("Returns a json body to correct requests", () => {
        return request(server)
          .get("/api/topics")
          .expect("Content-Type", /json/)
        });
        test("Response body contains an array of correctly formatted objects", () => {
            return request(server)
              .get("/api/topics")
              .then(({ body }) => {
                // topics are nested in an array
                expect(body.topics).toBeInstanceOf(Array);
                body.topics.forEach((topic) => {
                  // each topic is an object
                  expect(topic).toBeInstanceOf(Object);
                  // each topic has two and only two keys
                  expect(Object.keys(topic)).toHaveLength(2)
                  // each object has correct keys of correct data type
                  expect(typeof topic.slug).toBe("string");
                  expect(typeof topic.description).toBe("string");
                });
              });
        });
    });
});