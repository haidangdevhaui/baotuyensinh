var mongoose = require('mongoose');
var model = mongoose.Schema({
    score: Number,
    ip: String,
    crt: {
    	type: Date,
    	default: Date.now()
    }
});

module.exports = mongoose.model('votes', model);
