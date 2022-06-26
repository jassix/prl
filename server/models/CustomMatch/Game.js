const { Schema, model } = require('mongoose')

const Game = new Schema({
  id: { type: String, unique: true, require: true },
  mapName: { type: String, unique: false, require: true },
  startedTime: { type: Number, unique: false, require: false, default: Date.now() },
  players: { type: Array, ref: 'Players' },
  discordLink: { type: String, required: false, unique: false }
})

module.exports = model('Game', Game)
