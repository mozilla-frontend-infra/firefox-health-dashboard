[![Build Status](https://api.travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard.svg?branch=master)](https://travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard)
[![Coverage Status](https://codecov.io/gh/mozilla-frontend-infra/firefox-health-dashboard/branch/master/graphs/badge.svg)](https://codecov.io/gh/mozilla-frontend-infra/firefox-health-dashboard?branch=master)

# Firefox health dashboard <a href="https://health.graphics/"> <img src="https://www.materialui.co/materialIcons/action/launch_black_36x36.png" alt="go to dashbaord"></a>

Show Firefox metrics and insights to help meeting release criteria.

# Development

## Prerequisites


### [Node](https://nodejs.org/en/)

Install Latest LTS Version: 10.15.2 (includes npm 6.4.1)
Binaries, installers, and source tarballs are available at
<https://nodejs.org/en/download/>.

To update your npm and install globally, type this into your terminal

```
npm install npm@latest -g

```
Verify node is installed, and see the version:

```
npm -v
```
### [Yarn](https://www.npmjs.com/package/yarn)

[yarn](https://yarnpkg.com/) is a fast, reliable, and secure dependency management tool. You can now use yarn to install reason and manage its dependencies.

To install Yarn, it is best to [consult the official documentation](https://yarnpkg.com/en/docs/install) for your particular platform.

Install Yarn globally:

```
npm install -g yarn

```
Verify the install worked, and see the version installed: 

```
yarn -v

```
## Installing

If you want to inspect the code, or want to make changes: Fork this repository to your GitHub account, then clone and install:

```
git clone https://github.com/<YOUR_ACCOUNT>/firefox-health-dashboard.git
cd firefox-health-dashboard
yarn install
```

## Development

Start a local development server on [port 5000](http://localhost:5000). 

```
yarn start
```

Any ESLint errors will pollute the console output during development. Many can be fixed with 

```
yarn lint --fix
```

You can run the tests with

```
yarn test 
``` 

Some tests use html templates for comparision.  If you change the page structure, then you must update the template:
 
```
yarn test -u
```

If you want feedback on your pull request, but tests do not pass yet, you can push with `--no-verify`:

```
git push --no-verify origin
``` 


## Troubleshooting

- `yarn reset` to clear the local cache

# Extra information

## Neutrino and preset

This project uses [Neutrino](https://github.com/neutrinojs/neutrino) and the
[@neutrinojs/react](https://neutrino.js.org/packages/react/) preset. You can read about all features included in this preset in [here](https://github.com/neutrinojs/neutrino/blob/master/packages/react/README.md#features).

## Attributions

- heartbeat icon by Creative Stall from the Noun Project


## Credit

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
