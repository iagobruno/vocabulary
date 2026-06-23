<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/virtual';
import { FaHandsClapping } from '@kalimahapps/vue-icons/fa';
import { AkChevronDown } from '@kalimahapps/vue-icons/ak';
import WordCard from './WordCard.vue';
import { useWordsStore } from '../stores/feed.ts';
const modules = [Virtual, Keyboard, Mousewheel];

const store = useWordsStore();

function markCurrent(swiper: any) {
  const word = store.remainingWords[swiper.activeIndex];
  if (word) {
    store.markAsViewed(word.word);
  }
}

function onSwiper(swiper: any) {
  markCurrent(swiper);
}

function onActiveIndexChange(swiper: any) {
  markCurrent(swiper);
}
</script>

<template>
  <div
    v-if="store.remainingWords.length === 0"
    class="flex h-dvh flex-col items-center justify-center px-6 text-center"
  >
    <FaHandsClapping class="mb-6 size-20 text-yellow-400" />
    <p class="text-2xl font-bold text-white">Você viu todas as palavras!</p>
    <p class="mt-2 text-gray-400">Volta outro dia para aprender mais 👏</p>
  </div>

  <template v-else>
    <Swiper
      :modules="modules"
      :virtual="true"
      :slides-per-view="1"
      direction="vertical"
      :keyboard="{ enabled: true }"
      :mousewheel="{ thresholdDelta: 26 }"
      class="h-full w-full"
      @swiper="onSwiper"
      @active-index-change="onActiveIndexChange"
    >
      <SwiperSlide
        v-for="(word, idx) in store.remainingWords"
        :key="word.word"
        :virtual-index="idx"
      >
        <WordCard :word="word" />
      </SwiperSlide>
    </Swiper>
    <AkChevronDown
      v-if="store.remainingWords.length > 1"
      class="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-5.5 text-white/45 animate-bounce [animation-duration:1.6s]"
    />
  </template>
</template>
