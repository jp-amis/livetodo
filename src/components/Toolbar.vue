<template>
    <div class="flex gap-2">
        <div class="cursor-pointer text-gray-400 hover:text-gray-500 relative select-none">
            <svg @click="onClickToggleTag" class="w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
        </div>
        <div class="cursor-pointer text-gray-400 hover:text-gray-500 relative select-none">
            <svg @click="onClickArchive" class="w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div v-if="archiveDialogIsOpen" class="absolute bg-white border rounded px-2 py-2 right-0 z-50 w-80">
                <div class="mb-2">Do you really want to archive all done tasks?</div>
                <div class="flex gap-2 mb-4">
                    <div
                        class="text-sm cursor-pointer bg-green-300 text-white rounded hover:bg-green-400 px-1 py-1"
                        @click="onClickArchiveYes"
                    >
                        Yes, archive
                    </div>
                    <div
                        class="text-sm cursor-pointer bg-red-300 text-white rounded hover:bg-red-400 px-1 py-1"
                        @click="onClickArchiveNo"
                    >
                        No, cancel
                    </div>
                </div>
                <div class="text-xs flex items-center">
                    <input class="cursor-pointer" type="checkbox" id="archive-subtask-undone" v-model="archiveSubtasksUndone"/>
                    <label for="archive-subtask-undone" class="ml-1 cursor-pointer">Archive tasks with undone subtasks</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default defineComponent({
    name: 'Toolbar',
    props: {
        task: Object,
    },
    setup(props) {
        const $internalInstance = getCurrentInstance();
        const $emitter = $internalInstance.appContext.config.globalProperties.emitter;

        const $store = useStore();
        const $route = useRoute();

        const archiveDialogIsOpen = ref(false);
        const archiveSubtasksUndone = ref(false);

        function onClickToggleTag() {
            let shouldOpen = true;
            let parentTask = null;
            if ($route.params.id) {
                parentTask = $store.getters.taskWithId($route.params.id);
            }
            if ($store.getters.subtasksOfTask(parentTask).length === $store.state.openTagsCount) {
                shouldOpen = false;
            }
            $emitter.emit('toggleTags', shouldOpen);
        }

        function toogleArchiveDialog() {
            archiveDialogIsOpen.value = !archiveDialogIsOpen.value;
        }

        function onClickArchive() {
            toogleArchiveDialog();
        }

        function onClickArchiveNo() {
            toogleArchiveDialog();
        }

        function onClickArchiveYes() {
            toogleArchiveDialog();
            $store.dispatch('archive', {
                task: props.task,
                archiveSubtasksUndone: archiveSubtasksUndone.value,
            });
        }

        return {
            onClickToggleTag,
            onClickArchive,
            archiveDialogIsOpen,
            archiveSubtasksUndone,
            onClickArchiveYes,
            onClickArchiveNo,
        };
    },
});
</script>