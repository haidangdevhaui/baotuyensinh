var User = require('./models/user');
var passport = require('passport'),
    flash = require('connect-flash'),
    hash  = require('password-hash'),
    Key = require('./models/key'),
    Remail = require('./models/remail'),
    Config = require('../config/config'),
    path = require('path'),
    LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done('Tên đăng nhập hoặc mật khẩu không hợp lệ', null);
        }
        if (!hash.verify(password, user.password)) {
            return done('Tên đăng nhập hoặc mật khẩu không hợp lệ', null);
        }
        if(user.status == 0){
            return done(null, false, 'Tài khoản chưa được kích hoạt');
        }
        return done(null, user);
    });
}));
module.exports = function(app) {
    app.get('/admin', function(req, res) {
        if (req.user) {
            if(req.user.auth == 0){
                return res.redirect('/');
            }
            return res.redirect('/dashboard');
        }
        res.render('member/login', {layout: 'layoutnull'});
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                if(req.xhr){
                    return res.json({
                        result: false,
                        error: err
                    });
                }
                if(req.body.type == "member"){
                    req.flash('message', err);
                    return res.redirect('/dang-nhap');
                }
                return res.redirect('/login');
            }
            if(info){
                if(req.xhr){
                    return res.json({
                        result: false,
                        error: info
                    });
                }
                if(req.body.type == "member"){
                    req.flash('message', info);
                    return res.redirect('/dang-nhap');
                }
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                if (user.auth == 1 || user.auth == 2) {
                    if(req.xhr){
                        return res.json({
                            result: true,
                            isAdmin: true
                        });
                    }
                    res.redirect('/dashboard');
                }
                if (user.auth == 0) {
                    if(req.xhr){
                        return res.json({
                            result: true,
                            isAdmin: false
                        });
                    }
                    res.redirect('/');
                }
                
            });
        })(req, res, next);
    });

    app.get('/dashboard/*', isAdmin,  function(req, res) {
        res.render('dashboard', {layout: 'layoutnull', libs: getFiles('client')});
    });
    app.get('/dashboard', isAdmin, function(req, res) {
        res.render('dashboard', {layout: 'layoutnull', libs: getFiles('client')});
    });
    app.post('/register', function(req, res) {
        User.findOne({
            email: req.body.email
        }, {
            username: req.body.username
        }, function(err, u) {
            if (u) {
                if(req.xhr){
                    return res.json({
                        result: false,
                        error: 'Email hoặc tên đăng nhập đã tồn tại'
                    });
                }
                return res.redirect('/');
            } else {
                req.body.password = hash.generate(req.body.password);
                new User(req.body).save(function(err, u) {
                    if(req.body.received == true){new Remail({email: req.body.email}).save()};
                    new Key({email: req.body.email}).save(function(err, k){
                        require('./mail')({
                            from: "Báo tuyển sinh",
                            to: req.body.email,
                            subject: "Kích hoạt tài khoản",
                            text: '',
                            html: '<div style="background:#18A689;color:#FFF;padding:10px;line-height:30px;width:500px">Chào bạn, chúng tôi nhận được yêu cầu đăng ký thành viên của bạn.Hãy nhấn vào <a href="' + config.domain + '/active-account?key='+k.key+'">đây</a> để kích hoạt tài khoản.Xin cảm ơn!<br/>(Chú ý: Liên kết này sẽ hết hạn trong vòng 24h kể từ thời điểm đăng ký)</div>'
                        });
                        if(req.xhr){
                            return res.json({
                                result: true,
                                message: 'Đăng ký thành công, hãy kiểm tra email để kích hoạt tài khoản của bạn'
                            });
                        }
                        req.flash('message', 'Đăng ký thành công, hãy kiểm tra email để kích hoạt tài khoản của bạn');
                        res.redirect('/thong-bao');
                    });
                });
            }
        });
    });
    app.route('/restore-password').post(function(req, res){
        User.findOne({email: req.body.email}, function(err, u){
            if(!u){
                if(req.xhr){
                    return res.json({
                        result: false,
                        error: 'Email không tồn tại'
                    });
                }
            }
            var newPw = generatePassword();
            u.password = hash.generate(newPw);
            u.save();
            
            require('./mail')({
                from: "Báo tuyển sinh",
                to: req.body.email,
                subject: "Khôi phục mật khẩu",
                text: '',
                html: '<div style="background:#18A689;color:#FFF;padding:10px;line-height:30px;width:500px">Chào bạn, chúng tôi nhận được yêu cầu khôi phục mật khẩu của bạn.Mật khẩu mới của bạn là <i><b>' + newPw + '</b></i><br/>Hãy tiến hành đổi mật khẩu ngay sau khi đăng nhập để bảo mật tài khoản của bạn.Xin cảm ơn!</div>'
            });
            
            if(req.xhr){
                return res.json({
                    result: true,
                    message: 'Chúng tôi đã gửi email kèm mật khẩu mới đến địa chỉ email của bạn.Vui lòng kiểm tra email'
                });
            }
        });
        
    }).get(function(req, res){

    });
    app.get('/active-account', function(req, res){
        Key.findOne({key: req.query.key}, function(err, k){
            if(!k){
                return res.redirect('/');
            }
            if(Date.now() < k.timeout){
                User.findOne({email: k.email}, function(err, u){
                    u.status = 1;
                    u.save(function(err, u){
                        Key.remove({key: req.query.key}).exec();
                        req.flash('message', 'Kích hoạt tài khoản thành công!');
                        return res.redirect('/thong-bao');
                    });
                });
            }else{
                Key.remove({key: req.query.key}).exec();
                req.flash('message', 'Đường dẫn kích hoạt tài khoản đã hết hạn!');
                return res.redirect('/thong-bao');
            }
        });
    });
    app.get('/api/v1/user', function(req, res) {
        if (req.user) {
            req.user.password = null;
        }
        res.json(req.user);
    });
    app.get('/logout', function(req, res) {
        var auth = req.user.auth;
        req.logout();
        if(auth == 0){
            return res.redirect('/');
        }
        return res.redirect('/login');
    });
    app.post('/profile/update', isLoggedIn, function(req, res){
        User.findById(req.user._id, function(err, u){
            // if(u.email == req.body.email);
            User.update({_id: req.user._id}, req.body, function(err, u){
                return res.redirect('/thong-tin-ca-nhan');
            })
        });
    });
    
    function isLoggedIn(req, res, next) {
        if (req.user) {
            return next();
        }
        return res.redirect('/');
    }

    function isAdmin(req, res, next) {
        return next();
        if(!req.user){
            return res.redirect('/login');
        }
        if (req.user.auth == 1 || req.user.auth == 2) {
            return next();
        }
        return res.redirect('/');
    }

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
    function getFiles (dir, files_){
        files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, files_);
            } else {
                if(path.extname(name) == '.js'){
                    files_.push(name);
                }
            }
        }
        return files_;
    }

}