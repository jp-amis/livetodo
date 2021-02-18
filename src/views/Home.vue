<template>
    <div class="mb-4">
        <div class="flex items-center mb-4" v-if="currentTask">
            <div class="pr-4 cursor-pointer" @click="backToHome">&lt;</div>
            <h1 class="font-bold text-2xl">{{ currentTask.title }}</h1>
        </div>
        <h2 class="font-bold text-lg">Nova task</h2>
        <input
            class="w-full shadow-sm rounded px-2 py-1"
            placeholder="Task aqui!"
            @keydown.enter="createTask"
            v-model="newTask"
            type="text"
        />
    </div>
    <Task
        v-for="task in tasks"
        :key="task.id"
        :parentTask="currentTask"
        :task="task"
    />
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';
import Task from '@/components/Task';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
    name: 'TaskList',
    components: { Task },
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
            }, loadRouteTask
        );

        function createTask() {
            const taskToAdd = {
                id: new Date().getTime(),
                title: newTask.value,
                isDone: false,
                dueDate: 20200101,
                subtasks: [],
            };
            $store.dispatch('addTask', {
                parentTask: currentTask.value,
                task: taskToAdd,
            });
            newTask.value = '';
        }

        function backToHome() {
            $router.push('/');
        }

        return {
            newTask,
            tasks,
            createTask,
            currentTask,
            backToHome,
        };
    },
})
</script>













