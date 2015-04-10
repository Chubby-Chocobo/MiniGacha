(function() {
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
})();

module.exports = {

    convertToCamelCase : function(key) {
        return key.replace( /_./g, function(matched) {
            return matched.charAt(1).toUpperCase();
        });
    },

    convertToSnakeCase : function(key) {
        return key.replace( /[a-z][A-Z]/g, function(matched) {
            return matched.charAt(0) + "_" + matched.charAt(1).toLowerCase();
        });
    }
}