var BaseService = require("../../core/common/BaseService");

module.exports = BaseService.subclass({
    classname : "ItemService",

    getItemMaster : function(callback) {
        var ItemModel = getModel("ItemModel");
        var self      = this;

        async.auto({
            items : function(next, res) {
                ItemModel.getAll(next);
            },
        }, callback);
    },

    getUserItem : function(userId, callback) {
        var UserItemModel      = getModel("UserItemModel");
        var self               = this;

        async.auto({
            userItem : function(next, res) {
                UserItemModel.getAllOfUser(userId, next);
            },
        }, callback);
    }

});