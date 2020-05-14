// ============================================
// === Helper functions related to messages ===
// ============================================

// External dependencies
// We use json2csv to convert our messages JS object to a CSV file
const { parse: parseJsonToCsv } = require('json2csv')

// Internal depencies
// Load our triage config
const triageConfig = require('./../config')

// The helper functions related to messages follow

// Recursive function to paginate through all history of a conversatoin
const getFullConvoHistory = async function (client, params, data = []) {
  const apiMethod = 'conversations.history'
  console.log(`Querying ${apiMethod} with ${JSON.stringify(params)}; already have ${data.length} in array`)

  return client.conversations
    .history(params)
    .then(response => {
      data.push(...response.messages)
      if (response.has_more === false) return data
      return getFullConvoHistory(
        client,
        Object.assign(params, {
          cursor: response.response_metadata.next_cursor
        }),
        data
      )
    })
    .catch(err => {
      console.error(JSON.stringify(err))
    })
}

// Get all messages for the past N hours
const getAllMessagesForPastHours = async function (channelId, nHoursToGoBack, client) {
  // Calculate begin time ("oldest") for analysis
  const beginAnalysisDate = new Date()
  beginAnalysisDate.setHours(beginAnalysisDate.getHours() - nHoursToGoBack)
  const oldest = Math.floor(beginAnalysisDate.getTime() / 1000)

  // Get all the messages
  const allMessages = await getFullConvoHistory(client, {
    channel: channelId,
    oldest
  })

  return allMessages
}

const filterAndEnrichMessages = function (messages, fromChannel, teamBotId) {
  // First, filter out messages from the team's bot
  const filteredMessages = messages.filter(m => {
    if (m.bot_id !== teamBotId) return true
  })

  // Create a new object we will enrich and return
  const enrichedMessages = filteredMessages

  // Loop through all messages and enrich them additional attributes so we can do filters on them later
  enrichedMessages.forEach(message => {
    // Add `channel` attribute with the channel we retrieved the message from
    message.channel = fromChannel

    // Add array attributes we will populate later
    message._statuses = []
    message._levels = []
    // Create a new `_reactions` attribute with an array of reacitons
    message._reactions = message.reactions
      ? message.reactions.map(r => `:${r.name}:`)
      : []

    // Populate `_level_XXX` attribute with boolean and add to array of _levels
    triageConfig._.levels.forEach(level => {
      if (message.text.includes(triageConfig._.levelToEmoji[level])) {
        message[`_level_${level}`] = true
        message._levels.push(level)
      }
    })

    // Populate `_status_XXX` attribute with boolean and add to array of _statuses
    triageConfig._.statuses.forEach(status => {
      if (message._reactions.includes(triageConfig._.statusToEmoji[status])) {
        message[`_status_${status}`] = true
        message._statuses.push(status)
      }
    })
  })

  return enrichedMessages
}

const messagesToCsv = function (messages) {
  try {
    // Create CSV header row
    const csvFields = [
      'channel',
      'ts',
      'type',
      'subtype',
      'user',
      'team',
      'text',
      'blocks',
      'attachments',
      '_reactions',
      '_levels',
      '_statuses'
    ]
    const statusFields = triageConfig._.statuses.map(s => `_status_${s}`)
    const levelFields = triageConfig._.levels.map(l => `_level_${l}`)
    const csvOpts = { fields: csvFields.concat(levelFields, statusFields) }
    const csvString = parseJsonToCsv(messages, csvOpts)
    return csvString
  } catch (e) {
    return ''
  }
}

module.exports = {
  getAllMessagesForPastHours,
  filterAndEnrichMessages,
  messagesToCsv
}
