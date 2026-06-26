<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ModalSheet from './ModalSheet.vue';
import Button from './Button.vue';
import { MdRoundInstallMobile as InstallIcon } from '@kalimahapps/vue-icons/md';

const show = ref(false);
const showInstallBtn = ref(false);
onMounted(async () => {
  window.addEventListener(
    'load',
    function () {
      showInstallBtn.value = 'AddToHomeScreen' in window;
    },
    { once: true },
  );
  show.value = !localStorage.getItem('vocabulary_welcomed');
});

function close() {
  show.value = false;
  localStorage.setItem('vocabulary_welcomed', 'true');
}

function install() {
  // @ts-ignore
  if (!window.AddToHomeScreen) return;

  // @ts-ignore
  const AddToHomeScreenInstance = window.AddToHomeScreen({
    appName: 'Vocabulary',
    appNameDisplay: 'standalone',
    appIconUrl: import.meta.env.BASE_URL + 'icon.png',
    assetUrl: 'https://cdn.jsdelivr.net/npm/pwa-add-to-homescreen@4.1.0/dist/assets/img/',
    maxModalDisplayCount: -1,
    displayOptions: { showMobile: true, showDesktop: true },
    allowClose: true,
    showArrow: true,
  });
  AddToHomeScreenInstance.show('pt');
}
</script>

<template>
  <ModalSheet :show="show" @close="close" hide-close>
    <div class="flex flex-col items-center justify-center px-8 pt-2 h-[80dvh] relative z-2">
      <div class="flex flex-col items-center justify-center flex-1">
        <img src="/icon.png" alt="Vocabulary" class="size-24 mb-8 rounded-2xl" />

        <p class="text-sm text-gray-400 mb-0.5">Bem vindo ao</p>
        <h1 class="text-4xl font-lora font-bold mb-5">Vocabulary</h1>
        <p class="text-gray-300 text-[.92rem]/5.5 text-center max-w-xs">
          Aprenda novas palavras <br />
          todos os dias.
        </p>
      </div>

      <div class="mt-auto mb-8 space-y-4 w-full">
        <template v-if="showInstallBtn">
          <div class="text-center text-[.7rem] opacity-70">
            ⚡️ Este app funciona sem conexão com a internet!
          </div>

          <Button
            @click="install"
            class="w-full bg-black text-sky-500 py-3 border border-white/10 font-normal text-[.9rem]"
          >
            <InstallIcon class="size-[1.3em] -mr-0.5" />
            Adicionar na tela de início
          </Button>
        </template>
        <Button @click="close" class="w-full bg-white! text-black py-2.5"> Começar </Button>
      </div>
    </div>

    <div
      class="bg-sky-500 rounded-full blur-3xl w-full aspect-square z-1 absolute top-0 left-2/4 -translate-2/4 pointer-events-none transition-opacity duration-1000 opacity-0"
      :class="show ? 'opacity-20!' : ''"
    />
  </ModalSheet>
</template>
