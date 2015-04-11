var crypto      = require("crypto");
var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "LoginService",

    login : function(params, callback) {
        var UserModel    = getModel("UserModel");
        var email        = params.email;
        var password     = params.password;

        async.auto({
            getUser : function(next, res) {
                UserModel.get({
                    where : "email='" + email + "'"
                }, next);
            },
            checkUser : ["getUser", function(next, res) {
                var user = res.getUser;
                if (user) {
                    if (user.password == password) {
                        var mixed = user.email + user.password + (new Date()).toTimeString();
                        var token = crypto.createHash('md5').update(mixed).digest("hex");
                        user.auth_token = token;
                        user.save(function(_err, _res) {
                            if (_err) {
                                next(_err);
                                return;
                            }
                            next(null, {
                                msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.SUCCESS,
                                data : user
                            });
                        });
                    } else {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.WRONG_PASSWORD,
                            data : null
                        });
                    }
                } else {
                    next(null, {
                        msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER,
                        data : null
                    });
                }
            }]
        }, function (err, res) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, res.checkUser);
        });
    },

    authenticate : function (params, callback) {
        var UserModel    = getModel("UserModel");
        var email        = params.email;
        var authToken    = params.authToken;

        async.auto({
            getUser : function(next, res) {
                UserModel.get({
                    where : "email='" + email + "'"
                }, next);
            },
            checkUser : ["getUser", function(next, res) {
                var user = res.getUser;
                if (user) {
                    if (user.auth_token == authToken) {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.SUCCESS,
                            data : user
                        });
                    } else {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.FAIL,
                            data : null
                        });
                    }
                } else {
                    next(null, {
                        msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER,
                        data : null
                    });
                }
            }]
        }, function (err, res) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, res.checkUser);
        });
    }
});