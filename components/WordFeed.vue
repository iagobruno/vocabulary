<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/virtual';

import WordCard from './WordCard.vue';
import { useWordsStore } from '../stores/feed.ts';
import { watch, watchEffect } from 'vue';

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
  <Swiper
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
