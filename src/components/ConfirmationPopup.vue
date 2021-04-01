<template>
    <div
        v-if="isOpen"
        class="bg-black opacity-80 fixed top-0 left-0 w-screen h-screen z-50"
        @click="toggle"
    />
    <div v-if="isOpen" class="fixed bg-white border rounded px-2 py-2 z-50 w-3/4 mx-auto inset-x-0">
        <div class="mb-2" id="confirmation-title" />
        <div class="flex flex-grow gap-2">
            <div
                class="text-sm cursor-pointer bg-green-300 text-white rounded hover:bg-green-400 px-1 py-1"
                @click="onClickYes"
                id="confirmation-yes-button"
            />
            <div
                class="text-sm cursor-pointer bg-red-300 text-white rounded hover:bg-red-400 px-1 py-1"
                @click="onClickNo"
                id="confirmation-no-button"
            />
        </div>
        <div id="confirmation-extras" />
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'ConfirmationPopup',
    setup(_, context) {
        const isOpen = ref(false);

        function toggle() {
            isOpen.value = !isOpen.value;
            if (!isOpen.value) {
                context.emit('onClose');
            }
        }

        function onClickYes() {
            context.emit('onYes');
        }

        function onClickNo() {
            context.emit('onNo');
        }

        return {
            onClickYes,
            onClickNo,

            isOpen,
            toggle,
        };
    },
});
</script>