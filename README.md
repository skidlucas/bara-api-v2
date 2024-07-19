# Bara API

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment
This uses Google CloudRun and Firebase Hosting. I mainly followed this [tutorial](https://www.tomray.dev/deploy-nestjs-cloud-run). <br>
The following commands are not necessary because the deployment is automatic with GitHub Actions.

```bash
# deploy current source code manually
$ yarn gcloud:deploy

# deploy on firebase hosting (this has already been done, shouldn't be done again)
$ yarn firebase:deploy
```