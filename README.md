[![Build Status](https://api.travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard.svg?branch=master)](https://travis-ci.org/mozilla-frontend-infra/firefox-health-dashboard)
[![Coverage Status](https://coveralls.io/repos/github/mozilla-frontend-infra/firefox-health-dashboard/badge.svg?branch=master)](https://coveralls.io/github/mozilla-frontend-infra/firefox-health-dashboard?branch=master)

# Firefox health dashboard

This project show Firefox metrics and insights to help meeting release criteria.
Find the official site [here](https://health.graphics/).
The repository for the backend can be found [here](https://github.com/mozilla/firefox-health-backend).

# Developing

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/)
- [Yarn](https://www.npmjs.com/package/yarn)
- A fork of the repo (for any contributions)
- A clone of the [firefox-health-dashboard.git repo](https://github.com/mozilla-frontend-infra/firefox-health-dashboard.git) on your local machine


## Install node:

Binaries, installers, and source tarballs are available at
<https://nodejs.org/en/download/>.

#### Current and LTS Releases
<https://nodejs.org/download/release/>

## Install yarn:

[yarn](https://yarnpkg.com/) is a fast, reliable, and secure dependency management tool. You can now use yarn to install reason and manage its dependencies.

To install Yarn, it is best to [consult the official documentation](https://yarnpkg.com/en/docs/install) for your particular platform.

## Building

First, fork this repository to another GitHub account. Then you can clone and install:

```
git clone https://github.com/<YOUR_ACCOUNT>/firefox-health-dashboard.git
cd firefox-health-dashboard
yarn install// This will install all dependencies
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

## BugzillaGraph
Link to [source code](https://github.com/mozilla-frontend-infra/firefox-health-dashboard/blob/master/src/containers/BugzillaGraph/index.jsx).

<img width="599" alt="image" src="https://user-images.githubusercontent.com/44410/48093030-369b4400-e1dc-11e8-9da5-a481ce158809.png">

In a Bugzilla graph you want Bugzilla queries (generally two) to be plotted on a graph.
To do so, pass a `queries` array for each query you want with a `label` string and a `parameter` object with standard
Bugzilla parameters. The parameters use the same nomenclature you would use when doing a Bugzilla advanced search.
See code below for a sample.

You can use `startDate` with a date (YYYY-MM-DD) to start plotting the data from such date.
In other words, all bugs before that date will be counted as created on that date. This is useful if you
have bugs that were created few years ago and would make the X axis quite wide.

NOTE: This is the slowest container you will encounter as querying Bugzilla's APIs are quite slow.

Sample code:
```javascript
<BugzillaGraph
  queries={[
    {
      label: 'Open P1 bugs',
      parameters: {
        component: 'GeckoView',
        resolution: '---',
        priority: ['P1'],
      },
    },
    {
      label: 'Open backlog bugs',
      parameters: {
        component: 'GeckoView',
        resolution: '---',
        priority: ['P2', 'P3'],
      },
    },
  ]}
  startDate='2018-03-01'
  title='GeckoView bugs'
/>
```

## RedashContainer
Link to [source code](https://github.com/mozilla-frontend-infra/firefox-health-dashboard/blob/master/src/containers/RedashContainer/index.jsx).

The idea is pretty simple. If you can create a Redash query that can plot what you want then you can include it
in a Firefox Health page. Changes on Redash will immediately be reflected

On the screenshot below you can see the original Redash query and the same graph within Firefox Health:
<img width="716" alt="image" src="https://user-images.githubusercontent.com/44410/48093855-7fec9300-e1de-11e8-8fa5-b3cc4427b7af.png">
<img width="594" alt="image" src="https://user-images.githubusercontent.com/44410/48093706-18cede80-e1de-11e8-8531-13d8231d8ca2.png">

All you need for this to work is to pass a URL to the Redash query by using `redashQueryUrl` and give a URL to the
actual JSON data with `redashDataUrl`. See sample code below.

You can find the JSON URL under the hamburger menu:

<img width="177" alt="image" src="https://user-images.githubusercontent.com/44410/48093942-c3470180-e1de-11e8-9846-e3f8cb0dfb01.png">

Sample code:
```javascript
<RedashContainer
    title='Total content page load time'
    redashDataUrl='https://sql.telemetry.mozilla.org/api/queries/59397/results.json?api_key=u9eculhXgxqgsluxYGxfXaWQ6g7KCXioEvfwjK83'
    redashQueryUrl='https://sql.telemetry.mozilla.org/queries/59397'
  />
```

## PerfherderGraphContainer

Link to [source code](https://github.com/mozilla-frontend-infra/firefox-health-dashboard/blob/master/src/containers/PerfherderGraphContainer/index.jsx).

<img width="590" alt="image" src="https://user-images.githubusercontent.com/44410/48094051-1d47c700-e1df-11e8-94bf-8b9f4c879594.png">

The Perfherder graphs plot a number of data series which need to be uniquely identified. The parameters used in
here have a similar nomenclature as Perfherder uses. The parameters are used to uniquely identify a series.

Use [Perfherder](https://treeherder.mozilla.org/perf.html#/graphs) directly to determine what are the parameters and values you need. See screenshot below.

<img width="268" alt="image" src="https://user-images.githubusercontent.com/44410/48094394-12416680-e1e0-11e8-8bec-04c8fa2cf95b.png">

Pass a `series` array with each element describing one of your data series. To define a series you need these parameters:

* label - It will be the legend value
* frameworkId - 1 for Talos, 10 for Raptor and 11 for js-bench.
* platform - Use Perfherder to determine value
* option - Normally 'opt', 'debug' or 'pgo'
* extraOption - **OPTIONAL** - Normally set it to `['e10s', 'stylo']`
  * This only applies to Performance jobs using the Talos benchmark
  * On Perfherder, you will see the test being named `sessionrestore opt e10s stylo`. All the strings after the `option`
    (in our case the word `opt`) is to be listed inside of an array
* project - 'mozilla-central'
  * This is the `repo` parameter on Treeherder - https://treeherder.mozilla.org/#/jobs?repo=mozilla-central
* suite - This is equivalent to `test` on Perfherder
  * On the screenshot above you will see `raptor-assorted-dom-chrome opt`. We only want the first part
    before the white space.

You can also pass an optional `timerange` value, however, this is not necessary for most cases.

NOTE: If you want to add Chrome jobs, you have to notice that they're not running on the same platform as the Firefox jobs.
This means that you need to append `-nightly` to it (e.g. `linux64` -> `linux64-nightly`).

Sample code:
```javascript
<PerfherderGraphContainer
  title='Speedometer'
  series={[
    {
      label: 'Moto G5 (arm7)',
      frameworkId: 10,
      platform: 'android-hw-g5-7-0-arm7-api-16',
      option: 'opt',
      project: 'mozilla-central',
      suite: 'raptor-speedometer-geckoview',
    },
    {
      label: 'Pixel 2 (arm7)',
      frameworkId: 10,
      option: 'opt',
      platform: 'android-hw-p2-8-0-arm7-api-16',
      project: 'mozilla-central',
      suite: 'raptor-speedometer-geckoview',
    },
    {
      label: 'Pixel 2 (ARM64)',
      frameworkId: 10,
      option: 'opt',
      platform: 'android-hw-p2-8-0-android-aarch64',
      project: 'mozilla-central',
      suite: 'raptor-speedometer-geckoview',
    },
  ]}
/>
```

## Credit

[![Netlify](https://www.netlify.com/img/global/badges/netlify-color-accent.svg)](https://www.netlify.com)
