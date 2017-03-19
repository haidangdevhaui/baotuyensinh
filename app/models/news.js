var mongoose = require('mongoose');
var model = mongoose.Schema({
	name: String,
	url: String,
	user: {
		name: String,
		auth: Number,
		avatar: String
	},
	type: Number,
	img: String,
	content: [{
		text: String,
		img: String
	}],
	desc: String,
	tags: [],
	crt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('news', model);
