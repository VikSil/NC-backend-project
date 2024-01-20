# Northcoders News API

## Summary
This repository was created during the [software development bootcamp by NorthCoders](https://northcoders.com/our-courses/coding-bootcamp), back-end project week. It allows users to make HTTP requests to a news server to retrieve articles on various topics, post, view and delete comments on those articles, as well as upvote and downvote articles.

You can access the hosted version on Render [here](https://nc-news-api-n397.onrender.com/api). The link will return a .json file with all endpoints available on this API. It will take a minute for the web app to spin up and wake the API from its slumber, please be patient. There is a limit of two concurrent connections, it is possible (albeit unlikely) that a couple of other people are already connected, if your connection is being refused. Please try again later. Alternatively, you may want to download this repo and run the API locally.


## Setup instructions

Please follow these steps to run the project locally:

1. You will need to make sure that you have Node and npm installed on your local machine. Type these two commands be into the terminal:
    ```
    node --version
    npm --version
    ```
    
    If both return a sensible looking version number, proceed to the next step. Otherwise, look into [these](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) instructions for setting up Node and npm.

1. Clone this repo onto your machine - follow [these](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) instructions, in case you are not familiar with cloning Git repos. All of the following steps assume that console commands are run from the root directory of the repo.

1. At the root level create two files named: `.env.development` and `.env.test` These will contain environment variables necessary to connect to development and test databases respectively.
    + Place the following line in `.env.development`:
        ```
        PGDATABASE=nc_news
        ``` 
    + Place the following line in `.env.test`:
        ```
        PGDATABASE=nc_news_test
        ``` 
1. Run the following command in the console to install dependencies. This will add all packages that the project needs to run in production, as well us all packages that you will need for development.
    ```
    npm install
    ```
1. Run the following command to create local databases;
    ```
    npm setup-dbs
    ```
1. Run the following command to create local databases;
    ```
    npm setup-dbs
    ```
1. Run the following command to seed the local development database.
    ```
    npm seed
    ```

After doing all of the above you should be all set to run the code, test it and play with the functionality locally.

## How to run the code

To start up the API server, run the following command:
```
npm start
```
This should yield an output: ``` The server is listening on port 9090``` and the console wil appear to be hanging (you can break the connection by sending Ctrl+C into the console when you need to).
You can now use Insomnia, PostMan or other API development platform to make requests to the localhost on post 9090 to access development data. Send GET command to http://localhost:9090/api/ to retrieve the list of all available endpoints.

![Example API request using Insomnia](https://imgur.com/CRpjUL6)

You can also run test on the code using the test database. The test suite for this API was developed using [jest.js](https://jestjs.io/) package. In order to run the test suite type the following command into the terminal:
```
npm run test
```
This command will run all the files in \_\_tests\_\_ folder and output the test results. You can add any distinct part of a file name to the end of the above command to only run the tests in that file.

## Additional information

This diagram illustrates the exports --> require links between all packages.

![Package diagram](https://imgur.com/HYtVsdI)

This ER diagram illustrates the database structure.

![ER diagram](https://imgur.com/zIkHRIJ)







## Disclaimer
All of the code in this repo apart from that in .husky and seeds directories, setup.sql and utils.test.js file was created by the owner. The latter, as well as the data in development and test databases was provided as part of the course material. Owner has to the best of their ability removed and replaced any potentially harmful content in the articles table. Any remaining data is not necessarily an accurate reflection of the repo owner's beliefs.