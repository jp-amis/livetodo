<template>
    <div
        class="font-bold focus:outline-none flex-grow"
        :class="{
            'line-through': task.isDone
        }"
        contenteditable="true"
        @keyup="onKeyup"
        @keydown.enter="onEnter"
    >{{ task.title }}</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'TaskTitle',
    props: {
        task: Object,
    },
    setup(props) {
        const $store = useStore();

        const title = ref(props.task.title);

        function handleSave() {
            $store.dispatch('changeTitle', {
                title: title.value,
                task: props.task,
            });
        }

        function onEnter(e) {
            e.preventDefault();
        }

        function onKeyup(e) {
            title.value = e.currentTarget.innerText;
            handleSave();
        }

        return {
            ...props,
            onKeyup,
            onEnter,
        };
    },
});
</script>