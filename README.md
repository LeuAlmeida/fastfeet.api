<p align="center">
<img alt="FastFeet" src="logo/fastfeet-api.png" />
</p>

<h1 align="center">FastFeet API from Rocketseat GoStack</h1>

<blockquote align="center">
:zap: API to obtain the GoStack bootcamp certify
</blockquote>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/LeuAlmeida/fastfeet.api?color=%2304D361">

  <a href="https://leunardo.dev">
    <img alt="Made by Léu Almeida" src="https://img.shields.io/badge/made%20by-Léu%20Almeida-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
  <a href="https://www.codacy.com/manual/LeuALmeida/fastfeet.api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leua-meida/fastfeet.api&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/147d0b2836734c79b7ee5ea035f065b4"/></a>
</p>

<!-- <p align="center">
<img alt="FastFeet presentation" src="./presentation/presentation.png" />
</p> -->

## Introduction

[Fastfeet](https://github.com/LeuAlmeida/fastfeet.api) is a fictitious logistic company and this repository belong to the business logic and is the basis of a general structure and all of this be a part of the [Rocketseat bootcamp](https://github.com/rocketseat) certify.
This API is based on Express for the overall structure, uses PostgreSQL for data storage, Redis for queue data control in conjunction with Bee-queue, and Sentry for error control and internal problem maintenance.
Functions general features that use SMTP to trigger e-mails are done through nodemailer using express-handlebars and nodemailer-express-handlebars are kept in the [src/app/views/emails](src/app/views/emails) folder.


## :electric_plug: Prerequisites

- [Node.js LTS (>= 10.x)](https://nodejs.org/)
- [Yarn (>= 1.19)](https://yarnpkg.com/) or [NPM (>= 6.9)](https://www.npmjs.com/)
- [Docker CE (>= 19.03.3)](https://docs.docker.com/install/)

## Quick Start

First get all the requirements installed on your system.
You will need to run the API using some Docker Images like [PostgreSQL](https://hub.docker.com/_/postgres) and [Redis](https://hub.docker.com/_/redis/).
Certified that do you have wall prerequisites, start the docker images dependencies:

```shell
# Change the <password> below and on .env file to run PostgreSQL
$ sudo docker run --name fastfeet -e POSTGRES_PASSWORD=<password> -p 5432:5432 -d postgres:11

# Execute the Redis docker
$ sudo docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine
```

### :closed_lock_with_key: Getting started the API Restful backend

Make a clone from the repo and install the dependencies

```shell
# First of all, clone the project
$ git clone https://github.com/LeuAlmeida/fastfeet.api.git

# Enter in the DevRadar folder
$ cd fastfeet.api

# Install all dependencies using Yarn
$ yarn
```

Certify yourself that all environments are correct

```shell
# Copy the .env folder
$ cp .env.example .env

# Insert your environments into .env file
$ nano .env

```

Prepare the PostgreSQL database

```shell
# Migrate the database
$ yarn sequelize db:migrate

# Run the seeds
$ yarn sequelize db:seed:all
```

Start the project

```shell
# Run the development server
$ yarn dev

# Case the output appears like this, is all ok
yarn run v1.19.1
$ nodemon src/server.js
[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r sucrase/register src/server.js`

# The backend will run on port 3333
# https://localhost:3333
```

In a separated terminal, run the queue

```shell
# Run the queue to enable mails and dependencies that uses bee-queue
$ yarn queue

# Case the output appears like this, is all ok
yarn run v1.19.1
$ nodemon src/queue.js
[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node -r sucrase/register src/queue.js`
```

## Routes

You can learn more about the [Routes](./ROUTES.md), or you can see [the own file](./src/routes.js).

## Demo

Live demo incoming.

<!-- You can try a DevRadar online demo in [https://1dois.com.br/devradar](https://1dois.com.br/devradar) (without navigator current location) -->

## :heavy_check_mark: Stack

| Dependencies       | Security and Prevent errors |
| ------------------ | :-------------------------: |
| Nodemon            |            Bcrypt           |
| Bee-queue          |            Dotenv           |
| Express Handlebars |    Express-async-errors     |
| Pg and pg-hstore   |             JWT             |
| Sequelize          |           Sentry            |
|                    |            Youch            |
|                    |             Yup             |

## :copyright: License

MIT License.

See [LICENSE](LICENSE) for details.

<hr/>

<h3 align="center">
<a href="http://linkedin.com/in/leonardoalmeida99">Connect me in LinkedIn</a> | <a href="http://behance.net/almeida99">See my Behance</a> | <a href="https://leunardo.dev">Click here to go to my CV</a>
</h3>
