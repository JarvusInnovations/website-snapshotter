# website-snapshotter

A toolkit for visually tracking and reviewing changes to websites

## Adding a new site

- Create a directory named for the hostname of the site to capture
- Copy `capture.js` from another existing site directory into the new directory
- Update the root host URL on the first line
- Update pages list as needed

## Capturing/updating a site

- Change into a site directory: `cd my-site`
- Visit the host and copy your session handle: [http://example.org/login?format=json](http://example.org/login?format=json)
- Execute `node capture.js YOUR_SESSION_HANDLE`
- Review changes identified by git
- Commit and push new/changed screenshots to accept as new baseline

## TODO

- [X] Extract lib.js to a standalone npm module called `website-snapshotter`
- [ ] Include CLI command for creating a new site profile, creating directory and generating `capture.js` based on interactive prompts
- [ ] Support some basic authentication techniques that could be configured via `capture.js`'s call: HTTP auth, header, or cookie