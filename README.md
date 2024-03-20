<div align="center">
  <img alt="The icon of the website, showing stylized film perforations surrounding stylized diaphragm blades" src="public/android-chrome-512x512.png" width="192px" />
  <br />
  <h1><a href="https://bingobaby.sascha.app">Bingo, Baby</a></h1>
  <strong>Wann kommt das Baby? Und was wird es? Melde dich an und rate mit! 👶🏻🗳️📅</strong>
  <br />
  <br />
  <a href="https://github.com/saschazar21/bingobaby/actions/workflows/deploy.yml"><img alt="GitHub Actions: Deploy workflow" src="https://github.com/saschazar21/bingobaby/actions/workflows/deploy.yml/badge.svg" /></a> <img alt="License" src="https://img.shields.io/github/license/saschazar21/bingobaby" />
  <br />
  <br />
  <br />
</div>

## What is it?

This repository contains the source code of a website containing a game for guessing a baby's time of birth created using the [Remix](https://remix.run) framework.

## Getting started

### Prerequisites

The following prerequisites are needed to successfully launch this project locally:

#### Runtimes

- [Node.js v20+](https://nodejs.org/en/)

- [Yarn](https://yarnpkg.dev/) or similar
- [Docker](https://docker.com) - for running a local PostgreSQL container (optional)
- [Postman](https://www.postman.com/) - for interacting with the API (optional)

#### Remote services

- A hosted [PostgreSQL](https://www.postgresql.org/) database for storing guesses and user data, if not using Docker.
  - The [schema.sql](schema.sql) file contains the database migrations for setting up a PostgreSQL database.

#### Populating the `users` table

In order to provide a login functionality, any eligible participant has to be manually entered into the database upfront.

##### Adding a single user

A single user may be added using the following SQL statement:

```sql
INSERT INTO users (name) VALUES ('John Doe');
```

##### Adding multiple users in batch mode

Multiple users may be added at once using a `.csv` file in the following format:

```csv
name
Jane Doe
John Doe
```

Afterwards, the following SQL statement may be used to import the users from the `.csv` file:

```sql
COPY users (name)
FROM 'the-csv-file.csv'
DELIMITER ',' CSV HEADER;
```

### Quick start

1. Copy `.env.sample` to `.env` and populate the environment variables

   ```bash
   cp .env.sample .env
   ```

2. Install dependencies

   ```bash
   yarn # or npm install
   ```

3. Run the build

   ```bash
   yarn build # or npm run build
   ```

4. Run the local server

   ```bash
   yarn start # or npm start
   ```

--- OR ---

5. Run development preview

   ```bash
   yarn dev # or npm run dev
   ```

## Deployment

### Prerequisites

- A [Netlify](https://netlify.com) account

  - Remix supports other integrations as well. Check out the [Remix website](https://remix.run/) for getting to know how to switch to another hosting provider.

- Access to [GitHub Actions](https://docs.github.com/en/actions) for benefitting from an automated deployment integration (optional)

  - If used, environment variables listed in `.env.sample` need to be set in the repository settings at GitHub accordingly.

- A hosted [PostgreSQL](https://www.postgresql.org/) database for storing guesses and user data.
  - The [schema.sql](schema.sql) file contains the database migrations for setting up a PostgreSQL database.

## License

Licensed under the MIT license.

Copyright ©️ 2024 [Sascha Zarhuber](https://sascha.work)
