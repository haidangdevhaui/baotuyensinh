var mongoose = require('mongoose');
var model = mongoose.Schema({
	ip: String,
	type: String,
	id: String,
	crt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('ips', model);

