<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <button
    type="button"
    :class="twMerge(
      'rounded-full bg-black/60 p-2.5 text-white text-center font-medium backdrop-blur-md cursor-pointer transition-all hover:bg-black/85 active:scale-80 [&_svg]:pointer-events-none [-webkit-tap-highlight-color:transparent] inline-flex justify-center items-center gap-3',
      props.class,
    )"
  >
    <slot />
  </button>
</template>
