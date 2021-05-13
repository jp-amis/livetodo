const RegEx = {
    // task: /^\[[x ]][\s]/,
    task: (spaces) => {
        return new RegExp(`^[\\s]{${spaces * 4}}\\[[x ]][\\s]`);
    },
    taskIsDone: (spaces) => {
        return new RegExp(`^[\\s]{${spaces * 4}}\\[[x]][\\s]`);
    },
    due: (spaces) => {
        return new RegExp(`^[\\s]{${spaces * 4}}@due\\(.*\\)`);
    },
    tags: (spaces) => {
        return new RegExp(`^[\\s]{${spaces * 4}}#`);
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

    let isNotATask = false;

    if (this.subtaskCounter !== 0) {
        if (line.match(RegEx.tags(this.subtaskCounter))) {
            isNotATask = true;

            this.lastParsed[this.subtaskCounter - 1].tags = line.trim().split(' ').map((tag) => {
                return tag.substr(1, tag.length);
            });
        } else if (line.match(RegEx.due(this.subtaskCounter))) {
            isNotATask = true;

            const due = line.split('@due(')[1];
            this.lastParsed[this.subtaskCounter - 1].due = due.substr(0, due.length - 1);
        }

        if (!isNotATask) {
            while (!line.match(RegEx.task(this.subtaskCounter)) && this.subtaskCounter > 0) {
                this.subtaskCounter -= 1;
            }
        }
    }

    if (lineParsed.match(RegEx.task(this.subtaskCounter))) {
        const taskSplited = lineParsed.split(RegEx.task(this.subtaskCounter));

        let isDone = false;
        if (lineParsed.match(RegEx.taskIsDone(this.subtaskCounter))) {
            isDone = true;
        }

        const task = {
            title: taskSplited.pop(),
            text: lineParsed,
            isDone: isDone,
            tags: [],
            due: '',
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