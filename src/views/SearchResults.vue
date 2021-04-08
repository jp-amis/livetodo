<template>
    <div>
        <Task
            v-for="task in tasks" :key="task.id + (task.keyId ? task.keyId : 'xxx')" :task="task"
        />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import Task from '@/components/Task';

export default defineComponent({
    name: 'SearchResults',
    components: { Task },
    setup() {
        const $store = useStore();
        return {
            tasks: computed(() => $store.getters.searchResults),
        };
    },
});
</script>