var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "UserService",

    minusCoin : function(params, callback) {
        var userId      = params.userId;
        var num         = params.num;
        var UserModel   = getModel("UserModel");

        var now = Date.now();

        async.auto({
            user : function(next, res) {
                UserModel.get({
                    where : "id=" + userId,
                }, next);
            },
            minusCoin : ["user", function(next, res) {
                var minusTime = num * AppConstants.COIN_PER_SECOND * 1000;
                if (res.user.zero_coin_at + minusTime > now) {
                    next("You do not have enough coin.");
                } else {
                    res.user.zero_coin_at += minusTime;
                    res.user.save(next);
                }
            }]
        }, function(err, res) {
            callback (err, res.user);
        });
    }
});