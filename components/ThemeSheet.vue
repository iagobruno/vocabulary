<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ModalSheet from './ModalSheet.vue';
import { useThemeStore } from '../stores/theme';
import { isColor } from '../lib/utils.ts';

const themeStore = useThemeStore();
const gridRef = ref<HTMLElement | null>(null);

const props = defineProps<{ show: boolean }>();
const emit = defineEmits<{ close: [] }>();

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => {
        const active = gridRef.value?.querySelector('[data-active="true"]');
        active?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  },
);

function selectTheme(key: string) {
  themeStore.setTheme(key);
}
</script>

<template>
  <ModalSheet :show="show" @close="emit('close')">
    <div
      class="sticky z-2 top-0 left-0 right-0 px-5 pt-5 pb-10 bg-linear-to-b from-black/80 to-transparent"
    >
      <h2 class="text-xl font-semibold">Escolher Tema</h2>
    </div>

    <div ref="gridRef" class="grid grid-cols-3 gap-3 p-5 pt-4">
      <button
        v-for="(theme, index) in themeStore.themes"
        :key="index"
        :data-active="theme.key === themeStore.currentThemeKey || undefined"
        class="aspect-9/16 rounded-md overflow-hidden bg-cover bg-center relative flex items-center justify-center cursor-pointer select-none transition-transform active:scale-90"
        :class="{
          'ring-3 ring-white': theme.key === themeStore.currentThemeKey
        }"
        :style="{
          backgroundColor: isColor(theme.background) ? theme.background : undefined,
          backgroundImage: !isColor(theme.background) ? `url(${theme.background})` : undefined,
        }"
        @click="selectTheme(theme.key)"
      >
        <span
          class="text-[2.2rem] font-normal text-shadow-lg pointer-events-none"
          :style="{ fontFamily: theme.font, color: theme.fontColor }"
        >
          Aa
        </span>
      </button>
    </div>
  </ModalSheet>
</template>
