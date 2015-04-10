var _ = require("underscore");

var BaseClass = function() {};

BaseClass.subclass = (function(){

    return function() {
        var NewClass = function() {};
        var TmpClass = function() {};

        var ancestor = this;
        for (property in ancestor) {
            if (!ancestor.hasOwnProperty(property)) {
                continue;
            }

            NewClass[property] = ancestor[property];
        }

        var ancestorPrototype = ancestor.prototype;
        TmpClass.prototype = ancestorPrototype;
        NewClass.prototype = new TmpClass();
        NewClass.prototype.superclass = ancestorPrototype;
        NewClass.prototype.constructor = NewClass;

        var properties = arguments[0];

        var classname = properties.classname || (this.classname ? this.classname + "Subclass" : "AnonymousClass");
        NewClass.prototype.classname = classname;

        for (property in properties) {
            if (!properties.hasOwnProperty(property)) {
                continue;
            }

            var getter = properties.__lookupGetter__(property);
            var setter = properties.__lookupSetter__(property);

            if (getter || setter) {
                // TODO: handle if needed in the future.
            } else {
                var value = properties[property];

                var autoInheritedFuncs = ["initialize"];
                if (_.contains(autoInheritedFuncs, property)) {
                    var ancestorFunc = ancestorPrototype[property];
                    if (ancestorFunc) {
                        var derivedFunc = properties[property];
                        value = function() {
                            ancestorFunc.apply(this, arguments);
                            derivedFunc.apply(this, arguments);
                        }
                    }
                }

                NewClass.prototype[property] = value;
            }
        }

        if (!NewClass.prototype.initialize) {
            NewClass.prototype.initialize = function() {};
        }

        return NewClass;
    };

})();

module.exports = BaseClass;