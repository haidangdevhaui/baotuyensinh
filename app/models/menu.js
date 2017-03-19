var mongoose = require('mongoose');
var model = mongoose.Schema({
	url: String,
    name: String,
    tid: String,
    sort: Number,
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('menus', model);