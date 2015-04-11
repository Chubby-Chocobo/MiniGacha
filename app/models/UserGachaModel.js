var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "UserGachaModel",
    tablename : "user_gacha",

    $primaryKeys : ["user_id", "gacha_id"],

});