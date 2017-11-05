String.prototype.capitalize = function() {
    return this.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.sentenceCase = function() {
    return this.toString().replace( /(^|\. *|\? *|\! *)([a-z])/g, function(match, separator, char) {
        return separator + char.toUpperCase();
    });
};
