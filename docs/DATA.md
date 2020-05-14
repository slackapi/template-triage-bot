# Data access, collection, and storage

As noted in other documentation, including [`SECURITY.md`](SECURITY.md), this application has been built to only ever have access to messages _public_ channels. This is a factor of the scopes defined in the Slack App Config (at https://api.slack.com/apps) and the scopes which are requested during the OAuth flow.

While messages in the public channels that the bot is added to are analyzed, they are not stored in the database.

The only information stored by the application is about the team the application has been installed into.
- The information the application stores is limited to the information that the [`oauth.v2.access`](https://api.slack.com/methods/oauth.v2.access) exposes which currently includes (but is not necessarilly limited to):
  - Application ID
  - Team name and ID
  - User _ID_ of the user who installed the application (just the Slack U-ID and not their name)
  - Scopes granted (only bot token scopes are requested)
  - API tokens (only a bot token is requested)
- This application stores this information in MongoDB in a collection called `authedteams`.