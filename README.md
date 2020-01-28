<p align="center">
<img width="300" alt="FastFeet" src="./presentation/logo.png" />
</p>

<h1 align="center">FastFeet API from Rocketseat GoStack</h1>

<blockquote align="center">
:mag_right: Find devs near you and let's code!
</blockquote>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/LeuAlmeida/fastfeet.api?color=%2304D361">

  <a href="https://leunardo.dev">
    <img alt="Made by Léu Almeida" src="https://img.shields.io/badge/made%20by-Léu%20Almeida-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
</p>

<p align="center">
<img alt="FastFeet presentation" src="./presentation/presentation.png" />
</p>

## Introduction

[DevRadar](https://github.com/LeuAlmeida/devradar) is a fullstack project created to find developers near you based on your navigator location.
* In the [backend](./backend) you can use our API Restful to manage your application.
* In the [frontend version](./web) you can create and maintenance the list of devs.
* In the [mobile app](./mobile) you can view and find for devs near you.

This project was made using Node.js to create a Restful API based on Express and are supplied with a ReactJS FrontEnd application and React Native mobile app using Expo Cli.
All the knowledges available on this project was reached at the Omnistack Week 10 provided by [@Rocketseat](https://github.com/rocketseat).

## :electric_plug: Prerequisites

- [Node.js LTS (>= 10.x)](https://nodejs.org/)
- [Yarn (>= 1.19)](https://yarnpkg.com/) or [NPM (>= 6.9)](https://www.npmjs.com/)
- [Docker CE (>= 19.03.3)](https://docs.docker.com/install/)

## Quick Start

First get all the requirements installed on your system.
You will need to run the API using some Docker Images like [PostgreSQL](https://hub.docker.com/_/postgres) and [Redis](https://hub.docker.com/_/redis/).
Certified that do you have wall prerequisites, start the docker images dependencies:

```shell
# Change the <password> below and on .env file
$ sudo docker run --name fastfeet -e POSTGRES_PASSWORD=<password> -p 5432:5432 -d postgres:11
```


### :closed_lock_with_key: Getting started the API Restful backend

You will need to run the API using some Docker Images like [PostgreSQL](https://hub.docker.com/_/postgres) and [Redis](https://hub.docker.com/_/redis/).

```shell
# First of all, clone the project
$ git clone https://github.com/LeuAlmeida/devradar.git

# Enter in the DevRadar folder
$ cd fastfeet.api

# Install all dependencies using Yarn
$ yarn

# Copy the .env folder
$ cp .env.example .env

# Insert your environments into .env file
$ nano .env

# Migrate the database
$ yarn sequelize db:migrate

# Run the seeds
$ yarn sequelize db:seed:all

# Run the development server
$ yarn dev

# Case the output appears like this, is all ok
yarn run v1.19.1
$ nodemon src/index.js
[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node src/index.js`

# The backend will run on port 3333
# https://localhost:3333
```

## Routes

You can learn more about the (Routes)[./routes.MD], or you can see [the own file](./src/routes.js).

## Demo

You can try a DevRadar online demo in [https://1dois.com.br/devradar](https://1dois.com.br/devradar) (without navigator current location)

## :heavy_check_mark: Stack

|       Dependencies            |     Security and Prevent errors   |
|-------------------------------|:---------------------------------:|
|       Nodemon                 |     Bcrypt                        |
|       Bee-queue               |     Dotenv                        |
|       Express Handlebars      |     Express-async-errors          |
|       Pg and pg-hstore        |     JWT                           |
|       Sequelize               |     Sentry                        |
|       Express Handlebars      |     Youch                         |
|                               |     Yup                           |

## :copyright: License

MIT License.

See [LICENSE.md](LICENSE.md) for details.

<hr/>

<h3 align="center">
<a href="http://linkedin.com/in/leonardoalmeida99">Connect me in LinkedIn</a> | <a href="http://behance.net/almeida99">See my Behance</a> | <a href="https://leunardo.dev">Click here to go to my CV</a>
</h3>



# FastFeet API Restful

> Migrations

> Scripts

```js
$ yarn dev
```
> Docker

PostgreSQL:
`$ docker run --name fastfeet -e POSTGRES_PASSWORD=<PASSWORD> -p 5432:5432 -d postgres:11`
