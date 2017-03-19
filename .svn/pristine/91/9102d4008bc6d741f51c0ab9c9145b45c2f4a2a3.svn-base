var mongoose = require('mongoose');
var hash = require('password-hash');
var model = mongoose.Schema({
	email: String,
	key: {
		type: String,
		default: hash.generate(Math.random().toString()).toString().replace('/', '')
	},
	timeout: {
		type: String,
		default: 86400000 + Date.now()
	}
});

module.exports = mongoose.model('key', model);

