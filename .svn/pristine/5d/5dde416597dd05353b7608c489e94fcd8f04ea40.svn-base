'use strict'
var gulp = require('gulp') ,
    nodemon = require('gulp-nodemon'),
    config = require('./config/config');
    // Agenda = require('agenda');

// var agenda = new Agenda({
//     db: {
//         address: 'mongodb://127.0.0.1:27017/follow'
//     }
// });

gulp.task('default' , function() {
    nodemon({
        script : 'server.js' ,
        ext : 'js' ,
        ignore: ['client/*.js', 't.js', 'public/*.js'],
        env : {
            PORT : config.port
        }
    })
        .on('restart' , function() {
            // agenda.cancel({}, function(err, numRemoved) {});
            console.log('Restarting...')
        })
});