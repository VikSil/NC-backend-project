# Northcoders News API

This repository was created as during the [software development bootcamp by NorthCoders](https://northcoders.com/our-courses/coding-bootcamp), back-end project week.


## Setup instructions

Please follow these steps to run the project locally:
1. Clone this repo onto your machine - here are some [instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository), in case you are not familiar with cloning Git repos.
1. Create two files named: `.env.development` and `.env.test` These will contain environment variables necessary to connect to development and test databases.
    + Place the following line in `.env.development`:
        ```
        PGDATABASE=nc_news
        ``` 
    + Place the following line in `.env.test`:
        ```
        PGDATABASE=nc_news_test
        ``` 

