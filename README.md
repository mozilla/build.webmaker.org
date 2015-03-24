## build.webmaker.org

[![Build Status](https://travis-ci.org/mozilla/build.webmaker.org.svg?branch=master)](https://travis-ci.org/mozilla/build.webmaker.org)

Build is a site that we use to track what we are working on now and in the future. It provides a central resource for staff and contributors who are interested in the who, what, and how we build product for Webmaker.

## Getting Started

#### Clone & Install
```bash
git clone git@github.com:MozillaFoundation/build.webmaker.org.git
cd build.webmaker.org
cp server/config/production.env.sample .env
npm install
```

#### Edit .env
* `PLAN_SESSION_SECRET` should be whatever you want it to be.
* `PLAN_GITHUB_CLIENTID` and `PLAN_GITHUB_CLIENTSECRET` should be obtained by creating a new Developer Application in Github (https://github.com/settings/applications). For __Authorization callback URL__, make sure you use `/auth/github/callback` prefixed by the address of the host you use for the app.
* `PLAN_GITHUB_TOKEN` is optional but will help avoid rate limiting, and is a Personal Access Token generated on the same page.  It needs to have read:org permissions in order to do autocomplete based on teams in the /add field.
* `PLAN_GITHUB_HOST` is the url at which the server is running (for github oauth)
* `FIREBASE_SECRET` is required. You can create a free Firebase App for dev work. (manage app > secrets)

#### Run

In development mode, do:

```bash
gulp liveserve
```
This will do a full lint and full minification of the server on initial startup, but a lighter weight
(and much faster) reprocessing on changes it detects while the server is running.  Code changes
result in a server reload in <2s.  LESS changes are processed almost instantly.

Once running you can view the local server by navigating to: http://localhost:8080. If you prefer a different port, you can add a `PORT` variable to `.env`.

#### Adding a new route

1. Add to `/app/components/app.jsx`
2. Create new .jsx file in `/components`
3. Add to `/server.js` to enable this page to be loaded directly

