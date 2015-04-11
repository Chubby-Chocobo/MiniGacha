(function() {
    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
})();

var Utils = {};

Utils.convertToCamelCase = function(key) {
    return key.replace( /_./g, function(matched) {
        return matched.charAt(1).toUpperCase();
    });
};

Utils.convertToSnakeCase = function(key) {
    return key.replace( /[a-z][A-Z]/g, function(matched) {
        return matched.charAt(0) + "_" + matched.charAt(1).toLowerCase();
    });
};

Utils.emailUsername = function(emailAddress) {
    return emailAddress.match(/^(.+)@/)[1];
};

Utils.getRandomInRange = function(min, max) {
    return (min + Math.floor(Math.random() * (max-min)));
};

Utils.getRandomByProb = function(probs, propName) {
    var result = null;
    var totalProb = 0;
    for(var i = 0, len = probs.length; i < len; i++) {
        var prob = probs[i];
        totalProb += prob[propName];
    }
    var prob1 = Utils.getRandomInRange(0, totalProb);
    var prob2 = 0;
    for(var i = 0,len = probs.length; i < len; i++){
        var prob = probs[i];
        prob2 += prob[propName];
        if(prob1 < prob2){
            result = prob;
            break;
        }
    }
    return result;
};

module.exports = Utils;