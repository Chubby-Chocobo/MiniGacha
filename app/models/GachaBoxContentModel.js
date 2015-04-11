var BaseModel               = require("../../core/common/BaseModel");
var GachaBoxContentEntity   = require("../entities/GachaBoxContentEntity");

module.exports = BaseModel.subclass({
    classname : "GachaBoxContentModel",

    $entity      : GachaBoxContentEntity,
    $tablename   : "gacha_box_content",
    $primaryKeys : ["gacha_id", "item_id"],

});