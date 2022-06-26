const { Schema, model } = require('mongoose')

const Players = new Schema({
  username: { type: String, unique: true, required: true },
  id: { type: String, required: true, unique: false }
})

module.exports = model('Players', Players)
