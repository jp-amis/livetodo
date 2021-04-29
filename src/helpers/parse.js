const RegEx = {
    task: /^\[[x ]]/,
    // [\s]{4}
};

function Parser(content) {
    this.content = content;
}

Parser.prototype.parse = function() {
    this.contents.split('\n').map(this.parseLine.bind(this));
};

Parser.prototype.parseLine = function(line) {

};

module.exports.Parser = Parser;