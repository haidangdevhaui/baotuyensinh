var mongoose = require('mongoose');
var model = mongoose.Schema({
	type: {
		name: String,
		_id: String,
		url: String
	},
    media: String,
	url: String,
    name: String,
    video: {
        src: String,
        id: String
    },
    hot: {
        type: Boolean,
        default: false
    },
    images: [],
    tags: [],
    img: String,
    desc: String,
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('medias', model);