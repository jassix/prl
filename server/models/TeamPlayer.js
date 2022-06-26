const {Schema, model} = require('mongoose')

const TeamPlayer = new Schema({
	value: {type: String, unique: true},
	date: {type: String, unique: false, default: Date.now()},
})

module.exports = model('TeamPlayer', TeamPlayer)
