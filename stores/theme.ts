import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import themesData from '../data/themes.json';
import { afterFirst, afterLast, isColor } from '../lib/utils';

export interface Theme {
  key: string;
  background: string;
}

export const useThemeStore = defineStore('theme', () => {
  const themes = (themesData as Theme[]).map((theme) => ({
    ...theme,
    background: fixBgImagePath(theme.background),
    key: generateKey(theme),
  }));
  const currentThemeKey = useStorage('theme', themes[0]?.key ?? '');

  const currentTheme = computed<Theme>(() => {
    return themes.find((t) => t.key === currentThemeKey.value) ?? themes[0];
  });

  function setTheme(key: string) {
    currentThemeKey.value = key;
  }

  return { currentThemeKey, currentTheme, themes, setTheme };
});

function generateKey(theme: Theme): string {
  return afterLast('/', theme.background);
}

function fixBgImagePath(value: string) {
  if (isColor(value)) {
    return value;
  }
  return import.meta.env.BASE_URL + afterFirst('/', value);
}
