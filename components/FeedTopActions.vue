<script setup lang="ts">
import { ref } from 'vue';
import NumberFlow from '@number-flow/vue';
import { BsCollection } from '@kalimahapps/vue-icons/bs';
import { FlFilledPaintBrushSparkle as PaintIcon } from '@kalimahapps/vue-icons/fl';
import { useWordsStore } from '../stores/feed.ts';
import SavedWordsSheet from './SavedWordsSheet.vue';
import ThemeSheet from './ThemeSheet.vue';
import Button from './Button.vue';

const store = useWordsStore();
const showSaved = ref(false);
const showThemes = ref(false);
</script>

<template>
  <div
    class="flex justify-between items-center absolute top-safe-or-0 left-0 w-full px-4 pt-3.5 pb-7 z-10 bg-linear-to-b from-black/60 to-transparent"
  >
    <Button @click="showThemes = true"> <PaintIcon class="size-6" /> </Button>

    <div class="text-center text-[0.68rem] mb-1">
      <NumberFlow :value="store.totalSeen" />
      palavras aprendidas
    </div>

    <Button data-flash-target="collection" @click="showSaved = true">
      <BsCollection class="size-6" />
    </Button>
  </div>

  <SavedWordsSheet :show="showSaved" @close="showSaved = false" />
  <ThemeSheet :show="showThemes" @close="showThemes = false" />
</template>
