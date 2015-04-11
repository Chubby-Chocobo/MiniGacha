var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserItemModel",
    tablename : "user_item",

    $primaryKeys : ["user_id", "item_id"],

});