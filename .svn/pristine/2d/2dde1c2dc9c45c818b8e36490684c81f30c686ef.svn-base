var mongoose = require('mongoose');
var model = mongoose.Schema({
	name: String,
	location: String,
	phone: String,
	fax: String,
	email: String,
	web: String,
	desc: String,
	img: String,
	sort: Number,
	status: Number,
	map: {
		lat: Number,
		lng: Number
	},
	content: String,
	crt: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('contacts', model);
