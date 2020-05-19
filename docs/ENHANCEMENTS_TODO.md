# Enhancements and TODOs

- Create and populate a `docs/CONFIGURATION.md` that talks through the options in `config.js`
- Enhance App Home functionality :house:
  - [ ] Allow changing of configurations (TBD: per team or per app server?)
  - [ ] List team channels the app is in
  - [ ] Allow triggering of the reminder ad-hoc (per channel?)
- [ ] Look into encrypting tokens
  - need to rework upserting as Mongo field encryption helpers dont seem to like that)
- [ ] Unify/standardize logging (low priority; stdout should get slurped in most sensible deployment methods)
- [ ] Improve UX by displaying _n_ days instead of _x_ hours when _x_ > 24