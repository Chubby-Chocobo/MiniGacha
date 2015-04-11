var crypto      = require("crypto");
var BaseService = require("../../core/common/BaseService");
var BaseEntity  = require("../../core/common/BaseEntity");

module.exports = BaseService.subclass({
    classname : "LoginService",

    login : function(params, callback) {
        var UserModel    = getModel("UserModel");
        var email        = params.email;
        var password     = params.password;
        var self         = this;

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
                        user.auth_token = self._generateAuthToken(user.email, user.password);
                        user.save(function(_err, _res) {
                            if (_err) {
                                next(_err);
                                return;
                            }
                            next(null, {
                                msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.SUCCESS,
                                user : user,
                            });
                        });
                    } else {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.WRONG_PASSWORD,
                            user : null,
                        });
                    }
                } else {
                    next(null, {
                        msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER,
                        user : null,
                    });
                }
            }],
            data : ["checkUser", function(next, res) {
                if (!res.checkUser.user) {
                    next(null, res.checkUser);
                } else {
                    self._getDataToRenderHome(res.checkUser.user.id, function(_err, _res) {
                        if (_err) {
                            next(_err);
                            return;
                        }
                        res.checkUser.data = _res;
                        next(null, res.checkUser);
                    });
                }
            }],
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
        var userId       = params.userId;
        var authToken    = params.authToken;
        var self         = this;

        async.auto({
            getUser : function(next, res) {
                UserModel.get({
                    where : "id=" + userId
                }, next);
            },
            checkUser : ["getUser", function(next, res) {
                var user = res.getUser;
                if (user) {
                    if (user.auth_token == authToken) {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.SUCCESS,
                            user : user,
                            data : res.data
                        });
                    } else {
                        next(null, {
                            msg  : AppConstants.RESPONSE_MESSAGE.AUTHENTICATE.FAIL,
                            user : null,
                            data : null
                        });
                    }
                } else {
                    next(null, {
                        msg  : AppConstants.RESPONSE_MESSAGE.LOGIN.NOT_REGISTER,
                        user : null,
                        data : null
                    });
                }
            }],
            data : ["checkUser", function(next, res) {
                if (!res.checkUser.user) {
                    next(null, res.checkUser);
                } else {
                    self._getDataToRenderHome(res.checkUser.user.id, function(_err, _res) {
                        if (_err) {
                            next(_err);
                            return;
                        }
                        res.checkUser.data = _res;
                        next(null, res.checkUser);
                    });
                }
            }],
        }, function (err, res) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, res.checkUser);
        });
    },

    register : function (params, callback) {
        var UserModel    = getModel("UserModel");
        var email        = params.email;
        var password     = params.password;
        var self         = this;

        var UserEntity = require("../entities/UserEntity");
        var user = new UserEntity();
        var now = Date.now();
        user.initialize(UserModel, {
            username        : email,
            email           : email,
            password        : password,
            registered_at   : now,
            zero_coin_at    : now - AppConstants.STARTED_COIN,
            auth_token      : self._generateAuthToken(email, password),
        });

        async.auto({
            insertNewUser : function(next, res) {
                UserModel.insert([user], next);
            },
            data : function(next, res) {
                self._getDataToRenderHome(-1, next);
            },
        }, function (err, res) {
            if (err) {
                callback(err, {
                    msg  : AppConstants.RESPONSE_MESSAGE.REGISTER.FAIL,
                    user : user,
                    data : null,
                });
                return;
            }

            callback(null, {
                msg  : AppConstants.RESPONSE_MESSAGE.REGISTER.SUCCESS,
                user : user,
                data : res.data
            });
        });
    },

    _generateAuthToken : function(email, password) {
        var mixed = email + password + Date.now();
        var token = crypto.createHash('md5').update(mixed).digest("hex");
        return token;
    },

    _getDataToRenderHome : function(userId, callback) {
        var GachaService    = getService("GachaService");
        var ItemService     = getService("ItemService");
        var self            = this;

        async.auto({
            gacha : function (next, res) {
                GachaService.getGachaMaster(next);
            },
            item : function (next, res) {
                ItemService.getItemMaster(next);
            },
            userGacha : function(next, res) {
                GachaService.getUserGacha(userId, next);
            },
            userItem : function(next, res) {
                ItemService.getUserItem(userId, next);
            }
        }, function (err, res) {
            if (err) {
                callback(err);
                return;
            }

            var newRes = {};
            for (var prop in res) {
                newRes[prop] = {};
                for (t in res[prop]) {
                    newRes[prop][t] = BaseEntity.extractDataFromEntities(res[prop][t]);
                }
            }

            callback(err, newRes);
        });
    }
});