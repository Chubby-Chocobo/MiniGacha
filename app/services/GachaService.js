var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "GachaService",

    getGachaMaster : function(callback) {
        var GachaModel              = getModel("GachaModel");
        var GachaFreeModel          = getModel("GachaFreeModel");
        var GachaBoxModel           = getModel("GachaBoxModel");
        var GachaBoxContentModel    = getModel("GachaBoxContentModel");
        var GachaWeightModel        = getModel("GachaWeightModel");
        var self                    = this;

        async.auto({
            gachas : function(next, res) {
                GachaModel.getAll(next);
            },
            freeGachas : function(next, res) {
                GachaFreeModel.getAll(next);
            },
            boxGachas : function(next, res) {
                GachaBoxModel.getAll(next);
            },
        }, callback);
    },

    getUserGacha : function(userId, callback) {
        var UserGachaModel      = getModel("UserGachaModel");
        var UserBoxGachaModel   = getModel("UserBoxGachaModel");
        var UserFreeGachaModel  = getModel("UserFreeGachaModel");
        var self                = this;

        async.auto({
            userGacha : function(next, res) {
                UserGachaModel.getAllOfUser(userId, next);
            },
            userFreeGacha : function(next, res) {
                UserFreeGachaModel.getAllOfUser(userId, next);
            },
            userBoxGacha : function(next, res) {
                UserBoxGachaModel.getAllOfUser(userId, next);
            }
        }, callback);
    }
});