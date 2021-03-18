<template>
    <div class="text-sm mb-2">
        <template v-for="bread of breadcumb" :key="bread.id">
            <span class="cursor-pointer hover:underline" @click="onClickBread(bread.id)">
                {{ bread.label }}
            </span>
            <span>/</span>
        </template>
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'Breadcumb',
    props: {
        task: Object,
    },
    setup(props) {
        const $store = useStore();
        const $router = useRouter();

        const breadcumb = computed(() => {
            let breads = [];
            if (props.task && props.task.parentId !== null) {
                let taskId = props.task.parentId;
                while (taskId) {
                    const task = $store.state.tasks[taskId];
                    let label = task.title;
                    if (label.length > 22) {
                        label = `${label.slice(0, 9)}..${label.slice(label.length - 9, label.length)}`;
                    }

                    breads.push({
                        label,
                        id: task.id,
                    });

                    taskId = task.parentId;
                }

                if (breads.length > 2) {
                    const almostTask = breads[2];
                    breads = breads.slice(0, 2);
                    breads.push({
                        label: '..',
                        id: almostTask.id,
                    });
                }
                breads.push({
                    label: '~',
                    id: null,
                });
            }
            return breads.reverse();
        });

        function onClickBread(id) {
            $router.push(`/${id ?? ''}`);
        }

        return {
            ...props,
            breadcumb,
            onClickBread,
        };
    },
});
</script>