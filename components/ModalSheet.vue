<script setup lang="ts">
import { BsX as CloseIcon } from '@kalimahapps/vue-icons/bs';
import { twMerge } from 'tailwind-merge';
import Button from './Button.vue';

const props = defineProps<{ show: boolean; modalClass?: string; hideClose?: boolean }>();
const emit = defineEmits<{ close: [] }>();
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet" :duration="500">
      <div
        v-if="show"
        class="fixed inset-0 z-50 h-dvh max-w-full aspect-9/16 mx-auto flex items-end"
      >
        <div class="backdrop absolute inset-0 bg-black/60" @click="emit('close')"></div>

        <div
          class=""
          :class="twMerge('sheet-panel relative w-full max-h-[85dvh] bg-zinc-900 rounded-t-2xl overflow-clip', props.modalClass)"
        >
          <Button
            v-if="!hideClose"
            class="absolute top-4 right-3 p-1 opacity-80 z-10 transition-all cursor-pointer hover:opacity-100 active:scale-80"
            @click="emit('close')"
          >
            <CloseIcon class="size-7.5" />
          </Button>

          <div v-if="$slots.header" class="flex items-center justify-between pt-8 pb-0 pl-5 pr-14">
            <slot name="header"> </slot>
          </div>

          <div
            class="sheet-content size-full max-h-[inherit] relative overflow-auto scrollbar-thin overscroll-contain scheme-dark"
          >
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-enter-active .backdrop,
.sheet-leave-active .backdrop {
  transition: opacity 500ms ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from .backdrop,
.sheet-leave-to .backdrop {
  opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateY(100%);
}
</style>
