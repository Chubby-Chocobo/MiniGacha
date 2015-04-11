var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "GachaFreeModel",
    tablename : "gacha_free",

    $primaryKeys : ["gacha_id"],

});