var Posts = require('./models/posts'),
    Contact = require('./models/contact'),
    Menu = require('./models/menu'),
    Users = require('./models/user'),
    Comments = require('./models/comment'),
    Answers = require('./models/answer'),
    Quest = require('./models/question'),
    Types = require('./models/type'),
    Cates = require('./models/category'),
    Media = require('./models/media'),
    Vote = require('./models/vote'),
    Ip = require('./models/ip'),
    flash = require('connect-flash'),
    os = require('os'),
    CMedia = require('./models/media_category'),
    Ads = require('./models/ad'),
    Pad = require('./models/position_ad');
var Promise = require('bluebird'),
    mongoose = require('mongoose');
Promise.promisifyAll(mongoose);
module.exports = function(app) {
    app.use('/*', loadFrame);
    app.get('/', function(req, res) {
        res.render('home/index', {
            data: req.frame,
            title: 'Trang chủ'
        });
    });
    app.get('/tim-kiem', function(req, res) {
        res.send(req.query.s);
    });
    app.get('/thong-tin-ca-nhan', isLoggedIn, function(req, res) {
        res.render('home/profile', {
            data: req.frame,
            title: 'Thông tin cá nhân'
        });
    });
    app.get('/lol/lien-he', function(req, res) {
        Contact.findOne().exec(function(err, c) {
            req.frame.contact = c;
            res.render('home/contact', {
                data: req.frame,
                layout: 'layoutnull',
                title: 'Liên hệ'
            });
        });
    });
    app.get('/video', function(req, res) {
        res.render('home/video-category', {
            data: req.frame,
            title: 'Video'
        });
    });
    app.get('/hinh-anh', function(req, res) {
        res.render('home/image-category', {
            data: req.frame,
            title: 'Hình ảnh'
        });
    });
    app.get('/thong-bao', function(req, res) {
        res.render('home/report', {
            data: req.frame,
            title: 'Thông báo',
            message: req.flash('message')
        });
    });
    app.get('/dat-cau-hoi', function(req, res){
        Quest.find({});
        res.render('home/create-question', {
            data: req.frame,
            title: 'Đặt câu hỏi'
        });
    });
    app.post('/create-question', function(req, res){
        new Quest(req.body).save();
        req.flash('message', 'Câu hỏi của bạn đã được gửi đi');
        return res.redirect('/thong-bao');
    });
    app.get('/:p', function(req, res, next) {
        var cip = getClientIp();
        Posts.findOne({
            url: req.params.p
        }, function(err, p) {
            if (!p) return next();
            Ip.findOne({ip: cip, type: 'view', id: p._id}, function(err, ip){
                if(!ip){
                    new Ip({
                        ip: cip,
                        type: 'view',
                        id: p._id
                    }).save();
                    p.views = p.views + 1;
                    p.save(function(err, p){
                        returnPost(p);
                    });
                }else{
                    returnPost(p);
                }
            });
            function returnPost(p){
                req.frame.post = p;
                Comments.find({
                    pid: p._id
                }).sort({
                    _id: -1
                }).exec(function(err, c) {
                    renderComment(0, c, [], function(c) {
                        req.frame.comments = c;
                        res.render('home/post-detail', {
                            data: req.frame,
                            title: p.name,
                            message: req.flash('message')
                        });
                    });
                });
            }
        });
    });
    app.get('/:c', function(req, res, next) {
        Cates.findOne({
            url: req.params.c
        }).exec(function(err, c) {
            if (!c) return next();
            req.frame.category = c;
            if (req.query.page) {
                var page = req.query.page;
            } else {
                var page = 1;
            }
            if (req.query.record) {
                var record = req.query.record;
            } else {
                var record = 10;
            }
            Posts.find({
                'category.url': req.params.c
            }).exec(function(err, ps) {
                Posts.find({
                    'category.url': req.params.c
                }).sort({
                    _id: -1
                }).skip(page * record - record).limit(record).exec(function(err, p) {
                    req.frame.inCate = p;
                    res.render('home/category', {
                        data: req.frame,
                        total: Math.ceil(ps.length / record),
                        current: page,
                        title: c.name
                    });
                });
            });
        });
    });
    app.get('/:t', function(req, res, next) {
        Types.findOne({
            url: req.params.t
        }).exec(function(err, t) {
            if (!t) return next();
            req.frame.type = t;
            res.render('home/type', {
                data: req.frame,
                title: t.name
            });
        });
    });
    app.get('/media', function(req, res){
        res.render('home/media', {
            data: req.frame,
            title: 'Media'
        });
    });
    app.get('/:v', function(req, res, next) {
        Media.findOne({
            url: req.params.v,
            media: 'video'
        }, function(err, v) {
            if (!v) return next();
            req.frame.video = v;
            res.render('home/video-detail', {
                data: req.frame,
                title: v.name
            });
        })
    });
    app.get('/:ab', function(req, res, next) {
        Media.findOne({
            url: req.params.ab,
            media: 'image'
        }, function(err, img) {
            if (!img) return next();
            req.frame.image = img;
            res.render('home/image-detail', {
                data: req.frame,
                title: img.name
            });
        })
    })
    app.get('/:cm', function(req, res, next) {
        CMedia.findOne({
            url: req.params.cm
        }, function(err, c) {
            if (!c) return next();
            req.frame.cmedia = c;
            if (c.type == 'image') {
                return res.render('home/image-category-detail', {
                    data: req.frame,
                    title: c.name
                });
            }
            if (c.type == 'video') {
                return res.render('home/video-category-detail', {
                    data: req.frame,
                    title: c.name
                });
            }
        });
    });
    app.post('/comment/:pid', function(req, res) {
        if (req.body.cid) {
            new Answers({
                cid: req.body.cid,
                content: req.body.content,
                user: {
                    fullname: req.body.fullname,
                    username: req.body.email
                }
            }).save(function(err, a) {
                return res.redirect('/' + req.params.pid);
            });
        } else {
            new Comments({
                pid: req.params.pid,
                user: {
                    fullname: req.body.fullname,
                    username: req.body.email
                },
                content: req.body.content
            }).save(function(err, c) {
                return res.redirect('/' + req.params.pid);
            });
        }
    });

    app.route('/make-vote').post(function(req, res) {
        var cip = getClientIp();
        console.log(cip);
        Ip.findOne({
            ip: cip,
            type: 'vote'
        }, function(err, ip){
            console.log(ip);
            if(!ip){
                new Ip({
                    ip: cip,
                    type: 'vote'
                }).save();
                new Vote({
                    ip: cip,
                    score: req.body.score
                }).save();
                return execVote(req, res);
            }else{
                Vote.findOne({ip: cip}, function(err, v){
                    v.score = req.body.score;
                    v.save(function(err, v){
                        return execVote(req, res);
                    });
                });
            }
        });
    }).get(function(req, res) {
        return execVote(req, res);
    });

    function makeUrl(str) {
        var str = str.toString().trim().toLowerCase();
        return str.replace(/á|ạ|ả|ã|à|ă|ắ|ẳ|ặ|â|ấ|ậ|ẫ/g, 'a').replace(/é|ẹ|ẻ|è|ê|ế|ệ|ề|ể/g, 'e').replace(/ó|ọ|ỏ|ò|õ|ô|ố|ộ|ổ|ồ|ỗ|ố|ơ|ớ|ở|ờ|ợ/g, 'o').replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u').replace(/ì|í|ị|ỉ|ĩ/g, 'i').replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y').replace(/đ/g, 'd').replace(/:|( -)/g, '').replace(/\n|\r| /g, '-');
    }
    app.get('/*', function(req, res) {
        res.redirect('/');
    });

    function renderComment(i, arr, result, callback) {
        if (arr.length == 0) {
            return callback([]);
        }
        if (i < arr.length) {
            Answers.find({
                cid: arr[i]._id
            }).exec(function(err, a) {
                result.push({
                    comment: arr[i],
                    answers: a
                });
                i++;
                renderComment(i, arr, result, callback);
            });
        }
        if (i == arr.length) {
            return callback(result);
        }
    }

    function isLoggedIn(req, res, next) {
        if (req.user) {
            return next();
        }
        return res.redirect('/');
    }

    function loadFrame(req, res, next) {
        Promise.props({
            menu: Menu.find().sort({sort: 1}).execAsync(),
            posts: Posts.find().sort({
                _id: -1
            }).execAsync(),
            categories: Cates.find().execAsync(),
            types: Types.find().execAsync(),
            medias: Media.find().sort({
                _id: -1
            }).execAsync(),
            cmedias: CMedia.find().sort({
                _id: -1
            }).execAsync(),
            ads: Ads.find().sort({
                _id: -1
            }).execAsync(),
            pad: Pad.find().sort({
                _id: -1
            }).execAsync(),
            user: req.user,
            returnDate: returnDate,
            asset: asset
        }).then(function(results) {
            req.frame = results;
            return next();
        });
    }

    function execVote(req, res) {
        Vote.find({}, function(err, v) {
            var score = [0, 0, 0, 0];
            for (i = 0; i < v.length; i++) {
                var index = i;
                switch (v[i].score) {
                    case 1:
                        score[0]++;
                        break;
                    case 2:
                        score[1]++;
                        break;
                    case 3:
                        score[2]++;
                        break;
                    case 4:
                        score[3]++;
                        break;
                }
            }
            return res.json({
                total: v.length,
                score: score
            });
        });
    }

    function returnDate(d) {
        var date = new Date(d);
        var dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        return dayNames[date.getDay()] + ', ' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
    }

    function getClientIp(){
        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (var k in interfaces) {
            for (var k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family === 'IPv4' && !address.internal) {
                    return address.address;
                }
            }
        }
    }

    function selectRecord(i, data, callback){
        Cates.find().exec(function(err, c){
            if(c[i]){
                Posts.find({'category._id': c[i]._id}).limit(5).exec(function(err, p){
                    data.push(p);
                    i ++;
                    return selectRecord(i, data, callback);
                });
            }
            return callback(data);
        });
    }

    function asset (uri){
        return 'http://localhost:3000/public/' + uri;
    }
}