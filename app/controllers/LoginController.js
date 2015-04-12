var BaseController = require("../../core/common/BaseController");

var LoginController = BaseController.subclass({
    classname : "LoginController",

    initialize : function() {
        logger.info(this.classname + "::initialize");

        this._router.all('/', this._main.bind(this));
        this._router.all('/login', this._login.bind(this));
        this._router.all('/register', this._register.bind(this));
    },

    _main : function(req, res) {
        var LoginService = getService("LoginService");

        // For debug only
        // req.session.userId = 10;
        // req.session.authToken = "c741359515a8585e182c6137f674d609";

        // TODO: authenticate in all requests, save multi auth tokens from all browsers.

        var userId       = req.session.userId;
        var authToken    = req.session.authToken;

        if (!userId || !authToken) {
            res.render("main");
            return;
        }

        async.auto({
            authenticate : function(next, res) {
                LoginService.authenticate({
                    userId    : userId,
                    authToken : authToken,
                }, next);
            },
        }, function(err, ret) {
            if (err) {
                logger.error(err);
            }

            var msg  = ret.authenticate.msg;
            var user = ret.authenticate.user;
            var data = ret.authenticate.data;

            if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.SUCCESS) {
                res.render("main", {
                    user : user.getData(),
                    data : data
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.FAIL) {
                res.status(401);
                res.render("main", {
                    user : null,
                    data : null
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER) {
                res.status(401);
                res.render("main", {
                    user : null,
                    data : null
                });
            } else {
                logger.error("LoginController::_main unkonwn message: " + JSON.stringify(msg));
                res.status(500);
                res.send(AppConstants.RESPONSE_MESSAGE.COMMON.UNKNOWN_ERROR);
            }
        });
    },

    _login : function (req, res) {
        var LoginService = getService("LoginService");
        var email        = req.body.email;
        var password     = req.body.password;

        async.auto({
            beginTransaction : function(next, res) {
                LoginService.beginTransaction(next);
            },
            login : ["beginTransaction", function(next, res) {
                LoginService.login({
                    email    : email,
                    password : password,
                }, next);
            }],
            commit : ["login", function(next, res) {
                LoginService.commit(next);
            }]
        }, function(err, ret) {
            if (err) {
                logger.error(err);
                LoginService.rollback();
            }

            var msg  = ret.login.msg;
            var user = ret.login.user;
            var data = ret.login.data;

            if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.SUCCESS) {
                req.session.userId      = user.id;
                req.session.email       = user.email;
                req.session.authToken   = user.auth_token;
                res.render("sub/home", {
                    user : user.getData(),
                    data : data
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.WRONG_PASSWORD) {
                res.status(401);
                res.send(msg);
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER) {
                res.status(401);
                res.send(msg);
            } else {
                logger.error("LoginController::_login unkonwn message: " + JSON.stringify(msg));
                res.status(500);
                res.send(AppConstants.RESPONSE_MESSAGE.COMMON.UNKNOWN_ERROR);
            }
        });
    },

    _register : function(req, res) {
        var LoginService = getService("LoginService");
        var email        = req.body.email;
        var password     = req.body.password;

        async.auto({
            beginTransaction : function(next, res) {
                LoginService.beginTransaction(next);
            },
            register : ["beginTransaction", function(next, res) {
                LoginService.register({
                    email    : email,
                    password : password,
                }, next);
            }],
            commit : ["register", function(next, res) {
                LoginService.commit(next);
            }]
        }, function(err, ret) {
            if (err) {
                logger.error(err);
                LoginService.rollback();
            }

            var msg  = ret.register.msg;
            var user = ret.register.user;
            var data = ret.register.data;

            if (msg == AppConstants.RESPONSE_MESSAGE.REGISTER.SUCCESS) {
                req.session.email       = user.email;
                req.session.authToken   = user.auth_token;
                res.render("sub/home", {
                    user : user.getData(),
                    data : data
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.REGISTER.FAIL) {
                res.status(401);
                res.send(msg);
            } else {
                logger.error("LoginController::_register unkonwn message: " + JSON.stringify(msg));
                res.status(500);
                res.send(AppConstants.RESPONSE_MESSAGE.COMMON.UNKNOWN_ERROR);
            }
        });
    }

});

module.exports = LoginController;