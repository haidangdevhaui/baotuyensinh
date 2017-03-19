var mongoose = require('mongoose');
var model = mongoose.Schema({
	pid: String,
	user: {
		_id: String,
		fullname: String,
		username: String,
		auth: Number,
		avatar: String
	},
	content: String,
	status: {
		type: Number,
		default: 0
	},
	crt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('comments', model);
