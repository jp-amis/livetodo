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
        <h2 class="font-bold text-lg">New task</h2>
        <input
            class="w-full shadow-sm rounded px-2 py-1" placeholder="Enter your task..." @keydown.enter="createTask" v-model="newTask" type="text"
        />
    </div>
    <VueDraggableNext class="dragArea list-group w-full" :list="tasks" @change="onDragTasks">
        <Task
            v-for="task in tasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :parentTask="currentTask" :task="task"
        />
    </VueDraggableNext>
    <div class="flex mb-4">
        <div class="flex-grow flex justify-center items-center">
            <div class="border-b border-gray-300 flex-grow h-1"></div>
        </div>
        <div class="mx-5 text-gray-300">Archive</div>
        <div class="flex-grow flex justify-center items-center">
            <div class="border-b border-gray-300 flex-grow h-1"></div>
        </div>
    </div>
    <Task
        v-for="task in archivedTasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :parentTask="currentTask" :task="task" :archived="true"
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
import { VueDraggableNext } from 'vue-draggable-next';

export default defineComponent({
    name: 'TaskList',
    components: { Breadcumb, Toolbar, TaskTitle, Task, VueDraggableNext },
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
            $store.commit('resetOpenTagsCount');
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
                tags: [],
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

        function onDragTasks(e) {
            if (!e.moved) {
                return;
            }

            $store.dispatch('swapTask', {
                task: e.moved.element,
                oldIndex: e.moved.oldIndex,
                newIndex: e.moved.newIndex,
            });
        }

        return {
            newTask,
            tasks,
            archivedTasks,
            createTask,
            currentTask,
            backToParent,
            onDragTasks,
        };
    },
});
</script>


{"toCheckTasks":[],"rootTasks":[1614828809692],"tasks":[{"id":1614219967045,"title":"Task 001","isDone":true,"dueDate":20200101,"subtasks":[{"id":1614219972105,"title":"Sub 01","isDone":true,"dueDate":"2020-01-01 12:00","subtasks":[],"parentId":1614219967045},{"id":1614221262634,"title":"Sub 02","isDone":true,"dueDate":"2020-01-01 10:30","subtasks":[],"parentId":1614219967045}]}]}



