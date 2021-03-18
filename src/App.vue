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
                const date = $store.getters.getValidDate(task.dueDate);
                if (date) {
                    if (date._f === 'YYYY-MM-DD') {
                        if (parseInt(date.format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD'))) {
                            $store.dispatch('updateTaskToCheck', task);
                        }
                    } else {
                        if (date.diff(moment(), 'seconds') <= 0) {
                            $store.dispatch('updateTaskToCheck', task);
                        }
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