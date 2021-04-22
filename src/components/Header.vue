<template>
    <div class="border-b border-gray-700 bg-gray-900 text-gray-300 text-sm h-8">
        <div class="h-full flex justify-center">
            <span
                class="relative flex items-center justify-center cursor-pointer"
                @mouseenter="onMouseEnter"
                @mouseleave="onMouseLeave"
            >
                <div class="text-gray-300 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div class="ml-1 text-gray-300 flex-grow font-bold">Untitled</div>
                <div class="absolute -right-5 ml-2" v-if="isMouseHover">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Header',
    setup() {
        const isMouseHover = ref(false);

        function onMouseEnter() {
            isMouseHover.value = true;
        }

        function onMouseLeave() {
            isMouseHover.value = false;
        }

        return {
            onMouseEnter,
            onMouseLeave,
            isMouseHover,
        };
    },
});
</script>