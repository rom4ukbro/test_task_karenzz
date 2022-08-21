<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Test task for [Karenzz](https://www.work.ua/jobs/by-company/1907455/) 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# e2e tests
$ npm run test:e2e
```
## Endpoints
First send a GET request to http://127.0.0.1:3000/users/testUsers to create test users

### transactions/balance
Description: get user balance

```typescript
// GET to http://127.0.0.1:3000/transactions/balance?user=1

// Query
  user: number 
  currency?: string
```
Response:
```json
{
    "balance": 0,
    "currency": "USD"
}
```

### transactions/replenishment
Description: create replenishment transaction to user

```json
// POST to http://127.0.0.1:3000/transactions/replenishment

// Body
  {
    "user": 1,
    "amount": 10,
    "bill": "billId"
  }
```
Response:
```json
{
    "_id": "62fd6a1d4cd8439368443b9a",
    "user": 1,
    "amount": 100,
    "bill": "billId",
    "type": "bill",
    "createdAt": "2022-08-17T22:22:22.222Z",
    "updatedAt": "2022-08-17T22:22:22.222",
    "__v": 0
}
```

### transactions/buying
Description: create buying transaction to user

```json
// POST to http://127.0.0.1:3000/transactions/buying

// Body
  {
    "user": 1,
    "amount": 10,
    "bill": "billId"
  }
```
Response:
```json
{
    "_id": "62fd5dcaab12548bb87fea53",
    "user": 1,
    "amount": 100,
    "bill": "billId",
    "type": "bill",
    "createdAt": "2022-08-17T22:22:22.222Z",
    "updatedAt": "2022-08-17T22:22:22.222Z",
    "__v": 0
}
```

### transactions/p2p
Description: create p2p transaction

```json
// POST to http://127.0.0.1:3000/transactions/p2p

// Body
  {
    "user": 1,
    "userTo": 2,
    "amount": 10
  }
```
Response:
```json
{
    "_id": "62fd383e7b5a3e4b5cd1bdc5",
    "user": 1,
    "amount": 100,
    "userTo": 2,
    "type": "p2p",
    "createdAt": "2022-08-17T22:22:22.222Z",
    "updatedAt": "2022-08-17T22:22:22.222Z",
    "__v": 0
}
```

### transactions/:id
Description: get transactions list

```typescript
// Param
  id: number // Is user id
// Query
  page?: number
  limit?: number
  sort?: string
```

```json
// GET to http://127.0.0.1:3000/transactions/1?page=1&limit=5&sort=-createdAt
// Response:
{
    "transactions": [
        {
            "_id": "62fd30abb0a0476ec005ff24",
            "user": 1,
            "amount": 100,
            "bill": "afdfadf235ijlnv",
            "type": "bill",
            "createdAt": "2022-08-17T18:17:15.920Z"
        },
        ...
    ],
    "count": 6
}
```

## Stay in touch

  Author - [Roman Ternovyi](https://github.com/rom4ukbro)
