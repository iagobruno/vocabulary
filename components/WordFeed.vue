<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/virtual';
import { FaHandsClapping } from '@kalimahapps/vue-icons/fa';
import WordCard from './WordCard.vue';
import { useWordsStore } from '../stores/feed.ts';
import { watchEffect } from 'vue';

const store = useWordsStore();

const modules = [Virtual];

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

watchEffect(() => {
  console.log('store.remainingWords.length', store.remainingWords.length);
});
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

  <Swiper
    v-else
    :modules="modules"
    :virtual="true"
    :slides-per-view="1"
    direction="vertical"
    class="h-dvh w-full"
    @swiper="onSwiper"
    @active-index-change="onActiveIndexChange"
  >
    <SwiperSlide v-for="(word, idx) in store.remainingWords" :key="word.word" :virtual-index="idx">
      <WordCard :word="word" />
    </SwiperSlide>
  </Swiper>
</template>
