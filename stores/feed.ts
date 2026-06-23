import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage, type UseStorageOptions } from '@vueuse/core';
import wordsData from '../data/words.json';
import { shuffle } from '../lib/utils';

export interface Word {
  word: string;
  meaning: string;
  sentence: string;
  synonyms: string[];
}

export const useWordsStore = defineStore('words', () => {
  const viewedWords = useLocalStorageSet('words_viewed');
  const savedWords = useLocalStorageSet('words_saved');

  const remainingWords = ref<Word[]>(
    shuffle(wordsData as Word[]).filter((w) => !viewedWords.value.has(w.word)),
  );

  const totalSeen = computed(() => viewedWords.value.size);
  const totalWords = wordsData.length;

  const savedWordsList = computed<Word[]>(() =>
    (wordsData as Word[]).filter((w) => savedWords.value.has(w.word)),
  );

  function markAsViewed(word: string) {
    if (!viewedWords.value.has(word)) {
      viewedWords.value = new Set([...viewedWords.value, word]);
    }
  }

  function isSaved(word: string) {
    return savedWords.value.has(word);
  }

  function toggleSaved(word: string) {
    const next = new Set(savedWords.value);
    if (next.has(word)) {
      next.delete(word);
    } else {
      next.add(word);
    }
    savedWords.value = next;
  }

  return {
    remainingWords,
    totalSeen,
    totalWords,
    savedWordsList,
    markAsViewed,
    isSaved,
    toggleSaved,
  };
});

function useLocalStorageSet(key: string, defaultValue: Set<string> = new Set()) {
  return useStorage<Set<string>>(key, defaultValue, undefined, {
    serializer: {
      read: (v) => new Set(JSON.parse(v)),
      write: (v) => JSON.stringify([...v]),
    },
  });
}
