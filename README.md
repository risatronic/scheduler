# Interview Scheduler
 
 Interview Scheduler is a Single Page Application built using React. Data persists via an API server using a PostgreSQL database and is communicated between the client application and API server over HTTP, using JSON format. Project includes Jest & Cypress tests.

 A user can switch between days and book new interviews, as well as edit or cancel existing ones. If this cannot be accomplished, an error message will be displayed following a status indicator. The number of available interview spots for each day updates dynamically as interviews are added or cancelled, and remains static if they are edited.

 ## Final Product

!["Creating a new appointment"](https://github.com/risatronic/scheduler/blob/master/docs/1-create.png)
![]()
![]()
![]()

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress End-to-End Tests

```sh
npm run cypress
```

