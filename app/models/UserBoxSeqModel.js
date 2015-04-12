var BaseModel = require("../../core/common/BaseModel");

module.exports = UserBoxSeqModel.subclass({
    classname : "UserBoxSeqModel",
    tablename : "user_box_seq",

    $primaryKeys : ["user_id", "gacha_id"],

});