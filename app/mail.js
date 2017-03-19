var config = require('../config/config');
module.exports = function(mailOptions){
	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport('smtps://' + config.mail.user + ':'+ config.mail.password +'@smtp.gmail.com');

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	    info;
	});
}