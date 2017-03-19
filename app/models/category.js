var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
    type: {
    	_id: String,
    	name: String,
    	url: String
    },
    url: String,
    crt: {
    	type: Date,
    	default: Date.now()
    }
});

module.exports = mongoose.model('categories', model);
