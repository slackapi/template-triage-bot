// ======================================
// === Miscellaneous helper functions ===
// ======================================

// Simple blocking sleep function (in milliseconds)
function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

// Take a config object and map fields
function triageLabelMappedToField (triageConfig, label, field) {
  const labelValues = Object.keys(triageConfig[label])
  return Object.assign(
    {},
    ...labelValues.map(e => {
      return { [e]: triageConfig[label][e][field] }
    })
  )
}

// Take a config object and return it along with some calculated objects
function generateTriageConfigLookups (triageConfig) {
  // Calculate list of levels
  const levels = Object.keys(triageConfig.levels)

  // Generate mapping of levels to emoji
  const levelToEmoji = triageLabelMappedToField(
    triageConfig,
    'levels',
    'emoji'
  )

  // Calculate list of statuses
  const statuses = Object.keys(triageConfig.statuses)

  // Generate mapping of status to emoji
  const statusToEmoji = triageLabelMappedToField(
    triageConfig,
    'statuses',
    'emoji'
  )

  return {
    levels,
    levelToEmoji,
    statuses,
    statusToEmoji
  }
}

module.exports = {
  sleep,
  triageLabelMappedToField,
  generateTriageConfigLookups
}
