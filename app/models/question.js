var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
    url: String,
	fullname: String,
    email: String,
    category: {
        _id: String,
        name: String,
        url: String
    },
    content: {
        q: String,
        a: String
    },
    status: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('questions', model);