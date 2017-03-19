var mongoose = require('mongoose');
var model = mongoose.Schema({
	url: String,
    name: String,
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('video_category', model);