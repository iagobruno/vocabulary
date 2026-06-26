import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useStorage } from '@vueuse/core';
import themesData from '../data/themes.json';
import { afterLast } from '../lib/utils';

export interface Theme {
  key: string;
  background: string;
  font: string;
  fontSize: string;
  fontColor: string;
}

export const useThemeStore = defineStore('theme', () => {
  const themes = (themesData as Theme[]).map((theme) => ({
    ...theme,
    key: generateKey(theme),
  }));
  const currentThemeKey = useStorage('theme', themes[0]?.key ?? '');

  const currentTheme = computed<Theme>(() => {
    return themes.find((t) => t.key === currentThemeKey.value) ?? themes[0];
  });

  function setTheme(key: string) {
    currentThemeKey.value = key;
  }

  loadAllGoogleFonts();

  return { currentThemeKey, currentTheme, themes, setTheme };
});

const SYSTEM_FONTS = new Set([
  'serif',
  'sans-serif',
  'monospace',
  'Arial',
  'Times New Roman',
  'Courier New',
]);

function loadAllGoogleFonts() {
  const fonts = themesData
    .filter((t) => !SYSTEM_FONTS.has(t.font))
    .map((t) => t.font)
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map((f) => `family=${f.replaceAll(' ', '+')}`)
    .join('&');

  if (!fonts) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
  document.head.appendChild(link);
}

function generateKey(theme: Theme): string {
  return `${afterLast('/', theme.background)}+${theme.font}`;
}
