const {Schema, model} = require('mongoose')

const vimePlayer = new Schema({
	vimeToken: {type: String, unique: true, required: true},
	username: {type: String, required: true, required: true},
	teams: [{type: Array, ref: 'Team'}]
})

module.exports = model('vimePlayer', vimePlayer)
