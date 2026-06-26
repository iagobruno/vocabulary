<script setup lang="ts">
import { inject, ref } from 'vue';
import { BsBookmark, BsBookmarkFill } from '@kalimahapps/vue-icons/bs';
import { IoOutlineShare } from '@kalimahapps/vue-icons/io';
import { IcSolidSoundHigh as SoundHighIcon } from '@kalimahapps/vue-icons/ic';
import type { Word } from '../stores/feed.ts';
import { useWordsStore } from '../stores/feed.ts';
import { useThemeStore } from '../stores/theme.ts';
import { generateSharableImage } from '../lib/generateSharableImage.ts';
import Button from './Button.vue';

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

const speaking = ref(false);
const hasSpeechSupport = 'speechSynthesis' in window;

function speak() {
  if (!hasSpeechSupport || speaking.value) return;

  const lang = 'pt-BR';
  const utterance = new SpeechSynthesisUtterance(props.word.word);
  utterance.lang = lang;
  utterance.rate = 0.86;
  utterance.pitch = 1;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang.startsWith(lang));
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    speaking.value = true;
  };
  utterance.onend = () => {
    speaking.value = false;
  };
  utterance.onerror = () => {
    speaking.value = false;
  };
  speechSynthesis.speak(utterance);
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
      <div class="relative w-fit">
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
        <Button
          v-if="hasSpeechSupport"
          class="text-[1em] p-2! opacity-60 mt-0.5 ml-2.5 absolute left-full top-2/4 -translate-y-2/4"
          :class="speaking ? 'text-sky-500! opacity-100!' : 'hover:opacity-100'"
          @click="speak"
        >
          <SoundHighIcon class="size-3.5 transition-colors" />
        </Button>
      </div>
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
      class="flex w-full justify-center items-center gap-6 absolute bottom-26 left-0 right-0 z-1"
    >
      <Button @click="handleShare" class="bg-transparent backdrop-blur-none">
        <IoOutlineShare class="size-8.5 scale-90" />
      </Button>
      <Button @click="handleSave" class="bg-transparent backdrop-blur-none">
        <BsBookmarkFill v-if="store.isSaved(word.word)" class="size-7 scale-90" />
        <BsBookmark v-else class="size-7.5 scale-90" />
      </Button>
    </div>
  </div>
</template>
