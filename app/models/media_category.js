var mongoose = require('mongoose');
var model = mongoose.Schema({
	url: String,
	type: String,
    name: String,
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('media_categories', model);