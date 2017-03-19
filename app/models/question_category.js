var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
	url: String,
    status: {
        type: Number,
        default: 1
    },
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('question_categories', model);