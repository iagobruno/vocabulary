<script setup lang="ts">
import { ref, provide } from 'vue';
import { FaHandsClapping } from '@kalimahapps/vue-icons/fa';
import { useWordsStore } from './stores/feed.ts';
import WordFeed from './components/WordFeed.vue';
import FeedTopActions from './components/FeedTopActions.vue';

const store = useWordsStore();
const containerRef = ref<HTMLElement | null>(null);

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
      duration: 700,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
    },
  );

  setTimeout(() => {
    flash.remove();
    button.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
      { duration: 600, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    );
  }, 400);
}

provide('triggerSaveFlash', triggerSaveFlash);
</script>

<template>
  <div
    ref="containerRef"
    class="h-dvh max-w-full md:aspect-9/16 mx-auto rounded-md overflow-hidden relative bg-black ring ring-white/5 shadow-[0_0_30px_10px_rgba(255,255,255,0.1)]"
  >
    <FeedTopActions />

    <div
      v-if="store.remainingWords.length === 0"
      class="flex h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <FaHandsClapping class="mb-6 size-20 text-yellow-400" />
      <p class="text-2xl font-bold text-white">Você viu todas as palavras!</p>
      <p class="mt-2 text-gray-400">Volta outro dia para aprender mais 👏</p>
    </div>
    <WordFeed v-else />
  </div>
</template>
