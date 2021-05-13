import { createStore } from 'vuex';
// import VuexPersistence from 'vuex-persist';
import moment from 'moment';
import Fuse from 'fuse.js';
import { serialize } from '@/helpers/serialize';
// import { save } from '@/helpers/file';

// const vuexLocal = new VuexPersistence({
//     storage: window.localStorage,
// });

export default createStore({
    state: {
        toCheckTasks: [],
        rootTasks: [],
        archivedTasks: [],
        tasks: {},
        openTagsCount: 0,
        search: '',
    },
    mutations: {
        resetOpenTagsCount(state) {
          state.openTagsCount = 0;
        },
        addOpenTagsCount(state, count) {
          state.openTagsCount += count;
        },
        add(state, task) {
            task.archived = false;
            task.keyId = moment().unix() + Math.random();
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
            foundTask.doneDate = foundTask.isDone ? moment().unix() : null;
        },
        dueDate(state, taskData) {
            const taskFound = state.tasks[taskData.task.id];
            if (taskFound) {
                taskFound.dueDate = taskData.dueDate;
            }
        },
        changeTags(state, taskData) {
            const taskFound = state.tasks[taskData.task.id];
            if (taskFound) {
                taskFound.tags = taskData.tags;
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
        },
        archive(state, task) {
            let archivedTasks = state.archivedTasks;
            let tasks = state.rootTasks;
            if (task.parentId) {
                if (!state.tasks[task.parentId].archivedTasks) {
                    state.tasks[task.parentId].archivedTasks = [];
                }

                archivedTasks = state.tasks[task.parentId].archivedTasks;
                tasks = state.tasks[task.parentId].subtasks;
            }

            task.archived = true;

            archivedTasks.push(task.id);
            tasks.splice(tasks.indexOf(task.id), 1);
        },
        swapTask(state, { task, newIndex, oldIndex }) {
            let tasks = state.rootTasks;
            if (task.parentId !== null) {
                tasks = state.tasks[task.parentId].subtasks;
            }

            tasks[oldIndex] = null;
            tasks.splice(oldIndex > newIndex ? newIndex : newIndex + 1, 0, task.id);
            tasks = tasks.filter((v) => v != null);

            if (task.parentId !== null) {
                state.tasks[task.parentId].subtasks = tasks;
            } else {
                state.rootTasks = tasks;
            }
        },
        remove(state, task) {
            let tasks = state.rootTasks;
            if (task.parentId !== null) {
                tasks = state.tasks[task.parentId].subtasks;
            }

            if (tasks.indexOf(task.id) === -1) {
                tasks = state.archivedTasks;
                if (task.parentId !== null) {
                    tasks = state.tasks[task.parentId].archivedTasks;
                }
            }

            tasks.splice(tasks.indexOf(task.id), 1);
        },
        search(state, search) {
            state.search = search;
        },
    },
    actions: {
        saveSearch({ commit }, search) {
            commit('search', search);
        },
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
        changeTags({ commit }, taskData) {
            commit('changeTags', taskData);
        },
        changeTitle({ commit }, taskData) {
            commit('title', taskData);
        },
        archive({ state, getters, commit }, archiveData) {
            const task = archiveData.task;
            let taskIds = [];
            if (task === null) {
                taskIds = state.rootTasks;
            } else {
                taskIds = state.tasks[task.id].subtasks;
            }

            taskIds = JSON.parse(JSON.stringify(taskIds));

            for (const taskId of taskIds) {
                const task = state.tasks[taskId];
                if (task.isDone) {
                    if (archiveData.archiveSubtasksUndone || getters.countDoneSubtasks(task) === task.subtasks.length) {
                        commit('archive', task);
                    }
                }
            }
        },
        swapTask({ commit }, { task, newIndex, oldIndex }) {
            commit('swapTask', { task, newIndex, oldIndex });
        },
        moveTask({ state, commit }, { task, direction }) {
            let tasks = state.rootTasks;
            if (task.parentId !== null) {
                tasks = state.tasks[task.parentId].subtasks;
            }

            const oldIndex = tasks.indexOf(task.id);
            let newIndex = -1;

            if (direction === 'UP') {
                newIndex = oldIndex - 1;
            } else if (direction === 'DOWN') {
                newIndex = oldIndex + 1;
            } else if (direction === 'TOP') {
                newIndex = 0;
            } else if (direction === 'BOTTOM') {
                newIndex = tasks.length - 1;
            }

            if (newIndex < 0 || newIndex >= tasks.length || newIndex === oldIndex) {
                return;
            }

            commit('swapTask', { task, oldIndex, newIndex });
        },
        removeTask({ commit }, task) {
            commit('remove', task);
        },
        // save({ getters }) {
        //     save(getters.serialize);
        // },
        open({ commit }, tasks) {
            const processTask = (task, parentId) => {
                const taskToAdd = {
                    id: new Date().getTime() + Math.random(),
                    title: task.title,
                    isDone: task.isDone,
                    dueDate: task.due,
                    parentId,
                    subtasks: [],
                    tags: task.tags,
                };
                commit('add', taskToAdd);
                if (task.subtasks) {
                    for (const subtask of task.subtasks) {
                        processTask(subtask, taskToAdd.id);
                    }
                }
            };
            for (const task of tasks) {
                processTask(task, null);
            }
        }
    },
    getters: {
        getValidDate: () => (date) => {
            let momentDate = moment(date, 'YYYY-MM-DD HH:mm', true);

            if (!momentDate.isValid()) {
                momentDate = moment(date, 'YYYY-MM-DD', true);
                if (!momentDate.isValid()) {
                    return false;
                }
            }

            return momentDate;
        },
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
        archivedTasksOfTask: (state) => (task) => {
            let taskIds = [];
            if (task === null) {
                taskIds = state.archivedTasks;
            } else {
                taskIds = state.tasks[task.id].archivedTasks;
            }

            if (!taskIds) {
                taskIds = [];
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
        searchResults: (state) => {
            if (state.search.trim() === '') {
                return [];
            }

            let processedSearch = ` ${state.search}`;
            let regex = /\s([#][\w_-]+)/g;
            let match = null;
            const tags = []
            while ((match = regex.exec(processedSearch)) !== null) {
                console.log(match);
                const tag = match[0].trim();
                tags.push(tag.slice(-(tag.length - 1)));
            }

            processedSearch = processedSearch.replaceAll(regex, '').trim();

            const filteredTasks = Object.values(state.tasks).filter((task) => {
                if (task.archived) {
                    return false;
                }

                if (!tags.length) {
                    return true;
                }

                let foundTags = 0;
                for(const tagToSearch of tags) {
                    let found = false;
                    for(const tag of task.tags ?? []) {
                        if (tagToSearch.toLowerCase() === tag.toLowerCase()) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        foundTags += 1;
                    } else {
                        break;
                    }
                }


                return foundTags === tags.length;
            });

            if (processedSearch === '') {
                return filteredTasks;
            }

            const searchResults = new Fuse(filteredTasks, {
                includeMatches: true,
                // minMatchCharLength: 3,
                threshold: 0.2,
                keys: ['title']
            });
            // !raid
            return searchResults.search(processedSearch).map((result) => {
                return result.item;
            });
        },
        isSearching: state => {
            if (state.search.trim()) {
                return true;
            }

            return false;
        },
        serialize: state => {
            return serialize(state);
        },
    },
    // plugins: [vuexLocal.plugin],
});
