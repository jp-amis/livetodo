<template>
    <div v-if="isOpen" class="flex border-b border-gray-400 bg-gray-700 text-gray-300 text-sm h-8">
        <div class="flex justify-center cursor-pointer px-2 hover:text-gray-400" @click="onClickSearchIcon">
            <svg class="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
        <div class="flex-grow flex">
            <input
                v-model="search" ref="searchInput" class="bg-transparent flex-grow outline-none focus:outline-none" placeholder="Search"
            />
        </div>
        <div class="flex flex-col justify-center" v-if="noMatches">
            <div class="align-middle">No matches</div>
        </div>
        <div class="flex justify-center cursor-pointer px-2" @click="toggle">
            <svg class="w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
    name: 'SearchBar',
    setup() {
        const $store = useStore();

        const isOpen = ref($store.state.search.trim() !== '');

        const search = ref($store.state.search);
        const searchInput = ref();
        const noMatches = computed(() => {
            if (search.value.trim() === '') {
                return false;
            }

            if (!$store.getters.searchResults.length) {
                return true;
            }

            return false;
        });

        function onClickSearchIcon() {
            searchInput.value.focus();
        }

        function toggle() {
            isOpen.value = !isOpen.value;

            if (isOpen.value) {
                setTimeout(onClickSearchIcon, 300);
            } else {
                search.value = '';
            }
        }

        function doSearch(terms) {
            search.value = terms;

            if (search.value.trim() !== '') {
                isOpen.value = true;
            }
        }

        watch(search,
            () => {
                $store.dispatch('saveSearch', search.value);
            });

        return {
            isOpen,
            search,
            searchInput,
            noMatches,
            onClickSearchIcon,
            toggle,
            doSearch,
        };
    },
});
</script>