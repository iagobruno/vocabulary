<script setup lang="ts">
import { ref, computed } from 'vue';
import { FaGraduationCap as PracticeIcon } from '@kalimahapps/vue-icons/fa';
import { useWordsStore } from '../stores/feed';
import PracticeSheet from './PracticeSheet.vue';
import Button from './Button.vue';

const store = useWordsStore();
const showPractice = ref(false);
const lastResetCount = ref(0);

const highlight = computed(() => store.viewedWordsSession.size - lastResetCount.value >= 10);

function openPractice() {
  lastResetCount.value = store.viewedWordsSession.size;
  showPractice.value = true;
}

function closePractice() {
  showPractice.value = false;
}
</script>

<template>
  <div class="fixed bottom-9 left-1/2 -translate-x-1/2 z-40">
    <Button
      @click="openPractice"
      class="px-4 duration-300"
      :class="highlight ? '!bg-white !text-black' : ''"
    >
      <PracticeIcon class="size-5" />
      <span class="text-[.9em]">Praticar</span>
    </Button>
  </div>

  <PracticeSheet :show="showPractice" @close="closePractice" />
</template>
