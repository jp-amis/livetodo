const RegEx = {
    // task: /^\[[x ]][\s]/,
    task: (spaces) => {
        return new RegExp(`^[\\s]{${spaces * 4}}\\[[x ]][\\s]`);
    },
};

// Task
/*
title: string
archived: bool
isDone: bool
doneDate: date-string
dueDate: date-string
tags: string[]
 */

function Parser(content) {
    this.content = content;
    this.document = [];
    this.lastParsed = {};
    this.subtaskCounter = 0;
    this.lineNumber = 0;
}

Parser.prototype.parse = function() {
    this.content.split('\n').map(this.parseLine.bind(this));
    console.log(JSON.stringify(this.document, null, 4));
    return this.document;
};

Parser.prototype.parseLine = function(line) {
    this.lineNumber += 1;
    if (!line) {
        return;
    }

    let lineParsed = line;

    if (this.subtaskCounter !== 0) {
        while(!line.match(RegEx.task(this.subtaskCounter)) && this.subtaskCounter > 0) {
            this.subtaskCounter -= 1;
        }
    //     // Is a Task
    //     if (line.match(RegEx.subdata(this.subtaskCounter))) {
    //
    //     } else {
    //         this.subtaskCounter -= 1;
    //         // console.log(`There is an error on line ${this.lineNumber}`);
    //     }
    //
    //     // TODO: Is a configuration
    }

    if (lineParsed.match(RegEx.task(this.subtaskCounter))) {
        const taskSplited = lineParsed.split(RegEx.task(this.subtaskCounter));

        const task = {
            title: taskSplited.pop(),
            text: lineParsed,
        };

        if (this.subtaskCounter === 0) {
            this.document.push(task);
        } else {
            if (!this.lastParsed[this.subtaskCounter - 1].subtasks) {
                this.lastParsed[this.subtaskCounter - 1].subtasks = [];
            }
            this.lastParsed[this.subtaskCounter - 1].subtasks.push(task);
        }

        this.lastParsed[this.subtaskCounter] = task;
        this.subtaskCounter += 1;
    }
};

module.exports.Parser = Parser;