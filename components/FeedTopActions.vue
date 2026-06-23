<script setup lang="ts">
import { ref } from 'vue';
import NumberFlow from '@number-flow/vue';
import { BsCollection } from '@kalimahapps/vue-icons/bs';
import { useWordsStore } from '../stores/feed.ts';
import SavedWordsSheet from './SavedWordsSheet.vue';
import IconButton from './IconButton.vue';

const store = useWordsStore();
const showSaved = ref(false);
</script>

<template>
  <div
    class="flex justify-between items-center absolute top-0 left-0 w-full px-3 pt-3 pb-7 z-10 bg-linear-to-b from-black/60 to-transparent"
  >
    <div class="size-9"></div>

    <div class="text-center text-[0.68rem]">
      <NumberFlow :value="store.totalSeen" />
      palavras aprendidas
    </div>

    <IconButton data-flash-target="collection" @click="showSaved = true">
      <BsCollection class="size-4.5" />
    </IconButton>
  </div>

  <SavedWordsSheet :show="showSaved" @close="showSaved = false" />
</template>
