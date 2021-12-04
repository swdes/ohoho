# Ohoho

## Install

- install node 14

  `nvm use`

- Firebase cli

  `npm install -g firebase-tools`

## Run locally

- from project root

  `firebase serve`

- from `./view`

  - you may need to adjust `./view/src/config.js` to point to the correct backend url

  - start the react build and watch

    `yarn start`

Then you can access the app on http://localhost:3000

## Deploy on production

`firebase deploy`
