<template>
    <div
        class="bg-white mb-4 p-2 rounded shadow-sm cursor-pointer hover:shadow-md transform transition duration-500 flex">
        <div class="flex flex-col flex-grow">
            <div class="flex gap-2 text-lg items-center text-gray-800" @click="onClick">
                <div
                    class="border-2 w-5 h-5 text-md flex items-center"
                >
                    <div v-if="task.isDone" class="w-full text-center">&times;</div>
                </div>
                <div
                    class="font-bold font-str"
                    :class="{
                        'line-through': task.isDone
                    }"
                >{{ task.title }}</div>
            </div>
            <div class="text-sm text-gray-500 flex gap-4">
<!--                <div><span class="font-bold">Due:</span> {{ task.dueDate }}</div>-->
<!--                <div class="text-gray-300">|</div>-->
<!--                <div>0/{{ task.subtasks.length }} subtarefas</div>-->
            </div>
        </div>
        <div
            v-if="!parentTask"
            class="flex items-center w-10 cursor-pointer text-gray-600"
            @click="openSubtasks">
            <div class="text-right w-full">&gt;</div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Task',
    props: {
        parentTask: Object,
        task: Object,
    },
    setup(props) {
        const $store = useStore();
        const $router = useRouter();

        function onClick() {
            $store.dispatch('toggleTask', {
                task: props.task,
                parent: props.parentTask,
            });
        }

        function openSubtasks() {
            $router.push(`/${props.task.id}`);
        }

        return {
            ...props,
            onClick,
            openSubtasks,
        };
    },
})
</script>