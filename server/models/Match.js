const { Schema, model } = require('mongoose')

const Match = new Schema({
  value: { type: String, unique: false },
  mapName: { type: String, unique: false, require: false },
  duration: { type: Number, unique: false, require: false },
  win: { type: Boolean, unique: false, require: true },
  date: { type: String, unique: false, default: Date.now() }
})

module.exports = model('Match', Match)
