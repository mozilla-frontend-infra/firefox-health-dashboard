[![Build Status](https://api.travis-ci.org/mozilla/firefox-health-dashboard.svg?branch=master)](https://travis-ci.org/mozilla/firefox-health-dashboard)

# Firefox health dashboard

This project show Firefox metrics and insights to help meeting release criteria.
Find the official site [here](https://health.graphics/).
The repository for the backend can be found [here](https://github.com/mozilla/firefox-health-backend).

# Developing

## Prerequisites

- Node
- [Yarn](https://www.npmjs.com/package/yarn)

## Building

First, fork this repository to another GitHub account. Then you can clone and install:

```
git clone https://github.com/<YOUR_ACCOUNT>/firefox-health-dashboard.git
cd firefox-health-dashboard
yarn
```

## Neutrino and preset

Building this project uses [Neutrino](https://github.com/mozilla-neutrino/neutrino-dev) and
[@neutrinojs/react](https://neutrino.js.org/packages/react/). You can read about all features included with this preset in [here](https://github.com/mozilla-neutrino/neutrino-dev/blob/master/docs/packages/react/README.md#features).

## Testing changes

Install npm dependencies and start it up:

- `yarn`
- `yarn start`

This will start a local development server on [port 5000](http://localhost:5000).

Any ESLint errors across the project will be displayed in the terminal during development.

### Test local backend changes

- `yarn start:local`
  - This assumes you have started the backend on your localhost first

## Attributions

- heartbeat icon by Creative Stall from the Noun Project
