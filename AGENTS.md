# Vocabulary

Um web app para aprender novas palavras em formato de feed vertical similar ao do TikTok.

## Instruções

Use o pacote swiper para criar um slideshow vertical infinito em que cada slide contém uma palavra, sua definição, aplicação em uma frase, 3 sinônimos e 3 antônimos.
Crie um arquivo data/words.json com as palavras que vão aparecer no feed.
Use o modo virtual do swiper para evitar poluir o DOM e melhorar o desempenho de renderização, pois o slideshow pode ser infinito.
Use o Pinia para criar um store feed.ts para carregar de forma aleatória as palavras quando a página carregar (filtrando as palavras já vistas).
Ao visualizar um slide, marque a palavra como vista para evitar mostrar ela novamente para o usuário.
Permita navegação entre os slides usando o teclado e o mouse wheel.
Na parte inferior de cada slide, mostre um ícone centralizado horizontalmente para salvar a palavra em uma coleção pessoal. De início use o localStorage para armazenar as palavras vistas e salvas.
Na parte superior da tela (fixed top-0 w-full) mostre:
  Um botão redondo com o icone FlFilledPaintBrushSparkle do lado esquerdo para mudar o tema do app que quando clicado abre um modal sheet com uma grade de 3 colunas com os temas (cada item com aspect-9/16 rounded-md e um "Aa" centralizado);
  Um contador de palavras vistas centralizado (com text-xs);
  Um botão redondo com o icone BsCollection do lado direito que ao clicado abre um modal sheet com as palavras salvas em formato de grade de duas colunas.
Crie um componente ModalSheet.vue reutilizável para os modais. Esse modal deve ser parecido com o do iOS, com bordas arredondadas nos cantos de cima e animação de entrada vindo das parte de baixo da tela.

## Stack

- Vite
- Vue 3
- Tailwind CSS
- TypeScript
- Pinia
- Bun
- Swiper

## Code Conventions

- Sempre use TypeScript na tag script (<script setup lang="ts">).
- Em components Vue, a tag script vem primeiro, em seguida a tag template e por último a tag style.
- Use Tailwind CSS para estilização. Use a Tag style (scoped) somente quando necessário.
- Para estilização condicional, use :class="{ 'class': boolean }".
- Quando for criar um elemento quadrado, use a classe size-* ao invés de w-* e h-*.
- Use a classe opacity-* ao invés de *-gray-* para elementos 

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
