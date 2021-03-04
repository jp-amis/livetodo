<template>
    <div class="m-4">
        <router-view />
    </div>
</template>

<script>
import { defineComponent, onMounted, onDeactivated } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';

export default defineComponent({
    name: 'App',
    setup() {
        const $store = useStore();

        let checkerInterval = null;

        function check() {
            for (const taskId of $store.state.toCheckTasks) {
                const task = $store.getters.taskWithId(taskId);
                const date = moment(task.dueDate, 'YYYY-MM-DD HH:mm', true);
                if (date.isValid()) {
                    console.log('Checking', taskId, task.dueDate);
                    if (date.diff(moment(), 'seconds') <= 0) {
                        $store.dispatch('updateTaskToCheck', task);
                    }
                    return;
                }
            }
        }

        onMounted(() => {
            checkerInterval = setInterval(check, 1000);
        });

        onDeactivated(() => {
            clearInterval(checkerInterval);
        });

        return {};
    },
});
</script>