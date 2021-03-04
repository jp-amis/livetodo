<template>
    <div class="mb-4">
        <div class="flex items-center mb-4" v-if="currentTask">
            <div class="pr-4 cursor-pointer" @click="backToParent">&lt;</div>
            <TaskTitle :task="currentTask" :key="currentTask.id" class="text-2xl" />
        </div>
        <h2 class="font-bold text-lg">Nova task</h2>
        <input
            class="w-full shadow-sm rounded px-2 py-1" placeholder="Enter your task..." @keydown.enter="createTask" v-model="newTask" type="text"
        />
    </div>
    <Task
        v-for="task in tasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :parentTask="currentTask" :task="task"
    />
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import Task from '@/components/Task';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import TaskTitle from '@/components/TaskTitle';

export default defineComponent({
    name: 'TaskList',
    components: { TaskTitle, Task },
    setup() {
        const $store = useStore();
        const $route = useRoute();
        const $router = useRouter();

        const newTask = ref('');
        const currentTask = ref(null);
        const tasks = computed(() => {
            return $store.getters.subtasksOfTask(currentTask.value);
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
            createTask,
            currentTask,
            backToParent,
        };
    },
});
</script>


{"toCheckTasks":[],"rootTasks":[1614828809692],"tasks":[{"id":1614219967045,"title":"Task 001","isDone":true,"dueDate":20200101,"subtasks":[{"id":1614219972105,"title":"Sub 01","isDone":true,"dueDate":"2020-01-01 12:00","subtasks":[],"parentId":1614219967045},{"id":1614221262634,"title":"Sub 02","isDone":true,"dueDate":"2020-01-01 10:30","subtasks":[],"parentId":1614219967045}]}]}



