<script setup lang="ts">
import { BsX } from '@kalimahapps/vue-icons/bs';

defineProps<{ show: boolean }>();
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
          class="sheet-panel relative w-full max-h-[70vh] bg-zinc-900 rounded-t-2xl overflow-y-auto"
        >
          <button
            type="button"
            class="absolute top-3 right-3 opacity-80 z-100 transition-all cursor-pointer hover:opacity-100 active:scale-80 "
            @click="emit('close')"
          >
            <BsX class="size-7" />
          </button>

          <div class="sticky top-0 z-10 flex items-center justify-between pl-5 pt-5 pb-0 pr-12">
            <slot name="header"> </slot>
          </div>

          <slot />
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
