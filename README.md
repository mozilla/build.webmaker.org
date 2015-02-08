## build.webmaker.org

[![Build Status](https://travis-ci.org/mozilla/build.webmaker.org.svg?branch=master)](https://travis-ci.org/mozilla/build.webmaker.org)

Build is a site that we use to track what we are working on now and in the future. It provides a central resource for staff and contributors who are interested in the who, what, and how we build product for Webmaker.

## Getting Started

#### Clone & Install
```bash
git clone git@github.com:MozillaFoundation/build.webmaker.org.git
cd plan
cp env.sample .env
npm install
```

#### Edit .env
* `PLAN_SESSION_SECRET` should be whatever you want it to be.
* `PLAN_GITHUB_CLIENTID` and `PLAN_GITHUB_CLIENTSECRET` should be obtained by creating a new Developer Application in Github (https://github.com/settings/applications). For __Authorization callback URL__, make sure you use `/auth/github/callback` prefixed by the address of the host you use for the app.
* `PLAN_GITHUB_TOKEN` is optional but will help avoid rate limiting, and is a Personal Access Token generated on the same page.  It needs to have read:org permissions in order to do autocomplete based on teams in the /add field.
* `PLAN_GITHUB_HOST` is the url at which the server is running (for github oauth)

#### Run

In development mode, do:

```bash
gulp liveserver
```
This will do a full lint and full minification of the server on initial startup, but a lighter weight
(and much faster) reprocessing on changes it detects while the server is running.  Code changes
result in a server reload in <2s.  LESS changes are processed almost instantly.

Otherwise, you can start the server by simply running (note, you will have to restart the process to see changes):
```bash
node app.js
```

Once running you can view the local server by navigating to: 'http://localhost:8080'. If you prefer a different port, you can add a `PORT` variable to `.env`.

