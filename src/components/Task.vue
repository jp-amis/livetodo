<template>
    <div
        class="bg-white mb-4 p-2 rounded shadow-sm cursor-pointer hover:shadow-md transform transition duration-500 flex">
        <div class="flex flex-col flex-grow">
            <div class="flex gap-2 text-lg items-center text-gray-800">
                <div
                    class="border-2 w-5 h-5 text-md flex items-center"
                    @click="onClick"
                >
                    <div v-if="task.isDone" class="w-full text-center">&times;</div>
                </div>
                <TaskTitle :task="task" />
            </div>
            <div class="text-sm text-gray-500 flex gap-4">
                <div class="flex flex-row justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span
                        type="text"
                        class="ml-2 focus:outline-none"
                        :class="{
                            'rounded': dueDateIsInvalid,
                            'px-2': dueDateIsInvalid || dueDateIsDue || dueDateIsToday,
                            'border': dueDateIsInvalid,
                            'border-red-400': dueDateIsInvalid,
                            'text-white': dueDateIsToday || dueDateIsDue,
                            'bg-yellow-500': dueDateIsToday && !dueDateIsDue,
                            'bg-red-500': dueDateIsDue,
                        }"
                        contenteditable="true"
                        @keyup="onKeyupDueDate"
                        @keydown.enter="onEnterDueDate"
                    >
                        {{ task.dueDate }}
                    </span>
                </div>
                <div class="text-gray-300">|</div>
                <div>{{ subtasksDone }}/{{ task.subtasks.length }} subtarefas</div>
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
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import TaskTitle from '@/components/TaskTitle';

export default defineComponent({
    name: 'Task',
    components: { TaskTitle },
    props: {
        parentTask: Object,
        task: Object,
    },
    setup(props) {
        const $store = useStore();
        const $router = useRouter();

        const dueDate = ref(props.task.dueDate);

        const dueDateIsInvalid = computed(() => {
            const date = moment(dueDate.value, 'YYYY-MM-DD HH:mm', true);
            return !date.isValid();
        });

        const dueDateIsToday = computed(() => {
            if (dueDateIsInvalid.value) {
                return false;
            }

            const date = moment(dueDate.value, 'YYYY-MM-DD HH:mm', true);
            if (date.diff(moment(), 'days') === 0) {
                return true;
            }

            return false;
        });

        const dueDateIsDue = computed(() => {
            if (dueDateIsInvalid.value) {
                return false;
            }

            const date = moment(dueDate.value, 'YYYY-MM-DD HH:mm', true);
            if (date.diff(moment(), 'minutes') < 0) {
                return true;
            }

            return false;
        });
        //     dueDateIsDue,

        watch(dueDate, () => {
            $store.dispatch('changeDueDate', {
                dueDate: dueDate.value,
                task: props.task,
                parent: props.parentTask,
            });
        });

        function onClick() {
            $store.dispatch('toggleTask', {
                task: props.task,
                parent: props.parentTask,
            });
        }

        function openSubtasks() {
            $router.push(`/${props.task.id}`);
        }

        function onEnterDueDate(e) {
            e.preventDefault();
            e.currentTarget.blur();
        }

        function onKeyupDueDate(e) {
            dueDate.value = e.currentTarget.innerText;
        }

        return {
            ...props,
            dueDateIsInvalid,
            dueDateIsToday,
            dueDateIsDue,
            subtasksDone: computed(() => $store.getters.countDoneSubtasks(props.task)),
            onClick,
            openSubtasks,
            onEnterDueDate,
            onKeyupDueDate,
        };
    },
})
</script>