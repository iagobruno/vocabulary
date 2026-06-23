<script setup lang="ts">
import ModalSheet from './ModalSheet.vue';
import { useThemeStore } from '../stores/theme';
import { isColor } from '../lib/utils.ts';

const themeStore = useThemeStore();

defineProps<{ show: boolean }>();
const emit = defineEmits<{ close: [] }>();

function selectTheme(key: string) {
  themeStore.setTheme(key);
}
</script>

<template>
  <ModalSheet :show="show" @close="emit('close')">
    <template #header> <h2 class="text-xl font-semibold">Escolher Tema</h2> </template>

    <div class="grid grid-cols-3 gap-3 p-5 pt-4">
      <button
        v-for="(theme, index) in themeStore.themes"
        :key="index"
        class="aspect-9/16 rounded-md overflow-hidden bg-cover bg-center relative flex items-center justify-center cursor-pointer transition-transform active:scale-95 hover:ring-2 hover:ring-white/50"
        :style="{
          backgroundColor: isColor(theme.background) ? theme.background : undefined,
          backgroundImage: !isColor(theme.background) ? `url(${theme.background})` : undefined,
        }"
        @click="selectTheme(theme.key)"
      >
        <span
          class="text-3xl font-medium"
          :style="{ fontFamily: theme.font, color: theme.fontColor }"
        >
          Aa
        </span>
      </button>
    </div>
  </ModalSheet>
</template>
