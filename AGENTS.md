# Vocabulary

Um web app para aprender novas palavras em formato de feed vertical similar ao do TikTok.

## Stack

- Vite
- Vue 3
- Tailwind CSS
- TypeScript
- Pinia
- Bun
- Swiper

## Code Conventions

- Use `PascalCase` para componentes Vue.
- Sem use TypeScript na tag script (<script setup lang="ts">).
- Em components Vue, a tag script vem primeiro, em seguida a tag template e por último a tag style.
- Use Tailwind CSS para estilização. Use a Tag style (scoped) somente quando necessário.

### Icones

Todos os icones devem ser importados do pacote `@kalimahapps/vue-icons.

Exemplo de uso:

```vue
<script setup lang="ts">
import { BsCollection as CollectionIcon } from '@kalimahapps/vue-icons'
import Button from './Button.vue';
</script>
<template>

<Button @click="action">
  <CollectionIcon class="size-4.5" />
</Button>
</template>
