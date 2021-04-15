<template>
    <template v-if="removeDialogIsOpen">
        <teleport to="#confirmation-title">Do you really want to remove this task? <span v-if="task.subtasks.length">It has {{ task.subtasks.length }} subtask{{ task.subtasks.length > 1 ? 's' : ''}}.</span></teleport>
        <teleport to="#confirmation-yes-button">Yes, remove</teleport>
        <teleport to="#confirmation-no-button">No, cancel</teleport>
    </template>
    <div
        class="relative bg-white mb-4 p-2 rounded shadow-sm cursor-pointer hover:shadow-md transform transition duration-500 flex"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <div
            class="absolute -top-3 h-6 left-0 w-full pointer-events-none flex items-center justify-center"
            v-if="isMouseHover"
        >
            <div
                class="pointer-events-auto bg-white shadow-md rounded py-1 px-1 flex items-center text-sm text-gray-500 gap-1"
            >
                <template v-if="!archived">
                    <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125">
                        <svg class="transform rotate-45 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                    </div>
                    <div class="text-gray-300">|</div>
                    <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125" @click="onClickMoveUp">
                        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                    </div>
                    <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125" @click="onClickMoveDown">
                        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div class="text-gray-300">|</div>
                    <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125" @click="onClickMoveTop">
                        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                        </svg>
                    </div>
                    <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125" @click="onClickMoveBottom">
                        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                        </svg>
                    </div>
                    <div class="text-gray-300">|</div>
                </template>
                <div class="hover:text-gray-700 transform transition w-3 h-3 hover:scale-125" @click="onClickRemove">
                    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
            </div>
        </div>
        <div class="flex flex-col flex-grow">
            <Breadcumb :task="task" :key="task?.id ?? 'x'" />
            <div class="flex gap-2 text-lg items-center text-gray-800">
                <div class="">
                    <div
                        class="border-2 w-5 h-5 text-md flex items-center"
                        @click="onClick"
                    >
                        <div v-if="task.isDone" class="w-full text-center">&times;</div>
                    </div>
                </div>
                <TaskTitle :task="task" class=""/>
            </div>
            <div class="text-sm text-gray-500 flex gap-4">
                <div class="flex flex-row justify-center items-center" @click="onClickDateArea">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="18" height="18" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <input
                        class="ml-2 focus:outline-none block"
                        :style="`width: ${dateSize}px`"
                        :class="{
                            'rounded': dueDateIsInvalid,
                            'px-1': dueDateIsInvalid || dueDateIsDue || dueDateIsToday,
                            'border': dueDateIsInvalid,
                            'border-red-400': dueDateIsInvalid,
                            'text-white': dueDateIsToday || dueDateIsDue,
                            'bg-yellow-500': dueDateIsToday && !dueDateIsDue,
                            'bg-red-500': dueDateIsDue,
                        }"
                        v-maska="['####-##-##', '####-##-## ##:##']"
                        v-model="dueDate"
                        ref="inputDate"
                    />
                    <span v-if="!task.dueDate" class="absolute left-0 ml-10 text-gray-300 pointer-events-none">YYYY-MM-DD</span>
                </div>
                <div class="text-gray-300">|</div>
                <div class="hover:underline text-gray-500" @click="toggleTags">#<span v-if="isMouseHover">tags</span><span class="text-xs" v-if="tags.length">({{ tags.length }})</span></div>
                <div class="text-gray-300">|</div>
                <div class="hover:underline cursor-pointer" @click="openSubtasks">{{ subtasksDone }}/{{ task.subtasks.length }} subtarefas</div>
            </div>
            <div class="text-sm text-gray-500 flex flex-wrap gap-2 mt-2" v-if="tagsOpen">
                <div class="hover:underline" @click="onClickAddTag">+ Add tag</div>
            </div>
            <div class="text-xs text-gray-500 flex flex-wrap gap-2 mt-2" v-if="tagsOpen && tags.length">
                <div
                    v-for="(tag, i) of tags" :key="`tags-${i}`"
                    class="bg-gray-500 text-white px-1 rounded"
                >
                    <span>#</span>
                    <contenteditable
                        class="focus:outline-none"
                        tag="span"
                        :contenteditable="true"
                        :noNL="true"
                        :noHTML="true"
                        v-model="tags[i]"
                        :ref="(el) => setTagInput(el, i)"
                        spellcheck="false"
                        @blur="validateTag(i)"
                        @keyup.esc="(e) => onTagWantsToLeave(i, e)"
                        @keyup.enter="(e) => onTagWantsToLeave(i, e)"
                    />
                </div>
<!--                <div><span>#</span><contenteditable class="focus:outline-none" tag="span" :contenteditable="true" :noNL="true" :noHTML="true" v-model="tag" spellcheck="false"  /></div>-->
<!--                <div>#{{ tag }}</div>-->
<!--                <div>#woodstack</div>-->
<!--                <div>#jcp270</div>-->
<!--                <div>#iantina</div>-->
<!--                <div>#woodstack</div>-->
<!--                <div>#jcp270</div>-->
<!--                <div>#iantina</div>-->
<!--                <div>#woodstack</div>-->
<!--                <div class="hover:underline">+ Add tag</div>-->
            </div>
        </div>
        <div class="w-10" />
        <div
            class="flex items-center w-10 cursor-pointer text-gray-600 absolute right-0 top-0 h-full"
            @click="openSubtasks">
            <div class="text-right w-full mr-2">&gt;</div>
        </div>
    </div>
</template>

<script>
import { defineComponent, computed, ref, watch, getCurrentInstance, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import moment from 'moment';
import TaskTitle from '@/components/TaskTitle';
import contenteditable from 'vue-contenteditable';
import Breadcumb from '@/components/Breadcumb';

export default defineComponent({
    name: 'Task',
    components: { TaskTitle, contenteditable, Breadcumb },
    props: {
        parentTask: Object,
        task: Object,
        archived: Boolean,
    },
    setup(props) {
        const $internalInstance = getCurrentInstance();
        const $emitter = $internalInstance.appContext.config.globalProperties.emitter;

        const $store = useStore();
        const $router = useRouter();

        const removeDialogIsOpen = ref(false);

        const isMouseHover = ref(false);
        const tagsOpen = ref(false);

        const tags = ref(props.task.tags ? props.task.tags : []);
        const tagsInput = ref([]);

        const inputDate = ref();

        const dueDate = ref(props.task.dueDate);

        const dateSize = computed(() => {
            if (dueDate.value.length <= 10) {
                return 96;
            }

            return 148;
        });

        const dueDateIsInvalid = computed(() => {
            if (!dueDate.value) {
                return false;
            }

            const date = $store.getters.getValidDate(dueDate.value);
            return date === false;
        });

        const dueDateIsToday = computed(() => {
            const date = $store.getters.getValidDate(dueDate.value);

            if (dueDateIsInvalid.value || date === false) {
                return false;
            }

            if (date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
                return true;
            }

            return false;
        });

        const dueDateIsDue = computed(() => {
            const date = $store.getters.getValidDate(dueDate.value);

            if (dueDateIsInvalid.value || date === false) {
                return false;
            }

            if (date._f === 'YYYY-MM-DD') {
                if (parseInt(date.format('YYYYMMDD')) < parseInt(moment().format('YYYYMMDD'))) {
                    return true;
                }
            } else {
                if (date.diff(moment(), 'seconds') <= 0) {
                    return true;
                }
            }

            return false;
        });

        onMounted(() => {
            if (!props.archived) {
                $emitter.on('toggleTags', setTagsOpen);
            }
        });

        onUnmounted(() => {
            if (!props.archived) {
                $emitter.off('toggleTags', setTagsOpen);
            }
        });

        watch(dueDate, () => {
            $store.dispatch('changeDueDate', {
                dueDate: dueDate.value,
                task: props.task,
            });
        });

        function onClick() {
            $store.dispatch('toggleTask', props.task);
        }

        function openSubtasks() {
            $router.push(`/${props.task.id}`);
        }

        function onClickDateArea() {
            if (inputDate.value) {
                inputDate.value.focus();
            }
        }

        function onMouseEnter() {
            isMouseHover.value = true;
        }

        function onMouseLeave() {
            isMouseHover.value = false;
        }

        function onClickMoveUp() {
            $store.dispatch('moveTask', {
                task: props.task,
                direction: 'UP',
            });
        }

        function onClickMoveDown() {
            $store.dispatch('moveTask', {
                task: props.task,
                direction: 'DOWN',
            });
        }

        function onClickMoveTop() {
            $store.dispatch('moveTask', {
                task: props.task,
                direction: 'TOP',
            });
        }

        function onClickMoveBottom() {
            $store.dispatch('moveTask', {
                task: props.task,
                direction: 'BOTTOM',
            });
        }

        function setTagsOpen(v) {
            if (tagsOpen.value === v) {
                return;
            }

            tagsOpen.value = v;
            $store.commit('addOpenTagsCount', tagsOpen.value ? 1 : -1);
        }

        function toggleTags() {
            tagsOpen.value = !tagsOpen.value;
            $store.commit('addOpenTagsCount', tagsOpen.value ? 1 : -1);
        }

        function saveTags() {
            $store.dispatch('changeTags', {
                tags: tags.value,
                task: props.task,
            });
        }

        let shouldFocusNextTag = false;
        function onClickAddTag() {
            saveTags();
            shouldFocusNextTag = true;
            tags.value.push('');
        }

        function setTagInput(el, i) {
            tagsInput.value[i] = el;

            if (shouldFocusNextTag && i === tags.value.length - 1) {
                let interval = null;
                interval = setInterval(() => {
                    if (el.element) {
                        el.element.focus();
                        shouldFocusNextTag = false;
                        clearInterval(interval);
                    }
                }, 200)
            }
        }

        function validateTag(iTag) {
            tags.value[iTag] = tags.value[iTag].trim().replaceAll(' ', '-');

            if (tags.value[iTag] !== '') {
                saveTags();
                return;
            }

            tags.value.splice(iTag, 1);
            saveTags();
        }

        function onTagWantsToLeave(iTag, evt) {
            evt.currentTarget.blur();
        }

        function onCloseRemove() {
            removeDialogIsOpen.value = false;
        }

        function onClickRemoveYes() {
            $emitter.emit('toggle-confirmation-dialog', {
                onClose: onCloseRemove,
            });

            $store.dispatch('removeTask', props.task);
        }

        function onClickRemoveNo() {
            $emitter.emit('toggle-confirmation-dialog', {
                onClose: onCloseRemove,
            });
        }

        function onClickRemove() {
            $emitter.emit('toggle-confirmation-dialog', {
                onClose: onCloseRemove,
                onYes: onClickRemoveYes,
                onNo: onClickRemoveNo,
            });
            removeDialogIsOpen.value = true;
        }

        return {
            ...props,
            inputDate,
            dueDate,
            dateSize,
            dueDateIsInvalid,
            dueDateIsToday,
            dueDateIsDue,
            subtasksDone: computed(() => $store.getters.countDoneSubtasks(props.task)),
            onClick,
            openSubtasks,
            onClickDateArea,
            onMouseEnter,
            onMouseLeave,
            isMouseHover,
            onClickMoveUp,
            onClickMoveDown,
            onClickMoveTop,
            onClickMoveBottom,
            toggleTags,
            tagsOpen,
            onClickAddTag,
            tags,
            onTagWantsToLeave,
            validateTag,
            onClickRemove,
            removeDialogIsOpen,
            setTagInput,
        };
    },
})
</script>