var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
    url: String,
    category: [],
    crt: {
    	type: Date,
    	default: Date.now()
    }
});

module.exports = mongoose.model('types', model);
