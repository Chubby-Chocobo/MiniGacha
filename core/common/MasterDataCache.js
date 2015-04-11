var BaseClass = require("./BaseClass");

module.exports = BaseClass.subclass({
    classname : "MasterDataCache",

    // WIP
    initialize : function() {
        logger.info(this.classname + "::initialize");
    },
});