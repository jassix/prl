const {Schema, model} = require('mongoose')

const Team = new Schema({
	name: {type: String, unique: true, required: true},
	rating: {type: Number, required: true, default: 1000},
	chief: {type: String, required: false, unique: true, default: ''},
	players: [{type: String, ref: 'TeamPlayer'}]
})

module.exports = model('Team', Team)
