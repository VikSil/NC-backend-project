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
    
    describe("GET /api", () =>{ 
      test("Returns status code 200 and object with correct objects to a correct requests", () => {
        return request(server)
          .get("/api")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            const {endpoints} = body;
            expect(endpoints).toBeInstanceOf(Object);
            const allEndpoints = Object.keys(endpoints);
            expect(allEndpoints.length).toBeGreaterThanOrEqual(1);
            allEndpoints.forEach((endpoint)=>{
              expect(endpoints[endpoint]).toBeInstanceOf(Object);
              expect(Object.keys(endpoints[endpoint])).toHaveLength(4);
              expect(typeof endpoints[endpoint].description).toBe("string");
              expect(endpoints[endpoint].queries).toBeInstanceOf(Array);
              expect(endpoints[endpoint].requestBody).toBeInstanceOf(Object);
              expect(typeof endpoints[endpoint].description).toBe("string");
            })
          });
      });
      test("The response object correctly documents endpoints and responses", async() => {
        const response = await request(server).get("/api");
        const { endpoints } = response.body;
        const allEndpoints = Object.keys(endpoints);
        for (let i= 0; i<allEndpoints.length; i++){
          const commandAndAddress = allEndpoints[i].split(" ");
          if (commandAndAddress[0] === "GET") {
            const endpointResponse = await request(server).get(
              commandAndAddress[1]
            );
            const { body } = endpointResponse;
            const { statusCode } = endpointResponse;
            const expectedBody = endpoints[allEndpoints[i]].exampleResponse;
            expect(statusCode).toBe(200);
            expect(Object.keys(body)).toEqual(Object.keys(expectedBody));
          }
        }
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