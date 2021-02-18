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

            task.subtasks.push(taskData.task);
        },
        toggle(state, taskData) {
            let tasks = state.tasks;

            if (taskData.parent !== null) {
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
        }
    },
    actions: {
        addTask({ commit }, taskData) {
            commit('add', taskData);
        },
        toggleTask({ commit }, taskData) {
            commit('toggle', taskData);
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
    },
    plugins: [vuexLocal.plugin],
});
