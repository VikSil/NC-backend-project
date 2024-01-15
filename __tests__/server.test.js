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
    describe("GET /api/topics", () =>{ 
        test("Returns status code 200 to correct requests", () => {
            return request(server).get("/api/topics").expect(200);

        });
    });
});