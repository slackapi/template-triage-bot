# Steps to follow to run this code on your own

Follow these steps to run this code and start analyzing your own triage channels

## Part 0: Pre requisites
1. Your server will need to be publicly accessible via the internet.
    - Consider using [`ngrok`](https://api.slack.com/tutorials/tunneling-with-ngrok) if you're testing this out from your local machine.
        - For example, if you will be running this bot locally on the default port of 3000, you can run `ngrok http 3000` and you'll get a `https://x.ngrok.io` forwarding URL. Subsitute `x.ngrok.io` for all references of `your-host` in the rest of this document

1. You'll need the following installed on your server.
    - NodeJS and it's package manager `npm`
    - MongoDB

2. Download this codebase (using `git clone`, for example)

## Part 1: Setup your Slack app 

In your preferred web browser:

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps)

2. Go to **Interactivity & Shortcuts** 
    - Enable Interactivity
    - Enter your Interactivity Request URL: `https://your-host/slack/events`
    - Create a new Shortcut
      - Select **Global** shortcut
      - Choose a descriptive name and description for your shortcut, for example:
        - Name: Show triage stats
        - Description: Calculate stats for a triage channel
      - For the Callback ID, it is important you set it to `triage_stats`
    - Enter your Select Menus Options Load URL `https://your-host/slack/events`


3. Go to **OAuth & Permissions** to add a bot scope
    - Under **Redirect URLs**
      - Add `https://your-host/slack/oauth_redirect`
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


## Part 2: Configure and start your app

The following steps will use a combination of your server's command line and a web browser:

1. Populate your `.env` file with the contents of `.env.example` but with your own values.
    ```
    SLACK_CLIENT_ID=
    SLACK_CLIENT_SECRET=
    SLACK_SIGNING_SECRET=
    SLACK_BOT_SCOPES=channels:history,channels:join,channels:read,chat:write,commands,files:write
    MONGODB_URI=mongodb://localhost/triage_bot
    ```
    - `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, and `SLACK_SIGNING_SECRET` can be found on your new application's **Basic Information** page
    - `SLACK_BOT_SCOPES` can be left as the values shown above
    - `MONGODB_URI` should be the [full URI for your MongoDB connection](https://docs.mongodb.com/manual/reference/connection-string/). The example assumes you are running mongodb locally on the default port,  without any authentication, and you want this application to store content in the 'triage_bot' database.

2. Run `npm install` to install code-level dependencies such as Bolt for Javascript, Mongoose, etc.

3. Start your application! You have two options:
    - `npm start` will start your application in normal mode
    - `npm run debug` will start your application in debug / watch mode, powered by [Nodemon](https://nodemon.io/)

    At this point, your application should be accessible at `https://your-host`.
    
    If you're using ngrok, you'll want to start your tunnel with `ngrok http 3000` (adding `-subdomain your-subdomain` if you have a paid Ngrok account)

    You can verify that your server is up and accessible by going to `https://your-host/slack/install` in your browser. If you see an 'Add to Slack' Button, you are good to go!


4. Now that your application is running, add your [Slack Events API](https://api.slack.com/events-api) subscriptions by going back to your app config and visiting the **Event Subscriptions** page.
    - Toggle "Enable Events" to "On"
    - Enter `https://your-host/slack/events` as your Request URL
      - In a few seconds, you should see 'Verified ✔️' in green text.
    - Under "Subscribe to bot events", add the `app_home_opened` event
    - Click Save Changes

## Part 3: Install and use your app

Back in your preferred web browser...

1. Install your app by visiting [`https://your-host/slack/install`](https://your-host/slack/install) and clicking the 'Add to Slack' button. 

2. Try out your app!
    1. Visit your app's App Home tab to see the current configuration (you can edit `config.js` and restart the application to make changes)
    2. Execute your shortcut by entering "Show triage stats" in the quick switcher (CMD+k) or by using the lightning bolt ⚡️ symbol right below the message input field in Slack and filling out the form. You should receive a DM from the bot.
    3. Wait for the (by default) top-of-the-hour hourly update in any channel the bot has been invited to.

3. Lastly, note that in the default configuration of this app, you should have one and only one Node process running at a time as the scheduled reminder functionality runs _within_ the web application code courtesy of `node-cron`.
    - In production, you may want to disable this and outsource the scheduling to `crontab` or another schedule service/daemon.