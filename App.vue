<script setup lang="ts">
import { ref, computed, provide } from 'vue';
import { FaHandsClapping } from '@kalimahapps/vue-icons/fa';
import { useWordsStore } from './stores/feed.ts';
import { useThemeStore } from './stores/theme.ts';
import WordFeed from './components/WordFeed.vue';
import FeedTopActions from './components/FeedTopActions.vue';
import { isColor } from './lib/utils.ts';

const store = useWordsStore();
const themeStore = useThemeStore();
const containerRef = ref<HTMLElement | null>(null);

const bgStyle = computed(() => {
  const bg = themeStore.currentTheme.background;
  if (isColor(bg)) {
    return { backgroundColor: bg };
  }
  return { backgroundImage: `url(${bg})` };
});

function triggerSaveFlash() {
  const container = containerRef.value;
  if (!container) return;

  const button = document.querySelector<HTMLElement>('[data-flash-target="collection"]');
  if (!button) return;

  const flash = document.createElement('div');
  flash.style.cssText = [
    'position: absolute',
    'inset: 0',
    'background: white',
    'z-index: 50',
    'pointer-events: none',
    'border-radius: var(--radius-md)',
  ].join(';');

  const containerRect = container.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();

  const originX = buttonRect.left + buttonRect.width / 2 - containerRect.left;
  const originY = buttonRect.top + buttonRect.height / 2 - containerRect.top;

  flash.style.transformOrigin = `${originX}px ${originY}px`;

  container.appendChild(flash);

  const anim = flash.animate(
    [
      { transform: 'scale(1)', opacity: 0 },
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1, offset: 0.25 },
      { transform: 'scale(0) rotate(10deg)', opacity: 0, offset: 1 },
    ],
    {
      duration: 800,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
    },
  );

  setTimeout(() => {
    button.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    );
  }, 400);

  anim.onfinish = () => {
    flash.remove();
  };
}

provide('triggerSaveFlash', triggerSaveFlash);
</script>

<template>
  <div
    ref="containerRef"
    class="h-dvh max-w-full mx-auto md:aspect-9/16 md:rounded-md overflow-hidden relative z-2 bg-black ring ring-white/10 shadow-[0_0_30px_15px_rgba(0,0,0,0.12)]"
  >
    <div class="h-full w-full relative z-2">
      <FeedTopActions />

      <WordFeed />
    </div>

    <div
      class="absolute z-1 inset-0 bg-cover bg-center scale-110 pointer-events-none"
      :style="bgStyle"
      :class="{
        'opacity-55': !isColor(themeStore.currentTheme.background),
      }"
    />
  </div>

  <div class="absolute z-1 inset-0 pointer-events-none overflow-hidden">
    <div
      class="absolute z-1 inset-0 opacity-45 blur-lg bg-[size:100%_100%] bg-center scale-110"
      :style="bgStyle"
    />
  </div>
</template>
