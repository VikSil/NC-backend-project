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
            return request(server)
              .get("/api/thisDoesNotExist")
              .expect(404)
              .then((result) => {
                expect(result.error.text).toEqual("Invalid URL");
              });
        });
    });
    
    describe("GET /api", () =>{ 
      test("Returns status code 200 and object with correct objects to a correct requests", () => {
        const expectedObject = {
          description: expect.any(String),
          queries: expect.any(Array),
          requestBody: expect.any(Object),
          description: expect.any(String),
          exampleResponse: expect.any(Object),
        };

        return request(server)
          .get("/api")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            const { endpoints } = body;
            expect(endpoints).toBeInstanceOf(Object);
            const allEndpoints = Object.keys(endpoints);
            expect(allEndpoints.length).toBe(6);
            allEndpoints.forEach((endpoint) => {
              expect(endpoints[endpoint]).toBeInstanceOf(Object);
              expect(Object.keys(endpoints[endpoint])).toHaveLength(4);
              expect(endpoints[endpoint]).toMatchObject(expectedObject);
            });
          });
      });
      test("The response object correctly documents endpoints and responses", async() => {
        const response = await request(server).get("/api");
        const { endpoints } = response.body;
        const allEndpoints = Object.keys(endpoints);
        for (let i= 0; i<allEndpoints.length; i++){
          const commandAndAddress = allEndpoints[i].split(" ");
          const addressAndParams = commandAndAddress[1].split(":");
          let remainder = "";
          let endpointResponse = null;
          if (addressAndParams[1]){
            if (addressAndParams[1].split("/").length>1){
              remainder = "/"+addressAndParams[1].split("/")[1];
            }
          }          
          if (commandAndAddress[0] === "GET") {
            
            if (addressAndParams.length === 1) {// if url has no parameters
              endpointResponse = await request(server).get(
                commandAndAddress[1]
              );
            } else {
              // if url has parameters
              if (addressAndParams[1].includes("id")) {// if parameter is id
                const address = addressAndParams[0] + "1" + remainder; // pick the first object by id
                endpointResponse = await request(server).get(address);
              }
            }
            const { statusCode } = endpointResponse;
            expect(statusCode).toBe(200);
          }
          if (commandAndAddress[0] === "POST") {
            const { requestBody } = endpoints[allEndpoints[i]];
            if (addressAndParams.length === 2) {// if url has a parameter
              if (addressAndParams[1].includes("id")) {// if parameter is id
                const address = addressAndParams[0] + "1" + remainder; // pick the first object by id
                endpointResponse = await request(server)
                  .post(address)
                  .send(requestBody);
                const { statusCode } = endpointResponse;
                expect(statusCode).toBe(201);
              }
            }
          }
          const { body } = endpointResponse;
          const expectedBody = endpoints[allEndpoints[i]].exampleResponse;
          expect(Object.keys(body)).toEqual(Object.keys(expectedBody));
        }
      }); 
    });

    describe("GET /api/topics", () =>{ 
        test("Returns status code 200 to correct requests", () => {
            return request(server)
              .get("/api/topics")
              .expect(200)
              .expect("Content-Type", /json/)
              .then(({ body }) => {
                expect(body.topics).toBeInstanceOf(Array);
                expect(body.topics.length).toBe(3);
                body.topics.forEach((topic) => {
                  expect(topic).toBeInstanceOf(Object);
                  expect(Object.keys(topic)).toHaveLength(2);
                  expect(typeof topic.slug).toBe("string");
                  expect(typeof topic.description).toBe("string");
                });
              });
        });
    });

    describe("GET /api/articles", () => {
      test("Returns status code 200 and correctly formatted and sorted body to a correct request", () => {
        const expectedObject = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
          created_at: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w$/
          ),
        };

        return request(server)
          .get("/api/articles")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body.articles).toBeInstanceOf(Array);
            expect(body.articles.length).toBe(13);
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
            body.articles.forEach((article) => {
              expect(article).toBeInstanceOf(Object);
              expect(Object.keys(article)).toHaveLength(8);
              expect(article).toMatchObject(expectedObject);
              expect(article.article_id).toBeGreaterThan(0);
              expect(article.comment_count).toBeGreaterThanOrEqual(0);

            });
          });
      });
      describe("GET /api/articles/sort_by=...", () => {
        test("Returns list of articles sorted by title", () => {
          return request(server)
            .get("/api/articles?sort_by=title")
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("title");
            });
        });
        test("Returns list of articles sorted by author", () => {
          return request(server)
            .get("/api/articles?sort_by=author")
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy("author");
            });
        });
        test("Returns list of articles sorted by multiple parameters", () => {
          return request(server)
            .get("/api/articles?sort_by=author,title")
            .then(({ body }) => {
              const { articles } = body;
              // make a clone of the results
              let sortedArticles = articles.map((a) => {
                return { ...a };
              });
              // sort the cloned results as they should be sorted
              sortedArticles = sortedArticles.sort((a, b) => {
                if (a.author > b.author) {
                  return true;
                } else {
                  if (a.author === b.author) {
                    return a.title.toLowerCase() > b.title.toLowerCase();
                  } else return false;
                }
              });
              // compare every position in results to the sorted clone of results
              expect(articles.length).toBe(sortedArticles.length);
              articles.every((article, index) => {
                expect(articles[index]).toEqual(sortedArticles[index]);
              });
            });
        });
        test("Returns status code 400 if sorting by requested column is not allowed", () => {
          return request(server)
            .get("/api/articles?sort_by=article_img_url")
            .expect(400)
            .then((result) => {
              expect(result.error.text).toEqual("Invalid URL");
            });
        });
        test("Returns status code 400 if injection is attempted via sort_by query", () => {
          return request(server)
            .get("/api/articles?sort_by=title; DROP table articles;")
            .expect(400)
            .then((result) => {
              expect(result.error.text).toEqual("Invalid URL");
            });
        });
      });
    });


    describe("GET /api/articles/:article_id", () => {
      test("Returns status code 200 and correctly formatted body to a correct requests", () => {
        const expectedObject = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          topic: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          created_at: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w$/
          ),
        };
        return request(server)
          .get("/api/articles/1")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            const {article} = body
            expect(article).toBeInstanceOf(Object);
            expect(Object.keys(article)).toHaveLength(8);
            expect(article).toMatchObject(expectedObject);
          });
      });
      test("Returns status code 404 if article_id does not exist in the DB", () => {
        return request(server)
          .get("/api/articles/0")
          .expect(404)
          .then((result) => {
            expect(result.error.text).toEqual("Not Found");
          });
      });
      test("Returns status code 400 if article_id is in invalid format", () => {
        return request(server)
          .get("/api/articles/first")
          .expect(400)
          .then((result) => {
            expect(result.error.text).toEqual("Invalid URL");
          });
      });
      test("Returns status code 400 if injection is attempted via url", () => {
        return request(server)
          .get("/api/articles/1; DROP table articles;")
          .expect(400)
          .then((result) => {
            expect(result.error.text).toEqual("Invalid URL");
          });
      });
    });

    describe("GET /api/articles/:article_id/comments", () => {
      test("Returns status code 200 and correctly formatted and sorted body to a correct requests", () => {
        const expectedObject = {
          comment_id: expect.any(Number),
          article_id: 1,
          votes: expect.any(Number),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w$/
          ),
          };

        return request(server)
          .get("/api/articles/1/comments")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments.length).toBe(11);
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
            body.comments.forEach((comment) => {
              expect(Object.keys(comment)).toHaveLength(6);
              expect(comment).toMatchObject(expectedObject);
              expect(comment.comment_id).toBeGreaterThan(0);
            });
          });
      });
      test("Returns status code 200 and an empty array to request for article without any comments", () => {
        return request(server)
          .get("/api/articles/2/comments")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body.comments).toBeInstanceOf(Array);
            expect(body.comments.length).toBe(0);
          });
      });

      test("Returns status code 404 if article does not exist", () => {
        return request(server)
          .get("/api/articles/0/comments")
          .expect(404)
          .then((result) => {
            expect(result.error.text).toEqual("Not Found");
          });
      });

      test("Returns status code 400 if article_id is in invalid format", () => {
        return request(server)
          .get("/api/articles/first/comments")
          .expect(400)
          .then((result) => {
            expect(result.error.text).toEqual("Invalid URL");
          });
      });
      test("Returns status code 400 if injection is attempted via url", () => {
        return request(server)
          .get("/api/articles/1; DROP table articles;/comments")
          .expect(400)
          .then((result) => {
            expect(result.error.text).toEqual("Invalid URL");
          });
      });
    });
    
     describe("POST /api/articles/:article_id/comments", () => {
       test("Returns status code: 201 and correctly formatted body to a correct request", () => {
         return request(server)
           .post("/api/articles/2/comments")
           .send({
             username: "icellusedkars",
             body: "This is a test comment",
           })
           .expect(201)
           .then((response) => {
             const { comment } = response.body;
             expect(comment).toBeInstanceOf(Object);
             const expectedObject = {
               comment_id: expect.any(Number),
               created_at: expect.stringMatching(
                 /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w$/
               ),
             };
             console.log(comment);
             expect(Object.keys(comment)).toHaveLength(6);
             expect(comment).toMatchObject(expectedObject);
             expect(comment.comment_id).toBeGreaterThan(0);
             expect(comment.article_id).toBe(2);
             expect(comment.votes).toBe(0);
             expect(comment.body).toBe("This is a test comment");
             expect(comment.author).toBe("icellusedkars");
           });
       });

       test("Returns status code 404 if user does not exist", () => {
         return request(server)
           .post("/api/articles/1/comments")
           .send({
             username: "someoneShady",
             body: "This is a test comment",
           })
           .expect(404)
           .then((result) => {
             expect(result.error.text).toEqual("Not Found");
           });
       });
       test("Returns status code 404 if article does not exist", () => {
         return request(server)
           .post("/api/articles/0/comments")
           .send({
             username: "icellusedkars",
             body: "This is a test comment",
           })
           .expect(404)
           .then((result) => {
             expect(result.error.text).toEqual("Not Found");
           });
       });
       test("Returns status code 400 if article_id is in invalid format", () => {
         return request(server)
           .post("/api/articles/first/comments")
           .send({
             username: "icellusedkars",
             body: "This is a test comment",
           })
           .expect(400)
           .then((result) => {
             expect(result.error.text).toEqual("Invalid URL");
           });
       });
       test("Returns status code 400 if injection is attempted via url", () => {
         return request(server)
           .post("/api/articles/1; DROP table articles;/comments")
           .send({
             username: "icellusedkars",
             body: "This is a test comment",
           })
           .expect(400)
           .then((result) => {
             expect(result.error.text).toEqual("Invalid URL");
           });
       });
       test("Parametrises inputs to INSERT query", () => {
         return request(server)
           .post("/api/articles/1/comments")
           .send({
             username: "icellusedkars",
             body: "('Smthn','icellusedkars',1); DROP TABLE comments;",
           })
           .expect(201)
           .then((response) => {
             const { comment } = response.body;
             expect(comment).toMatchObject({
               comment_id: expect.any(Number),
               created_at: expect.stringMatching(
                 /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}\w$/
               ),
               body: "('Smthn','icellusedkars',1); DROP TABLE comments;",
               article_id: 1,
               votes: 0,
               author: "icellusedkars",
             });
           });
       });
     });
});
