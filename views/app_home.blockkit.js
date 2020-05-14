// External dependencies
// Crontstrue will help us convert cron expressions to human readable language
const cronstrue = require('cronstrue')

module.exports = function (userId, triageConfig) {
  const newLineInSectionBlockHack = ' \n'
  const indentationUsingWhitespaceHack = ' '

  // Format list of levels and statuses for display
  const levelsDisplay = triageConfig._.levels
    .map(l => {
      return `${indentationUsingWhitespaceHack.repeat(2)}${
        triageConfig._.levelToEmoji[l]
      } ${l}\n`
    })
    .join('\n')
  const statusesDisplay = triageConfig._.statuses
    .map(s => {
      return `${indentationUsingWhitespaceHack.repeat(2)}${
        triageConfig._.statusToEmoji[s]
      } ${s}\n`
    })
    .join('\n')

  const scheduledJobsDisplay = triageConfig.scheduled_reminders
    .map(reminderConfig => {
      const scheduleString = cronstrue.toString(reminderConfig.expression)
      const levelEmojis = reminderConfig.report_on_levels.map(
        l => triageConfig._.levelToEmoji[l]
      )
      const statusEmojis = reminderConfig.report_on_does_not_have_status.map(
        s => triageConfig._.statusToEmoji[s]
      )
      return `${indentationUsingWhitespaceHack.repeat(
        2
      )} ${scheduleString}, look for messages from the past ${
        reminderConfig.hours_to_look_back
      } hours.. \n\t\t\tthat contain any of the following emoji: ${levelEmojis.join(
        ' / '
      )}\n\t\t\tand do not have any of the following reactions: ${statusEmojis.join(
        ' / '
      )}`
    })
    .join('\n')

  // Return our JS object with values interpolated
  return {
    type: 'home',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:house: *Welcome Home* :house:\n\n:wave: Hi <@${userId}>, I am Triage Bot.${newLineInSectionBlockHack.repeat(
            2
          )}`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${newLineInSectionBlockHack}:question: *What is this?* :question:\n\nThis is the App Home for me, Triage Bot. I have two main jobs around here:\n\n:one: You can invite me to public channels and I will monitor for and remind the channel about messages that fit the criteria below (see _Scheduled Reminders_).\n\n:two: You can use my message shortcut :zap: to create ad-hoc reports on any public channel. I'll give you top-line stats and provide a CSV for offline analysis too.${newLineInSectionBlockHack.repeat(
            2
          )}`
        }
      },
      // {
      //   type: 'divider'
      // },
      // {
      //   type: 'section',
      //   text: {
      //     type: 'mrkdwn',
      //     text: `${newLineInSectionBlockHack}:construction: *Under Construction* :construction:\n\nMy home is actually a bit empty right now. Come back and visit me soon?${newLineInSectionBlockHack.repeat(
      //       2
      //     )}`
      //   }
      // },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${newLineInSectionBlockHack}:gear: *Current Configuration* :gear:`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `_Urgency levels_\n\n${levelsDisplay}`
          },
          {
            type: 'mrkdwn',
            text: `_Statuses_\n\n${statusesDisplay}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `_Scheduled Reminders_\n\n${scheduledJobsDisplay}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `${newLineInSectionBlockHack}Time for a change? You can edit these values in the 'config.js' file in the root of the code base.`
          }
        ]
      },
      {
        type: 'divider'
      }
    ]
  }
}
