var mongoose = require('mongoose');
var model = mongoose.Schema({
	name: String,
	url: String,
	user: {
		_id: String,
		fullname: String,
		username: String,
		auth: Number,
		avatar: String
	},
	type: {
		_id: String,
		name: String,
		url: String,
	},
	category: {
		_id: String,
		name: String,
		url: String,
	},
	meta: {
		title: String,
		desc: String,
		keywords: String,
		robots: String,
		revisit: String
	},
	img: String,
	content: String,
	desc: String,
	tags: [],
	views: {
		type : Number,
		default: 0
	},
	status: {
		type: Number,
		default: 1
	},
	hot: {
		type: Boolean,
		default: false
	},
	crt: {
		type: Date,
		default: Date.now()
	},
	position: String,
	upt: Date
});

module.exports = mongoose.model('posts', model);
