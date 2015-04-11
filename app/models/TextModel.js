var BaseModel = require("../../core/common/BaseModel");

module.exports = BaseModel.subclass({
    classname : "TextModel",
    tablename : "text",

    $primaryKeys : ["key"],

});