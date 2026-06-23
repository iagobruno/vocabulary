<script setup lang="ts">
import { inject } from 'vue';
import { BsBookmark, BsBookmarkFill } from '@kalimahapps/vue-icons/bs';
import type { Word } from '../stores/feed.ts';
import { useWordsStore } from '../stores/feed.ts';
import IconButton from './IconButton.vue';

const props = defineProps<{ word: Word }>();

const store = useWordsStore();
const triggerSaveFlash = inject<(() => void) | undefined>('triggerSaveFlash');

function handleSave() {
  const wasNotSaved = !store.isSaved(props.word.word);
  store.toggleSaved(props.word.word);
  if (wasNotSaved && triggerSaveFlash) {
    triggerSaveFlash();
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col items-center justify-center gap-4 px-5 relative">
    <div class="text-center flex flex-col items-center justify-center gap-4">
      <h2 class="font-lora text-4xl font-medium">{{ word.word }}</h2>
      <p class="max-w-md text-base leading-relaxed text-gray-300">{{ word.meaning }}</p>
      <p class="max-w-md text-sm italic leading-relaxed text-gray-400">"{{ word.sentence }}"</p>
      <div class="text-xs text-gray-400">
        Sinônimos:
        <div class="flex flex-wrap justify-center gap-2 mt-1.5">
          <span
            v-for="syn in word.synonyms"
            :key="syn"
            class="rounded-full border border-gray-600 px-2 py-0.5"
          >
            {{ syn }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-center items-center gap-6 absolute bottom-8 left-0 right-0 z-1">
      <IconButton @click="handleSave">
        <BsBookmarkFill v-if="store.isSaved(word.word)" class="size-6 text-white" />
        <BsBookmark v-else class="size-6" />
      </IconButton>
    </div>
  </div>
</template>
