<script setup lang="ts">
import { ref, computed } from 'vue';
import { BsBookmarkFill } from '@kalimahapps/vue-icons/bs';
import { useWordsStore } from '../stores/feed';
import ModalSheet from './ModalSheet.vue';

defineProps<{ show: boolean }>();
const emit = defineEmits<{ close: [] }>();

const store = useWordsStore();

const sortBy = ref<'recent' | 'alpha'>('recent');

const sortedWords = computed(() => {
  const list = store.savedWordsList;
  if (sortBy.value === 'alpha') {
    return [...list].sort((a, b) => a.word.localeCompare(b.word));
  }
  return list;
});
</script>

<template>
  <ModalSheet :show @close="emit('close')">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-medium text-white">Palavras salvas</h2>
        <select
          v-model="sortBy"
          class="text-xs bg-zinc-800 text-gray-300 border border-zinc-700 rounded-lg px-2 py-1 outline-none cursor-pointer"
        >
          <option value="recent">Mais recentes</option>
          <option value="alpha">Ordem alfabética</option>
        </select>
      </div>
    </template>

    <div v-if="sortedWords.length" class="grid grid-cols-2 gap-3 p-4">
      <div
        v-for="word in sortedWords"
        :key="word.word"
        class="bg-zinc-800 rounded-xl p-3.5 relative"
      >
        <p class="font-lora font-medium text-white text-[1.03rem]">{{ word.word }}</p>
        <p class="text-xs/4.5 text-gray-400 mt-1">{{ word.meaning }}</p>
        <button
          class="absolute top-2 right-1.5 p-1 text-white cursor-pointer transition-transform active:scale-80"
          @click="store.toggleSaved(word.word)"
        >
          <BsBookmarkFill class="size-3.5" />
        </button>
      </div>
    </div>
    <div v-else class="p-10 text-center text-sm text-gray-500">Nenhuma palavra salva ainda</div>
  </ModalSheet>
</template>
