import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
});

export default createStore({
    state: {
        tasks: [],
    },
    mutations: {
        add(state, taskData) {
            if (taskData.parentTask === null) {
                state.tasks.push(taskData.task);
                return;
            }

            const task = state.tasks.find((t) => {
                return t.id === taskData.parentTask.id;
            });

            taskData.task.parentId = task.id;
            task.subtasks.push(taskData.task);
        },
        toggle(state, taskData) {
            let tasks = state.tasks;

            if (taskData.parent) {
                const task = state.tasks.find((t) => {
                    return t.id === taskData.parent.id;
                });

                if (task) {
                    tasks = task.subtasks;
                }
            }

            const taskFound = tasks.find((t) => {
                return t.id === taskData.task.id;
            });

            if (taskFound) {
                taskFound.isDone = !taskFound.isDone;
            }
        },
        dueDate(state, taskData) {
            let tasks = state.tasks;

            if (taskData.parent) {
                const task = state.tasks.find((t) => {
                    return t.id === taskData.parent.id;
                });

                if (task) {
                    tasks = task.subtasks;
                }
            }

            const taskFound = tasks.find((t) => {
                return t.id === taskData.task.id;
            });

            if (taskFound) {
                taskFound.dueDate = taskData.dueDate;
            }
        },
        title(state, taskData) {
            let tasks = state.tasks;

            if (taskData.task.parentId) {
                const task = state.tasks.find((t) => {
                    return t.id === taskData.task.parentId;
                });

                if (task) {
                    tasks = task.subtasks;
                }
            }
            const taskFound = tasks.find((t) => {
                return t.id === taskData.task.id;
            });

            if (taskFound) {
                taskFound.title = taskData.title;
            }
        },
    },
    actions: {
        addTask({ commit }, taskData) {
            commit('add', taskData);
        },
        handleParentTaskCompletion({ commit, state, getters }, childTask) {
            const taskFound = state.tasks.find((t) => {
                return t.id === Number(childTask.task.parentId);
            });

            if (!taskFound || taskFound.isDone) {
                return;
            }

            if (taskFound.subtasks.length == getters.countDoneSubtasks(taskFound)) {
                commit('toggle', { task: taskFound });
            }
        },
        toggleTask({ commit, dispatch }, taskData) {
            commit('toggle', taskData);
            dispatch('handleParentTaskCompletion', taskData);
        },
        changeDueDate({ commit }, taskData) {
            commit('dueDate', taskData);
        },
        changeTitle({ commit }, taskData) {
            commit('title', taskData);
        },
    },
    getters: {
        taskWithId: (state) => (id) => {
            return state.tasks.find((t) => {
                return t.id === Number(id);
            });
        },
        subtasksOfTask: (state) => (task) => {
            if (task === null) {
                return state.tasks;
            }

            const taskFound = state.tasks.find((t) => {
                return t.id === Number(task.id);
            });

            if (!taskFound) {
                return state.tasks;
            }

            return taskFound.subtasks;
        },
        countDoneSubtasks: (state) => (task) => {
            if (task == null) {
                return 0;
            }

            const taskFound = state.tasks.find((t) => {
                return t.id === Number(task.id);
            });

            if (!taskFound) {
                return 0;
            }

            return taskFound.subtasks.reduce((total, subtask) => {
                return total + (subtask.isDone ? 1 : 0);
            }, 0);
        },
    },
    plugins: [vuexLocal.plugin],
});
