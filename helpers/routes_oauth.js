// ===================================
// === Web routes for OAuth routes ===
// ===================================

module.exports = function (expressApp, slackInstaller) {
  // Redirect root route to /slack/install
  expressApp.get('/', async (req, res) => {
    res.redirect('/slack/install')
  })

  // Route to display 'Add to Slack' button
  expressApp.get('/slack/install', async (req, res, next) => {
    try {
      const url = await slackInstaller.generateInstallUrl({
        scopes: process.env.SLACK_BOT_SCOPES.split(','),
        metadata: ''
      })

      res.send(
        `<a href=${url}><img alt=""Add to Slack"" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>`
      )
    } catch (error) {
      console.error(error)
    }
  })

  // Route to redirect user
  expressApp.get('/slack/oauth_redirect', async (req, res) => {
    await slackInstaller.handleCallback(req, res, {
      success: (installation, metadata, req, res) => {
        res.send(`Thank you for installing! <a href='slack://app?team=${installation.team.id}&id=${installation.appId}&tab=home'>Click here to visit the app in Slack!</a>`)
      },
      failure: (error, installOptions, req, res) => {
        console.error(error, installOptions)
        res.send("Uh oh, there was an error while installing. Sorry about that. <a href='/slack/install'>Please try again.</a>")
      }
    })
  })
}
