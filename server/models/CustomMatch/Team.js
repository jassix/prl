const { Schema, model } = require('mongoose')

const Team = new Schema({
  players: { type: Array, unique: false, required: true }
})

module.exports = model('Team', Team)
