var mongoose = require('mongoose');
var model = mongoose.Schema({
    name: String,
    position: String,
    size: {
        w: Number,
        h: Number
    },
    crt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('position_ads', model);