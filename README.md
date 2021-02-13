# keeper-api

This is a supporting repository for the [Keeper project](https://github.com/chronologic/keeper-service).

## Repository overview

This repository holds the REST API service for the Keeper UI.

## Environment variables

This repo uses [`dotenv`](https://www.npmjs.com/package/dotenv) to load environment variables.

For development, and `.env` file should be created based on the `.env.example` template file. The `.env` file should never be commited.

In production, environment variables can be injected directly.

Below is a list of possible environment variables.

| Name               | Type     | Default | Description                                                                                                                                                   |
| ------------------ | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LOG_LEVEL`        | `string` | `info`  | Standard [`npm`](https://github.com/winstonjs/winston#logging-levels) log level                                                                               |
| `PORT`             | `number` | `3001`  | Port number that the API will listen on                                                                                                                       |
| `DB_URL`           | `string` |         | PostgreSQL connection string                                                                                                                                  |
| `MIN_LOT_SIZE_BTC` | `number` | `1`     | For smaller lot sizes it may be cheaper to get liquidated than to redeem. This should be set to match the value in `keeper-service`                           |
| `MAX_LOT_SIZE_BTC` | `number` | `1000`  | This is used mainly for testing/dev purposes to force the system to only redeem specific lot sizes. This should be set to match the value in `keeper-service` |

## Deployment

This project is configured to be deployed on https://heroku.com. The deployment config can be found in `Procfile`.

Detailed deployment instructions can be found [here](https://devcenter.heroku.com/articles/deploying-nodejs).

## Building

Run `npm run build`.

## Development

Run `npm run dev`.
