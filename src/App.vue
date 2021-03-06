<template>
    <GlobalEvents
        @keydown.meta.shift.f="onSearchShortcut"
    />
<!--    <Header />-->
    <SearchBar ref="searchBar" />
    <ConfirmationPopup
        ref="confirmationDialog"
        @onYes="onConfirmationDialogYes"
        @onNo="onConfirmationDialogNo"
        @onClose="onConfirmationDialogClose"
    />
    <div class="m-4">
        <router-view v-if="!shouldShowSearch" />
        <SearchResults v-else />
    </div>
</template>

<script>
import { defineComponent, onMounted, onDeactivated, getCurrentInstance, ref, computed } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/views/SearchResults';
import { GlobalEvents } from 'vue-global-events';
import { setOpenDelegate, setReady } from '@/electron/renderer/file';

export default defineComponent({
    name: 'App',
    components: { GlobalEvents, SearchResults, SearchBar, ConfirmationPopup },
    setup() {
        const $internalInstance = getCurrentInstance();
        const $emitter = $internalInstance.appContext.config.globalProperties.emitter;

        const confirmationDialog = ref();

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

        // Confirmation Dialog
        let confirmationDialogEvts = ref({});

        function onConfirmationDialogYes() {
            if (confirmationDialogEvts.value.onYes) {
                confirmationDialogEvts.value.onYes();
            }
        }

        function onConfirmationDialogNo() {
            if (confirmationDialogEvts.value.onNo) {
                confirmationDialogEvts.value.onNo();
            }
        }

        function onConfirmationDialogClose() {
            if (confirmationDialogEvts.value.onClose) {
                confirmationDialogEvts.value.onClose();
            }
        }

        function toggleConfirmationDialog(evts) {
            confirmationDialogEvts.value = evts ? evts : {};
            confirmationDialog.value.toggle();
        }
        $emitter.on('toggle-confirmation-dialog', toggleConfirmationDialog);
        // End Confirmation Dialog

        // SearchBar
        const searchBar = ref();

        function toggleSearchBar() {
            searchBar.value.toggle();
        }

        function search(terms) {
            searchBar.value.doSearch(terms);
        }

        function cleanSearch() {
            searchBar.value.clean();
        }

        $emitter.on('toggle-search-bar', toggleSearchBar);
        $emitter.on('search', search);
        $emitter.on('cleanSearch', cleanSearch);
        // End SearchBar

        const shouldShowSearch = computed(() => {
           return $store.state.search.trim() !== '';
        });

        function onSearchShortcut(e) {
            e.preventDefault();
            if (!$store.getters.isSearching) {
                searchBar.value.open();
            }
        }

        // function onSaveShortcut(e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //
        //     $store.dispatch('file');
        // }

        // function onOpenShortcut(e) {
        //     e.preventDefault();
        //     e.stopPropagation();
        //
        //     $store.dispatch('open');
        // }


        function handleOpen(args) {
            $store.dispatch('open', args);
            setReady(args.winId);
        }
        setOpenDelegate(handleOpen);

        return {
            confirmationDialog,
            onConfirmationDialogYes,
            onConfirmationDialogNo,
            onConfirmationDialogClose,
            onSearchShortcut,

            searchBar,
            shouldShowSearch,

            // onSaveShortcut,
            // onOpenShortcut,
        };
    },
});
</script>