var BaseModel               = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "GachaBoxContentModel",

    tablename   : "gacha_box_content",
    primaryKeys : ["gacha_id", "item_id"],

});