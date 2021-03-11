<template>
    <div class="mb-4">
        <Breadcumb :task="currentTask ?? null" :key="currentTask?.id ?? 'x'" />
        <div
            class="flex items-center mb-4"
            :class="{ 'justify-end': !currentTask }"
        >
            <div class="pr-4 cursor-pointer" @click="backToParent" v-if="currentTask">&lt;</div>
            <TaskTitle :task="currentTask" :key="currentTask.id" class="text-2xl" v-if="currentTask" />
            <Toolbar
                :task="currentTask ?? null"
                :key="currentTask?.id ?? 'x'"
            />
        </div>
        <h2 class="font-bold text-lg">Nova task</h2>
        <input
            class="w-full shadow-sm rounded px-2 py-1" placeholder="Enter your task..." @keydown.enter="createTask" v-model="newTask" type="text"
        />
    </div>
    <Task
        v-for="task in tasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :parentTask="currentTask" :task="task"
    />
    <div class="flex">
        <div class="flex-grow flex justify-center items-center">
            <div class="border-b border-gray-300 flex-grow h-1"></div>
        </div>
        <div class="mx-5 text-gray-300">Archive</div>
        <div class="flex-grow flex justify-center items-center">
            <div class="border-b border-gray-300 flex-grow h-1"></div>
        </div>
    </div>
    <Task
        v-for="task in archivedTasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :parentTask="currentTask" :task="task"
    />
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import Task from '@/components/Task';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import TaskTitle from '@/components/TaskTitle';
import Toolbar from '@/components/Toolbar';
import Breadcumb from '@/components/Breadcumb';

export default defineComponent({
    name: 'TaskList',
    components: { Breadcumb, Toolbar, TaskTitle, Task },
    setup() {
        const $store = useStore();
        const $route = useRoute();
        const $router = useRouter();

        const newTask = ref('');
        const currentTask = ref(null);
        const tasks = computed(() => {
            return $store.getters.subtasksOfTask(currentTask.value);
        });
        const archivedTasks = computed(() => {
            return $store.getters.archivedTasksOfTask(currentTask.value);
        });

        function loadRouteTask() {
            if (!$route.params.id) {
                currentTask.value = null;
                return;
            }

            currentTask.value = $store.getters.taskWithId($route.params.id);
        }

        loadRouteTask();

        watch(
            () => {
                return $route.params;
            }, loadRouteTask,
        );

        function createTask() {
            const taskToAdd = {
                id: new Date().getTime(),
                title: newTask.value,
                isDone: false,
                dueDate: '',
                parentId: null,
                subtasks: [],
            };

            if (currentTask.value != null) {
                taskToAdd.parentId = currentTask.value.id;
            }

            $store.dispatch('addTask', taskToAdd);
            newTask.value = '';
        }

        function backToParent() {
            if (currentTask.value != null && currentTask.value.parentId != null) {
                $router.push(`/${currentTask.value.parentId}`);
                return;
            }

            $router.push('/');
        }

        return {
            newTask,
            tasks,
            archivedTasks,
            createTask,
            currentTask,
            backToParent,
        };
    },
});
</script>


{"toCheckTasks":[],"rootTasks":[1614828809692],"tasks":[{"id":1614219967045,"title":"Task 001","isDone":true,"dueDate":20200101,"subtasks":[{"id":1614219972105,"title":"Sub 01","isDone":true,"dueDate":"2020-01-01 12:00","subtasks":[],"parentId":1614219967045},{"id":1614221262634,"title":"Sub 02","isDone":true,"dueDate":"2020-01-01 10:30","subtasks":[],"parentId":1614219967045}]}]}



