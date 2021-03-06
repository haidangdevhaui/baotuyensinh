var News = require('./models/posts'),
    Menu = require('./models/menu'),
    Contact = require('./models/contact'),
    Users = require('./models/user'),
    Comments = require('./models/comment'),
    Answers = require('./models/answer'),
    Types = require('./models/type'),
    Cates = require('./models/category'),
    Media = require('./models/media'),
    Cmedia = require('./models/media_category'),
    Ads = require('./models/ad'),
    Pad = require('./models/position_ad'),
    Quest = require('./models/question'),
    CQuest = require('./models/question_category'),
    multer = require('multer'),
    fs = require('fs'),
    youtubeThumbnail = require('youtube-thumbnail'),
    youtubeID = require('youtube-id');
var Promise = require('bluebird'),
    mongoose = require('mongoose');
Promise.promisifyAll(mongoose);

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage
});
module.exports = function(app) {
    var admin = app;
    admin.post('/api/v1/upload', upload.any(), function(req, res) {
        var arr = [];
        for (var i = 0; i < req.files.length; i++) {
            arr.push('public/uploads/' + req.files[i].filename);
        };
        return res.json({
            data: arr
        });
    });
    admin.post('/api/v1/remove-img', function(req, res) {
        fs.unlink(req.body.path, function(err) {
            if (err) {
                return res.send(false);
            };
            return res.send(true);
        });
    });
    admin.use('/api/v1', function(req, res, next) {
        return next();
        if (req.user) {
            if (req.user.auth == 1 || req.user.auth == 2) {
                return next();
            }
            return res.json({
                error: "You do not have the authority to perform this access!"
            });
        }
        return res.json({
            error: "You do not have the authority to perform this access!"
        });
    });
    admin.route('/api/v1/setting').get(function(req, res){
        fs.readFile('./app/setting.json', 'utf8', function(err, data){
            if(err){
                return res.json({
                    error: err
                });
            }
            return res.json({
                data: [data]
            });
        });
    }).post(function(req, res){
        fs.writeFile('./app/setting.json', JSON.stringify(req.body), function(err){
            if (err) return res.json({
                error: err
            });
            return res.json({
                result: 'success'
            });
        });
    });
    admin.post('/api/v1/menu/create', function(req, res) {
        Menu.findOne({
            url: req.body.url
        }, function(err, m) {
            if (m) {
                Menu.remove({
                    url: req.body.url
                }).exec(function(err, result) {
                    res.json({
                        data: [result]
                    });
                });
            } else {
                Menu.findOne().sort({
                    $natural: -1
                }).exec(function(err, n) {
                    if (n) {
                        var sort = n.sort + 1;
                    } else {
                        var sort = 1;
                    }
                    req.body.sort = sort;
                    new Menu(req.body).save(function(err, m) {
                        res.json({
                            data: [m]
                        });
                    });
                });
            }
        });
    });
    // admin.post('/api/v1/*', validated);
    admin.get('/api/v1/news', function(req, res) {
        if (req.query.id) {
            News.findById(req.query.id, function(err, p) {
                res.json({
                    data: [p]
                });
            });
        } else {
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
            var select = {};
            if (req.query.type) {
                select = {
                    'type._id': req.query.type
                };
            }
            if (req.query.hot) {
                if (req.query.hot == 'true') {
                    select.hot = true;
                }
            }
            News.find(select).skip(page * record - record).limit(record).exec(function(err, p) {
                News.find(select).exec(function(err, total) {
                    res.json({
                        data: p,
                        current: parseInt(page),
                        total: Math.ceil(total.length / record)
                    });
                });
            });
        }
    });
    admin.get('/api/v1/users', function(req, res) {
        if (req.query.id) {
            Users.findById(req.query.id, function(err, p) {
                res.json({
                    data: [p]
                });
            });
        } else {
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
            if (req.query.type) {
                var select = {
                    auth: req.query.type
                };
            } else {
                var select = {};
            }
            Users.find(select).skip(page * record - record).limit(record).exec(function(err, p) {
                Users.find(select).exec(function(err, total) {
                    res.json({
                        data: p,
                        current: parseInt(page),
                        total: Math.ceil(total.length / record)
                    });
                });
            });
        }
    });
    admin.get('/api/v1/users/status/:id', function(req, res) {
        Users.findById(req.params.id, function(err, u) {
            u.status = !u.status;
            u.save(function(err, u) {
                res.json({
                    data: [u]
                });
            });
        });
    });
    admin.get('/api/v1/users/delete/:id', function(req, res) {
        Users.remove({
            _id: req.params.id
        }).exec(function(err, result) {
            if (err) return res.send(err);
            res.json({
                data: [result]
            });
        });
    });
    admin.post('/api/v1/users/update/:id', function(req, res) {
        Users.update({
            _id: req.params.id
        }, req.body, function(err, u) {
            res.json({
                data: [{
                    _id: req.body._id
                }]
            });
        });
    });
    admin.post('/api/v1/users/auth/:id', function(req, res) {
        Users.findById(req.params.id, function(err, u) {
            u.auth = req.body.auth;
            u.save(function(err, u) {
                return res.json({
                    data: [u]
                });
            });
        });
    });
    admin.post('/api/v1/news/create', function(req, res) {
        if (req.body.tags && req.body.action == 'create') {
            req.body.tags = req.body.tags.split(',');
        }
        if (req.body.imgSrc) {
            req.body.img = req.body.imgSrc;
        }
        req.body.user = {
            _id: req.user._id,
            fullname: req.user.fullname,
            username: req.user.username,
            auth: req.user.auth,
            avatar: req.user.avatar
        };
        Types.findById(req.body.type, function(err, t) {
            req.body.type = {
                _id: t._id,
                name: t.name,
                url: t.url
            };
            Cates.findById(req.body.category, function(err, c) {
                if (req.body.category) {
                    req.body.category = {
                        _id: c._id,
                        name: c.name,
                        url: c.url
                    };
                }
                switch (req.body.action) {
                    case 'create':
                        new News(req.body).save(function(err, p) {
                            res.json({
                                data: [p]
                            });
                        });
                        break;
                    case 'update':
                        News.update({
                            _id: req.body._id
                        }, req.body).exec(function(err, n) {
                            res.json({
                                data: [{
                                    _id: req.body._id
                                }]
                            });
                        });
                        break;
                }
            });
        });
    });
    admin.post('/api/v1/news/upload/:id', upload.single('file'), function(req, res) {
        News.findById(req.params.id, function(err, n) {
            n.img = '/uploads/' + req.file.filename;
            n.save(function(err, newN) {
                res.json({
                    data: [newN]
                });
            });
        })
    });
    admin.post('/api/v1/news/detail/:id', function(req, res) {
        News.findById(req.params.id, function(err, n) {
            var arr = n.content;
            arr.push({
                text: req.body.content
            });
            n.content = arr;
            n.save(function(err, newN) {
                res.json({
                    data: [newN]
                });
            });
        });
    });
    admin.post('/api/v1/news/detail/upload/:id', upload.single('file'), function(req, res) {
        News.findById(req.params.id, function(err, n) {
            var arr = n.content;
            arr[arr.length - 1].img = '/uploads/' + req.file.filename;
            n.content = arr;
            n.save(function(err, newN) {
                res.json({
                    data: [newN]
                });
            });
        });
    });
    admin.get('/api/v1/news/delete-detail/:id', function(req, res) {
        News.findById(req.params.id, function(err, n) {
            n.content = [];
            n.save(function(err, newN) {
                res.json({
                    data: [newN]
                });
            });
        });
    });
    admin.get('/api/v1/news/change-hot/:id', function(req, res) {
            News.findById(req.params.id, function(err, n) {
                if (!n) return res.json({
                    error: 'Error!'
                });
                n.hot = !n.hot;
                n.save(function(err, n) {
                    return res.json({
                        data: [n]
                    });
                });
            });
        })
        /*comment*/
    admin.get('/api/v1/comments', function(req, res) {
        if (req.query.id) {
            Comments.find({
                pid: req.query.id
            }).sort({
                _id: -1
            }).exec(function(err, c) {
                var result = [];
                resComment(0, c, result, function(data) {
                    res.json({
                        data: data
                    });
                });
            });
        } else {
            Comments.find({}, function(err, c) {
                res.json({
                    data: [c]
                });
            });
        }
    });
    admin.get('/api/v1/comments/delete/:id', function(req, res) {
        Comments.remove({
            _id: req.params.id
        }, function(err, result) {
            if (err) return res.json({
                error: 'Error!'
            });
            res.json({
                data: [result]
            });
        });
    });
    admin.get('/api/v1/comments/accept/:id', function(req, res) {
        Comments.findById(req.params.id, function(err, c) {
            if (!c) return res.json({
                error: 'Error!'
            });
            c.status = 1;
            c.save(function(err, newC) {
                res.json({
                    data: [newC]
                });
            });
        });
    });
    admin.get('/api/v1/answers/delete/:id', function(req, res) {
        Answers.remove({
            _id: req.params.id
        }, function(err, result) {
            if (err) return res.json({
                error: 'Error!'
            });
            res.json({
                data: [result]
            });
        });
    });
    admin.get('/api/v1/answers/accept/:id', function(req, res) {
        Answers.findById(req.params.id, function(err, a) {
            if (!a) return res.json({
                error: 'Error!'
            });
            a.status = 1;
            a.save(function(err, newA) {
                res.json({
                    data: [newA]
                });
            });
        });
    });
    admin.post('/api/v1/comments/answer', function(req, res) {
        new Answers({
            cid: req.body.cid,
            user: {
                _id: req.user._id,
                username: req.user.username,
                fullname: req.user.fullname,
                auth: req.user.auth,
                avatar: req.user.avatar
            },
            content: req.body.content,
            status: 1
        }).save(function(err, newA) {
            res.json({
                data: [newA]
            });
        });
    });
    /*type*/
    admin.get('/api/v1/types', function(req, res) {
        if (req.query.id) {
            Types.findById(req.query.id, function(err, t) {
                res.json({
                    data: [t]
                });
            })
        } else {
            Types.find({}, function(err, t) {
                var result = [];
                resType(0, t, result, function(data) {
                    res.json({
                        data: data
                    });
                });
            })
        }
    });
    admin.post('/api/v1/types/create', function(req, res) {
        new Types(req.body).save(function(err, t) {
            res.json({
                data: [t]
            });
        });
    });
    admin.get('/api/v1/types/delete/:id', function(req, res) {
        Types.remove({
            _id: req.params.id
        }).exec();
        Cates.remove({
            'type._id': req.params.id
        }).exec();
        News.remove({
            'type._id': req.params.id
        }).exec();
        res.json({
            data: [{
                result: 'success'
            }]
        });
    });
    /**/
    /*cate*/
    admin.get('/api/v1/category', function(req, res) {
        if (req.query.id) {
            Cates.findById(req.query.id, function(err, t) {
                res.json({
                    data: [t]
                });
            })
        } else
        if (req.query.tid) {
            Cates.find({
                'type._id': req.query.tid
            }, function(err, t) {
                res.json({
                    data: t
                });
            })
        } else {
            Cates.find({}, function(err, t) {
                res.json({
                    data: t
                });
            })
        }
    });
    admin.post('/api/v1/category/create', function(req, res) {
        Types.findById(req.body.tid, function(err, t) {
            req.body.tid = null;
            req.body.type = {
                _id: t._id,
                name: t.name,
                url: t.url
            };
            new Cates(req.body).save(function(err, t) {
                res.json({
                    data: [t]
                });
            });
        });
    });
    admin.get('/api/v1/category/delete/:id', function(req, res) {
        Cates.remove({
            _id: req.params.id
        }).exec();
        News.remove({
            'category._id': req.params.id
        }).exec();
        res.json({
            data: [{
                result: 'success'
            }]
        });
    });
    /**/
    admin.get('/api/v1/menu', function(req, res) {
        Menu.find({}).sort({
            sort: 1
        }).exec(function(err, m) {
            res.json({
                data: m
            });
        });
    });
    admin.post('/api/v1/menu/sort', function(req, res) {
        function changeIndexMenu(i, arr, next) {
            if (i == arr.length) return next();
            Menu.findById(arr[i]._id, function(err, m) {
                m.sort = i + 1;
                m.save(function(err, m) {
                    i++;
                    changeIndexMenu(i, arr, next);
                });
            });
        }
        changeIndexMenu(0, req.body, function() {
            return res.send(true);
        });
    });
    /**/
    admin.get('/api/v1/contact', function(req, res) {
        Contact.find({}, function(err, c) {
            res.json({
                data: c
            });
        });
    });
    admin.post('/api/v1/contact/update', function(req, res) {
        Contact.update(req.body, function(err, c) {
            res.json({
                data: [{
                    _id: req.body._id
                }]
            });
        });
    });
    /**/
    admin.post('/api/v1/news/update/:id', function(req, res) {
        News.update({
            _id: req.params.id
        }, req.body, function(err, n) {
            res.json({
                data: [{
                    _id: req.body._id
                }]
            });
        });
    });
    admin.get('/api/v1/statist', function(req, res) {
        News.find({}, function(err, p) {
            Types.find({}, function(err, t) {
                Users.find(function(err, u) {
                    res.json({
                        data: [{
                            tp: p.length,
                            tt: t.length,
                            tu: u.length,
                        }]
                    });
                });
            });
        });
    });
    admin.get('/api/v1/news/delete/:id', function(req, res) {
        News.findById(req.params.id, function(err, p) {
            News.remove({
                _id: req.params.id
            }, function(err, result) {
                fs.unlink('public' + p.img, function(err) {
                    if (err) {
                        return res.send(false);
                    };
                    return res.send(true);
                });
            });
        });
    });
    /*media*/
    admin.get('/api/v1/media', function(req, res) {
        if (req.query.id) {
            Media.findById(req.query.id, function(err, p) {
                res.json({
                    data: [p]
                });
            });
        } else {
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
            if (req.query.media) {
                var media = req.query.media
            } else {
                var media = /(.*)/;
            }
            if (req.query.type) {
                var select = {
                    'type._id': req.query.type,
                    media: media
                };
            } else {
                var select = {
                    media: media
                };
            }
            Media.find(select).skip(page * record - record).limit(record).exec(function(err, p) {
                Media.find(select).exec(function(err, total) {
                    res.json({
                        data: p,
                        current: parseInt(page),
                        total: Math.ceil(total.length / record)
                    });
                });
            });
        }
    });
    admin.post('/api/v1/media/category/create', function(req, res) {
        Cmedia.findOne({
            name: req.body.name
        }, function(err, c) {
            if (c) {
                return res.json({
                    error: "Tên danh mục media đã tồn tại!"
                });
            }
            req.type = 'video';
            new Cmedia(req.body).save(function(err, c) {
                res.json({
                    data: [c]
                });
            });
        });
    });
    admin.post('/api/v1/media/create', function(req, res) {
        if (req.body.tags) {
            if (req.body.action == 'create') {
                req.body.tags = req.body.tags.split(',');
            }
        }
        req.body.user = {
            _id: req.user._id,
            fullname: req.user.fullname,
            username: req.user.username,
            auth: req.user.auth,
            avatar: req.user.avatar
        };
        if (req.body.first_frame) {
            req.body.img = youtubeThumbnail(req.body.src.toString()).medium.url;
        }
        if (req.body.media == 'video') {
            req.body.video = {
                src: req.body.src,
                id: youtubeID(req.body.src)
            }
        }
        if (req.body.mediaImg) {
            req.body.img = req.body.mediaImg;
        }
        Cmedia.findById(req.body.type, function(err, t) {
            req.body.type = {
                _id: t._id,
                name: t.name,
                url: t.url
            };
            switch (req.body.action) {
                case 'create':
                    new Media(req.body).save(function(err, p) {
                        res.json({
                            data: [p]
                        });
                    });
                    break;
                case 'update':
                    Media.update({
                        _id: req.body._id
                    }, req.body, function(err, m) {
                        res.json({
                            data: [{
                                _id: req.body._id
                            }]
                        });
                    });
                    break;
            }
        });
    });
    admin.post('/api/v1/media/upload/:id', upload.single('file'), function(req, res) {
        Media.findById(req.params.id, function(err, n) {
            n.img = '/uploads/' + req.file.filename;
            n.save(function(err, newN) {
                res.json({
                    data: [newN]
                });
            });
        })
    });
    admin.get('/api/v1/media/category/delete/:id', function(req, res) {
        Cmedia.remove({
            _id: req.params.id
        }).exec(function(err, result) {
            res.json({
                data: [result]
            });
        });
    });
    admin.get('/api/v1/media/category', function(req, res) {
        var selector = {
            type: req.query.media || /(.*)/
        }
        Cmedia.find(selector, function(err, c) {
            res.json({
                data: c
            });
        });
    });
    admin.get('/api/v1/media/delete/:id', function(req, res) {
        Media.findById(req.params.id, function(err, m) {
            if (err) return res.send(err);
            if (!m) return res.send(null);
            if (m.images.length > 0) {
                for (var i = 0; i < m.images.length; i++) {
                    fs.unlink(m.images[i], function(err) {});
                };
            }
            fs.unlink('public' + m.img, function(err) {});
            Media.remove({
                _id: req.params.id
            }).exec(function(err, result) {
                return res.json({
                    data: [result]
                })
            });
        })
    });
    /*ad*/
    admin.get('/api/v1/ads', function(req, res) {
        if (req.query.aid) {
            Ads.findById(req.query.aid, function(err, p) {
                return res.json({
                    data: [p]
                });
            });
        } else {
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
            var select = {};
            if (req.query.type) {
                select = {
                    'position._id': req.query.type
                }
            }
            if (req.query.status) {
                if (req.query.status == 'true') {
                    select.status = 1;
                }
            }
            Ads.find(select).skip(page * record - record).limit(record).exec(function(err, p) {
                Ads.find(select).exec(function(err, total) {
                    res.json({
                        data: p,
                        current: parseInt(page),
                        total: Math.ceil(total.length / record)
                    });
                });
            });
        }
    });
    admin.post('/api/v1/ads/create', upload.any(), function(req, res) {
        req.body = JSON.parse(req.body.data);
        if (req.files[0]) {
            req.body.img = '/uploads/' + req.files[0].filename;
        }
        Pad.findById(req.body.position, function(err, p) {
            switch (req.body.action) {
                case 'create':
                    req.body.position = {
                        name: p.name,
                        _id: p._id,
                        position: p.position
                    }
                    if(!req.body.size){
                        req.body.size = p.size
                    }
                    new Ads(req.body).save(function(err, a) {
                        return res.json({
                            data: [a]
                        });
                    });
                    break;
                case 'update':
                    Ads.update({
                        _id: req.body._id
                    }, req.body).exec(function(err, result) {
                        return res.json({
                            data: [result]
                        });
                    });
                    break;
            }
        })
    });
    admin.get('/api/v1/ads/position', function(req, res) {
        Pad.find({}, function(err, pad) {
            return res.json({
                data: pad
            });
        });
    });
    admin.get('/api/v1/ads/delete/:id', function(req, res) {
        Ads.findById(req.params.id, function(err, a) {
            fs.unlink('public' + a.img, function(err) {});
            Ads.remove({
                _id: req.params.id
            }).exec(function(err, result) {
                if (err) return res.json({
                    error: err
                });
                return res.json({
                    data: [result]
                });
            });
        });
    })
    admin.get('/api/v1/ads/status/:id', function(req, res) {
        Ads.findById(req.params.id, function(err, a) {
            a.status = !a.status;
            a.save(function(err, a) {
                return res.json({
                    data: [a]
                });
            });
        })
    })
    /*question*/
    admin.get('/api/v1/question-category', function(req, res){
        CQuest.find().exec(function(err, c){
            return res.json({
                data: c
            });
        });
    });
    admin.post('/api/v1/question-category/create', function(req, res){
        req.body.url = makeUrl(req.body.name);
        checkUnique(CQuest, req.body, function(data){
            new CQuest(data).save(function(err, c){
                return res.json({
                    data: [c]
                });
            });
        });
        
    });
    admin.get('/api/v1/question-category/delete/:id', function(req, res){
        CQuest.remove({_id: req.params.id}, function(err, result){
            return res.json({
                data: [result]
            });
        });
    });
    admin.get('/api/v1/question', function(req, res){
        if (req.query.id) {
            Quest.findById(req.query.id, function(err, p) {
                res.json({
                    data: [p]
                });
            });
        } else {
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
            var select = {};
            if (req.query.type) {
                select = {
                    'category._id': req.query.type
                };
            }
            if (req.query.hot) {
                if (req.query.hot == 'true') {
                    select.status = 2;
                }
                if (req.query.hot == 'false') {
                    select.status = 1;
                }
            }
            Quest.find(select).skip(page * record - record).limit(record).exec(function(err, p) {
                Quest.find(select).exec(function(err, total) {
                    res.json({
                        data: p,
                        current: parseInt(page),
                        total: Math.ceil(total.length / record)
                    });
                });
            });
        }
    });
    admin.post('/api/v1/question/update/:id', function(req, res){
        checkUnique(Quest, req.body, function(data){
            data.status = 2;
            Quest.update({_id: req.params.id}, data).exec(function(err, q){
                return res.json({
                    data: [q]
                });
            });
        });
    });
    admin.get('/api/v1/question/delete/:id', function(req, res){
        Quest.remove({_id: req.params.id}, function(err, result){
            return res.json({
                data: [result]
            });
        });
    });

    function makeUrl(str) {
        var str = str.toString().trim().toLowerCase();
        return str.replace(/á|ạ|ả|ã|à|ă|ắ|ẳ|ặ|â|ấ|ậ|ẫ/g, 'a').replace(/é|ẹ|ẻ|è|ê|ế|ệ|ề|ể/g, 'e').replace(/ó|ọ|ỏ|ò|õ|ô|ố|ộ|ổ|ồ|ỗ|ố|ơ|ớ|ở|ờ|ợ/g, 'o').replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u').replace(/ì|í|ị|ỉ|ĩ/g, 'i').replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y').replace(/đ/g, 'd').replace(/:|( -)|'|"|,|;|<|>|\+|\(|\)|\?/g, '').replace(/\n|\r| |\//g, '-').substr(0, 70);
    }
    
    function validated(req, res, next) {
        if (!req.body.name) return next();
        req.body.url = makeUrl(req.body.name);
        Promise.props({
            menu: Menu.find({
                url: req.body.url
            }).countAsync(),
            posts: News.find({
                url: req.body.url
            }).sort({
                _id: -1
            }).countAsync(),
            categories: Cates.find({
                url: req.body.url
            }).countAsync(),
            types: Types.find({
                url: req.body.url
            }).countAsync(),
            medias: Media.find({
                url: req.body.url
            }).sort({
                _id: -1
            }).countAsync(),
            cmedias: Cmedia.find({
                url: req.body.url
            }).sort({
                _id: -1
            }).countAsync()
        }).then(function(results) {
            if (results.menu + results.posts + results.categories + results.types + results.medias + results.cmedias > 0) {
                return res.json({
                    error: 'Tên nhập vào không hợp lệ hoặc đã tồn tại'
                });
            }
            return next();
        });
    }

    function checkUnique(model, data, callback){
        if(data.url.length == 0) {
            return res.json({
                error: 'Tên nhập vào không hợp lệ hoặc đã tồn tại'
            }); 
        }
        model.findOne({url: data.url}, function(err, m){
            if(m) {
                if(m._id != data._id){
                    data.url = data.url.substr(0, (data.url.length - 1));
                    return checkUnique(model, data, callback);
                }
            }
            return callback(data);
        });
    }

    var result = [];

    function resComment(i, arr, result, callback) {
        if (i == 0) {
            result = [];
        }
        if (arr.length == 0) {
            return callback(null);
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
                resComment(i, arr, result, callback);
            });
        }
        if (i == arr.length) {
            return callback(result);
        }
    }

    function resType(i, arr, result, callback) {
        if (arr.length == 0) {
            return callback(null);
        }
        if (i < arr.length) {
            Cates.find({
                'type._id': arr[i]._id
            }).exec(function(err, a) {
                result.push({
                    type: arr[i],
                    cates: a
                });
                i++;
                resType(i, arr, result, callback);
            });
        }
        if (i == arr.length) {
            return callback(result);
        }
    }
}