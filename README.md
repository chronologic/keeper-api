# keeper-api

This is a supporting repository for the [Keeper project](https://github.com/chronologic/keeper-service).

## Repository overview

This repository holds the REST API service for the Keeper UI.

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, and `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name        | Type     | Default | Description                                                                     |
| ----------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `LOG_LEVEL` | `string` | `info`  | Standard [`npm`](https://github.com/winstonjs/winston#logging-levels) log level |
| `PORT`      | `number` | `3000`  | Port number that the API will listen on                                         |
| `DB_URL`    | `string` |         | PostgreSQL connection string                                                    |

## Deployment

You may deploy this service to e.g. https://www.heroku.com/

## Building

Run `npm run build`.

## Development

Run `npm run dev`.
