<script setup lang="ts">
import { inject } from 'vue';
import { BsBookmark, BsBookmarkFill } from '@kalimahapps/vue-icons/bs';
import { IoOutlineShare } from '@kalimahapps/vue-icons/io';
import type { Word } from '../stores/feed.ts';
import { useWordsStore } from '../stores/feed.ts';
import { useThemeStore } from '../stores/theme.ts';
import { generateSharableImage } from '../lib/generateSharableImage.ts';
import IconButton from './IconButton.vue';

const props = defineProps<{ word: Word }>();

const store = useWordsStore();
const themeStore = useThemeStore();
const triggerSaveFlash = inject<(() => void) | undefined>('triggerSaveFlash');

function handleSave() {
  const wasNotSaved = !store.isSaved(props.word.word);
  store.toggleSaved(props.word.word);
  if (wasNotSaved && triggerSaveFlash) {
    triggerSaveFlash();
  }
}

async function handleShare() {
  try {
    const blob = await generateSharableImage(props.word, {});

    const file = new File([blob], `${props.word.word}.jpg`, { type: 'image/jpeg' });

    if (navigator.canShare && navigator.canShare({ files: [file], title: props.word.word })) {
      await navigator.share({ files: [file], title: props.word.word });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.word.word}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error sharing image:', error);
  }
}
</script>

<template>
  <div class="flex h-dvh flex-col items-center justify-center gap-4 px-5 relative">
    <div class="text-center flex flex-col items-center justify-center gap-4 text-shadow-lg">
      <h2
        class="text-4xl"
        :style="{
          fontFamily: `${themeStore.currentTheme.font}, Lora, Inter, serif`,
          fontSize: themeStore.currentTheme.fontSize,
          color: themeStore.currentTheme.fontColor,
        }"
      >
        {{ word.word }}
      </h2>
      <p class="max-w-md text-base leading-relaxed text-gray-300">{{ word.meaning }}</p>
      <p class="max-w-md text-sm italic leading-relaxed text-gray-300">"{{ word.sentence }}"</p>
      <div class="text-[.8rem] text-gray-300">
        Sinônimos:
        <div class="flex flex-wrap justify-center gap-2 mt-1.5">
          <span
            v-for="syn in word.synonyms"
            :key="syn"
            class="rounded-full bg-white/5 border border-white/50 px-2 py-0.5"
          >
            {{ syn }}
          </span>
        </div>
      </div>
      <div class="text-[.8rem] text-gray-300">
        Antônimos:
        <div class="flex flex-wrap justify-center gap-2 mt-1.5">
          <span
            v-for="ant in word.antonyms"
            :key="ant"
            class="rounded-full bg-white/5 border border-white/30 px-2 py-0.5"
          >
            {{ ant }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex w-full justify-center items-center gap-6 absolute bottom-13 left-0 right-0 z-1"
    >
      <IconButton @click="handleShare"> <IoOutlineShare class="size-7 scale-90" /> </IconButton>
      <IconButton @click="handleSave">
        <BsBookmarkFill v-if="store.isSaved(word.word)" class="size-7 scale-90" />
        <BsBookmark v-else class="size-7 scale-90" />
      </IconButton>
    </div>
  </div>
</template>
