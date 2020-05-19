# Deploy this app using Heroku

Heroku is a cloud PaaS that supports several programming languages, including NodeJS. It's extra nifty as you can use it to deploy add-ons such as databases, performance management apps, and log analysis tools.

This repository has an [`app.json`](../app.json) ([learn more about this Heroku standard here](https://devcenter.heroku.com/articles/heroku-button#creating-the-app-json-file) so the steps below will help get a version of this code running in Heroku in a few steps. Let's go!

## Part 0: _Start_ to create a Heroku application from this template

1. Head on over to https://heroku.com/deploy?template=https://github.com/slackapi/template-triage-bot or use the button below:
    
    [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/slackapi/template-triage-bot)


2. Enter an app name and  make sure you see the green text "**awesome-app-name-you-entered** is available". In this example, your application will ultimately be deployed to `awesome-app-name-you-entered.herokuapp.com` and we'll need that domain in a second. 

3. Note that there are a few Add-ons (all free) and Config Vars pre-configured for you.

4. Before you can create the purple 'Deploy app', we need to create our Slack App and provide the last three Config Vars: `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET`

## Part 1: Setup your Slack app 

In a new tab, do the following. Be sure to replace `awesome-app-name-you-entered` with your actual app name you chose in Part 0 step 2.

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)


2. Go to **Interactivity & Shortcuts** 
    - Enable Interactivity
    - Enter your Interactivity Request URL: `https://awesome-app-name-you-entered.herokuapp.com/slack/events`
    - Create a new Shortcut
      - Select **Global** shortcut
      - Choose a descriptive name and description for your shortcut, for example:
        - Name: Show triage stats
        - Description: Calculate stats for a triage channel
      - For the Callback ID, it is important you set it to `triage_stats`
    - Enter your Select Menus Options Load URL `https://awesome-app-name-you-entered.herokuapp.com/slack/events`
    - Click Save Changes


3. Go to **OAuth & Permissions** to add a bot scope
    - Under **Redirect URLs**
      - Add a new Redirect URL: `https://awesome-app-name-you-entered.herokuapp.com/slack/oauth_redirect`
      - Click Save URLs
    - Under Scopes and **Bot Token Scopes**, 
        - Add `channels:read`, `channels:history`, and `channels:join` so our bot will be able to read the history of _public_ channels and join channels it's asked to analyze
        - Add `chat:write` and `files:write` so our bot can message users and upload files (CSV reports) as itself

4. Go to **App Home** 
    - Under Your App’s Presence in Slack
      - Optionally, update your app's Display/Bot and Default name
      - Optionally, choose to Always Show My Bot as Online
    - Under Show Tabs, toggle Home Tab on

5. If you plan to install your application to more than one workspace, go to **Manage Distribution** and activate public distribution

6. Go back to your new app's **Basic Information** page. We'll need to grab values from it in the next part.

## Part 2: _Finish_ creating your Heroku app and deploy it 🚀

1. Go back to your Heroky 'Create New App' browser tab and fill in last three Config Vars (`SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET`) with the values you find on your Slack app's **Basic Information** page.

2. Click the purple Deploy app button and wait a few moments

3. Once you see 'Your app was successfully deployed.' resist the urge to click 'View' just yet. We have one more Slack app feature to enable.

4. Now that your application is running at https://awesome-app-name-you-entered.herokuapp.com, add your [Slack Events API](https://api.slack.com/events-api) subscriptions by going back to your app config and visiting the **Event Subscriptions** page.
    - Toggle "Enable Events" to "On"
    - Enter `https://awesome-app-name-you-entered.herokuapp.com/slack/events` as your Request URL
      - In a few seconds, you should see 'Verified ✔️' in green text.
    - Under "Subscribe to bot events", add the `app_home_opened` event
    - Click Save Changes

## Part 3: Install and use your app

1. You can now click 'View' from the Heroku 'Create New App' page or go directly to  [`https://awesome-app-name-you-entered.herokuapp.com/slack/install`](https://awesome-app-name-you-entered.herokuapp.com/slack/install) and click the 'Add to Slack' button. 

2. Try out your freshly deployed app!
    1. Visit your app's App Home tab to see the current configuration (you can edit `config.js` and restart the application to make changes)
    2. Execute your shortcut by entering "Show triage stats" in the quick switcher (CMD+k) or by using the lightning bolt ⚡️ symbol right below the message input field in Slack and filling out the form. You should receive a DM from the bot.
    3. Wait for the (by default) top-of-the-hour hourly update in any channel the bot has been invited to.

3. Take a moment to check out your Heroku addon.
    - You should see that MongoLabs has some data in it
    - Consider adding other addons to help you manage your app such as Logentries for ingesting your logs and NewRelic for monitoring performance characteristics.

4. Lastly, note that in the default configuration of this app, you should have one and only one web dyno running at a time as the scheduled reminder functionality runs _within_ the web application code courtesy of `node-cron`.
    - In production, you may want to disable this and outsource the scheduling to [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler) or another service/add-on.