module.exports = {
  select_triage_channel: {
    callback_id: 'channel_selected',
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Triage stats',
      emoji: true
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            ':wave: Please select a channel to retrieve triage stats for.\n\n:warning: Note that a bot :robot_face: will be added to the selected public channel.'
        }
      },
      {
        type: 'divider'
      },
      {
        block_id: 'channel',
        type: 'input',
        element: {
          action_id: 'channel',
          type: 'conversations_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select a channel',
            emoji: true
          },
          default_to_current_conversation: true,
          filter: {
            include: ['public']
          }
        },
        label: {
          type: 'plain_text',
          text: 'Select a channel',
          emoji: true
        }
      },
      {
        block_id: 'n_hours',
        type: 'input',
        element: {
          action_id: 'n_hours',
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select how far to look back',
            emoji: true
          },
          initial_option: {
            value: '168',
            text: {
              type: 'plain_text',
              text: '7 days'
            }
          },

          options: [
            {
              value: '12',
              text: {
                type: 'plain_text',
                text: '12 hours'
              }
            },
            {
              value: '24',
              text: {
                type: 'plain_text',
                text: '24 hours'
              }
            },
            {
              value: '72',
              text: {
                type: 'plain_text',
                text: '3 days'
              }
            },
            {
              value: '168',
              text: {
                type: 'plain_text',
                text: '7 days'
              }
            },
            {
              value: '720',
              text: {
                type: 'plain_text',
                text: '30 days'
              }
            }
          ]
        },
        label: {
          type: 'plain_text',
          text: ':1234: How far should we look back?',
          emoji: true
        }
      }
    ]
  }
}
