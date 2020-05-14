// ======================
// === Database setup ===
// ======================

// External dependencies
// We'll use Mongoose for our database layer/ORM
const mongoose = require('mongoose')

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }
)

// Define a schema for AuthedTeam
const authedTeamSchema = mongoose.Schema(
  {
    id: { type: String, index: true, unique: true }
  },
  { strict: false, timestamps: { createdAt: 'db_record_created_at', updatedAt: 'db_record_updated_at' } }
)
const AuthedTeam = mongoose.model('AuthedTeam', authedTeamSchema)

module.exports = { AuthedTeam }
