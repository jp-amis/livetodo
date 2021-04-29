function serializeTask(taskId, depth, state) {
    const task = state.tasks[taskId];
    const space = ''.padStart(depth * 4, ' ');
    const attrSpace = `${space}${''.padStart((depth + 1) * 4, ' ')}`;
    let serialized = space;
    serialized = `${serialized}[ ] ${task.title}\n`;

    if (task.dueDate) {
        serialized = `${serialized}${attrSpace}@${task.dueDate}\n`;
    }

    if (task.tags && task.tags.length) {
        let tags = '';
        for (const tag of task.tags) {
            if (tag.trim()) {
                tags = `${tags}#${tag} `;
            }
        }
        if (tags) {
            serialized = `${serialized}${attrSpace}${tags}\n`;
        }
    }

    if (task.subtasks.length) {
        for (const subtaskId of task.subtasks) {
            serialized = `${serialized}${serializeTask(subtaskId, depth + 1, state)}`;
        }
    }

    return serialized;
}

function serialize(state) {
    let serialized = '';

    for (const taskId of state.rootTasks) {
        serialized = `${serialized}${serializeTask(taskId, 0, state)}`;
    }

    return serialized;
}


module.exports.serialize = serialize;