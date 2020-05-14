# Known limitations and caveats

- While this application is multi-team aware, it does not have the concept of an Enterprise Grid.
  - It should work, but *must* be installed in every single workspace.
- OAuth flow does not protect against replay attacks; `date` field should be validated
- Nearly all the code is in `app.js` and it's getting messy. Things need to be refactored!
- Scheduled jobs will only work for bots in less than 100 channels (can be increased)

Also see `SECURITY.md`