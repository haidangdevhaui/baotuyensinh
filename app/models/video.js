var mongoose = require('mongoose');
var model = mongoose.Schema({
	type: {
		name: String,
		_id: String,
		url: String
	},
	url: String,
    name: String,
    content: [{
    	text: String,
    	src: String,
        id: String
    }],
    img: String,
    desc: String,
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('videos', model);