const {Schema, model} = require('mongoose')

const Player = new Schema({
	username: {type: String, unique: true, required: true},
	rating: {type: Number, required: true, default: 1000},
	matches: [{type: Array, ref: 'Match'}]
})

module.exports = model('Player', Player)
