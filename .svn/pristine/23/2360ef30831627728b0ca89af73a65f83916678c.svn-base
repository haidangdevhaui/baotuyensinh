var mongoose = require('mongoose');
var model = mongoose.Schema({
	fullname: String,
	province: String,
	phone: String,
	birth: Date,
	gender: Number,
	avatar: {
		type: String,
		default: "/images/users/default.jpg"
	},
    username: String,
    password: String,
    email: String,
    auth: {
    	type: Number,
    	default: 0
    },
    manager: [],
    status: {
        type: Number,
        default: 0
    },
    desc: String,
    crt: Date
});

module.exports = mongoose.model('users', model);
