[![Build Status](https://api.travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard.svg?branch=master)](https://travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard)
[![Coverage Status](https://coveralls.io/repos/github/mozilla-frontend-infra/firefox-health-dashboard/badge.svg?branch=master)](https://coveralls.io/github/mozilla-frontend-infra/firefox-health-dashboard?branch=master)

# Firefox health dashboard

This project show Firefox metrics and insights to help meeting release criteria.
Find the official site [here](https://health.graphics/).
The repository for the backend can be found [here](https://github.com/mozilla/firefox-health-backend).

# Developing

## Prerequisites


### [Node](https://nodejs.org/en/)

Install Latest LTS Version: 10.15.2 (includes npm 6.4.1)
Binaries, installers, and source tarballs are available at
<https://nodejs.org/en/download/>.

To update your npm and install globally, type this into your terminal

```
npm install npm@latest -g

```
To test Node. To see if Node is installed, open the Windows Command Prompt, Powershell or a similar command line tool

```
npm -v
```
### [Yarn](https://www.npmjs.com/package/yarn)

[yarn](https://yarnpkg.com/) is a fast, reliable, and secure dependency management tool. You can now use yarn to install reason and manage its dependencies.

To install Yarn, it is best to [consult the official documentation](https://yarnpkg.com/en/docs/install) for your particular platform.

To install yarn globally using node, type this into your terminal

```
npm install -g yarn

```
## Testing 

```
yarn -v

```
## Building

First, fork this repository to another GitHub account. Then you can clone and install:

```
git clone https://github.com/<YOUR_ACCOUNT>/firefox-health-dashboard.git
cd firefox-health-dashboard
yarn install // This will install all dependencies
yarn start
```

This will start a local development server on [port 5000](http://localhost:5000).
Any ESLint errors across the project will be displayed in the terminal during development.

## Test local backend changes

In some cases, you might want to make changes to [the backend](https://github.com/mozilla/firefox-health-backend)
and test them locally. You can do so with `yarn start:local`.

## Troubleshooting

- `yarn reset` to clear the local cache

# Extra information
## Neutrino and preset

This project uses [Neutrino](https://github.com/neutrinojs/neutrino) and the
[@neutrinojs/react](https://neutrino.js.org/packages/react/) preset. You can read about all features included in this preset in [here](https://github.com/neutrinojs/neutrino/blob/master/docs/packages/react/README.md#features).

## Attributions

- heartbeat icon by Creative Stall from the Noun Project

# Making changes to a page
This project is still in development and only certain pages are easy to modify (e.g. the Android page).
In this section we will *only* be describing certain changes that are **very easy** to make and test.

The modern pages use two important components (**DashboardPage** and **Section**):
```javascript
<DashboardPage title='A title' subtitle='Some subtitle'>
  <Section title='The first section'>
    <div>Sample</div>
  <Section/>
  <Section title='Another section'>
    <div>Bar</div>
  </Section>
</DashboardPage>
```
Inside of a `DashboardPage` you include sections and inside of a `Section` you can use HTML tags or use React
containers. Read below for some documented containers.

NOTE: The `title` parameter is optional and it is available to most containers.



## Credit

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com) [![Greenkeeper badge](https://badges.greenkeeper.io/mozilla-frontend-infra/firefox-health-dashboard.svg)](https://greenkeeper.io/)
