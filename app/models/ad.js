var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
    url: String,
    desc: String,
    size: {
        w: Number,
        h: Number
    },
    
    position: {
        name: String,
        position: String,
        _id: String
    },
    open: {
        type: Boolean,
        default: false
    },
	link: String,
    img: String,
    content: String,
    status: {
        type: Boolean,
        default: false
    },
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('ads', model);