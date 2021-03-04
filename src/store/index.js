import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import moment from 'moment';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
});

export default createStore({
    state: {
        toCheckTasks: [],
        rootTasks: [],
        tasks: {},
    },
    mutations: {
        add(state, task) {
            task.keyId = moment().unix();
            state.tasks[task.id] = task;

            if (task.parentId === null) {
                state.rootTasks.push(task.id);
                return;
            }

            const parentTask = state.tasks[task.parentId];
            parentTask.subtasks.push(task.id);
        },
        toggle(state, task) {
            const foundTask = state.tasks[task.id];
            foundTask.isDone = !foundTask.isDone;
        },
        dueDate(state, taskData) {
            const taskFound = state.tasks[taskData.task.id];
            if (taskFound) {
                taskFound.dueDate = taskData.dueDate;
            }
        },
        title(state, taskData) {
            const taskFound = state.tasks[taskData.task.id];
            if (taskFound) {
                taskFound.title = taskData.title;
            }
        },
        removeTaskFromCheck(state, taskId) {
            const index = state.toCheckTasks.indexOf(taskId);
            if (index > -1) {
                state.toCheckTasks.splice(index, 1);

                const taskFound = state.tasks[taskId];
                if (taskFound) {
                    taskFound.keyId = moment().unix();
                }
            }
        },
        addTaskToCheck(state, taskId) {
            const index = state.toCheckTasks.indexOf(taskId);
            if (index === -1) {
                state.toCheckTasks.push(taskId);
            }
        }
    },
    actions: {
        addTask({ commit }, task) {
            commit('add', task);
        },
        handleParentTaskCompletion({ dispatch, state, getters }, task) {
            if (task.parentId == null) {
                return;
            }

            const parentTask = state.tasks[task.parentId];

            if (parentTask.isDone) {
                return;
            }

            if (parentTask.subtasks.length == getters.countDoneSubtasks(parentTask)) {
                dispatch('toggleTask', parentTask);
            }
        },
        toggleTask({ commit, dispatch }, task) {
            commit('toggle', task);
            dispatch('handleParentTaskCompletion', task);
        },
        addTaskToCheck({ commit }, task) {
            const date = moment(task.dueDate, 'YYYY-MM-DD HH:mm', true);
            if (date.isValid()) {
                if (date.diff(moment(), 'seconds') > 0) {
                    commit('addTaskToCheck', task.id);
                }
                return;
            }

            commit('removeTaskFromCheck', task.id);
        },
        updateTaskToCheck({ commit }, task) {
            commit('removeTaskFromCheck', task.id);
        },
        changeDueDate({ commit, dispatch }, taskData) {
            commit('dueDate', taskData);
            dispatch('addTaskToCheck', taskData.task);
        },
        changeTitle({ commit }, taskData) {
            commit('title', taskData);
        },
    },
    getters: {
        taskWithId: (state) => (id) => {
            return state.tasks[id];
        },
        subtasksOfTask: (state) => (task) => {
            let taskIds = [];
            if (task === null) {
                taskIds = state.rootTasks;
            } else {
                taskIds = state.tasks[task.id].subtasks;
            }

            return taskIds.map((taskId) => {
                return state.tasks[taskId];
            });
        },
        countDoneSubtasks: (state) => (task) => {
            if (task == null) {
                return 0;
            }

            return state.tasks[task.id].subtasks.reduce((total, subtaskId) => {
                return total + (state.tasks[subtaskId].isDone ? 1 : 0);
            }, 0);
        },
    },
    plugins: [vuexLocal.plugin],
});
