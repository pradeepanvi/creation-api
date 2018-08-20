var mongoose = require('mongoose');

var Creation = mongoose.model('Creation', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
})

module.exports = {Creation}