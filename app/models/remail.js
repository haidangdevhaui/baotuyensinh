var mongoose = require('mongoose');
var model = mongoose.Schema({
	email: String
});

module.exports = mongoose.model('remails', model);

