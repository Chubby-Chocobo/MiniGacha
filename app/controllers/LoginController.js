var BaseController = require("../../core/common/BaseController");

var LoginController = BaseController.subclass({
    classname : "LoginController",

    initialize : function() {
        logger.trace(this.classname + "::initialize");

        this._router.get('/', this._main.bind(this));
        this._router.post('/login', this._login.bind(this));
        this._router.post('/register', this._register.bind(this));
    },

    _main : function(req, res) {
        var LoginService = getService("LoginService");
        var email        = req.session.email;
        var authToken    = req.session.authToken;

        if (!email || !authToken) {
            res.render("main");
            return;
        }

        async.auto({
            authenticate : function(next, res) {
                LoginService.authenticate({
                    email     : email,
                    authToken : authToken,
                }, next);
            }
        }, function(err, ret) {
            if (err) {
                logger.error(err);
            }

            var msg  = ret.authenticate.msg;
            var user = ret.authenticate.data;

            if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.SUCCESS) {
                res.render("main", {
                    user : user.getData()
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.FAIL) {
                res.status(400);
                res.send(msg);
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER) {
                res.status(400);
                res.send(msg);
            } else {
                logger.error("LoginController::_login unkonwn message: " + JSON.stringify(msg));
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
            login : function(next, res) {
                LoginService.login({
                    email    : email,
                    password : password,
                }, next);
            }
        }, function(err, ret) {
            if (err) {
                logger.error(err);
            }

            var msg  = ret.login.msg;
            var user = ret.login.data;

            if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.SUCCESS) {
                req.session.email       = user.email;
                req.session.authToken   = user.auth_token;
                res.render("sub/home", {
                    user : user.getData()
                });
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.WRONG_PASSWORD) {
                res.status(400);
                res.send(msg);
            } else if (msg == AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER) {
                res.status(400);
                res.send(msg);
            } else {
                logger.error("LoginController::_login unkonwn message: " + JSON.stringify(msg));
                res.status(500);
                res.send(AppConstants.RESPONSE_MESSAGE.COMMON.UNKNOWN_ERROR);
            }
        });
    },

    _register : function(req, res) {

    }

});

module.exports = LoginController;