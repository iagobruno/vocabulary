<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { BsCheckLg, BsSnow } from '@kalimahapps/vue-icons/bs';
import { CgClose } from '@kalimahapps/vue-icons/cg';
import ModalSheet from './ModalSheet.vue';
import Button from './Button.vue';
import { useStreakStore } from '../stores/streak.ts';

const streakStore = useStreakStore();
const show = ref(false);

const todayStr = computed(() => new Intl.DateTimeFormat('sv-SE').format(new Date()));

onMounted(() => {
  const result = streakStore.recordVisit();
  if (result === 'new_day' || result === 'broken_streak') {
    show.value = true;
  }
});

async function close() {
  if (streakStore.broken) {
    streakStore.dismissBroken();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  show.value = false;
}
</script>

<template>
  <ModalSheet :show="show" @close="close" hide-close>
    <div class="flex flex-col items-center justify-between px-8 pt-8 min-h-[55dvh]">
      <div class="flex flex-col items-center justify-center flex-1 gap-3">
        <h3 class="text-[1.04rem] font-medium mb-1">Sequência</h3>
        <template v-if="streakStore.broken">
          <span class="text-7xl mb-1">😢</span>
          <p class="text-gray-300 text-center leading-relaxed">
            Você quebrou sua<br />sequência de
            <span class="font-semibold">{{ streakStore.brokenStreakCount }} dias</span>
          </p>
          <p class="text-gray-500 text-xs text-center leading-relaxed mt-1">
            Comece uma nova sequência hoje.
          </p>
        </template>
        <div v-else class="text-center">
          <div class="relative">
            <!-- <AnFilledFire class="size-26 text-yellow-400" /> -->
            <picture>
              <source
                srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp"
                type="image/webp"
              />
              <img
                src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.gif"
                class="size-46"
              />
            </picture>
            <span
              class="text-[3.2rem] font-bold text-red-950 absolute top-7/10 left-2/4 -translate-2/4 mt-2"
              >{{ streakStore.streakCount }}</span
            >
          </div>
          <p class="text-xl font-medium mt-1">dias seguidos</p>
          <p class="text-gray-400 text-xs font-medium mt-1.5">Continue firme!</p>
        </div>
      </div>

      <div class="w-full mt-10 bg-white/4 rounded-lg pb-4 pt-7.5 px-4">
        <div class="flex items-center">
          <template v-for="(day, i) in streakStore.weekDays" :key="day.date">
            <div class="shrink-0 grow-0 basis-8 relative flex justify-center">
              <span
                class="absolute -top-[20px] text-[.62rem] tracking-wide whitespace-nowrap"
                :class="day.date === todayStr ? 'text-white font-medium' : 'opacity-40'"
              >
                {{ day.label }}
              </span>
              <div
                class="size-8 rounded-full flex items-center justify-center"
                :class="{
                  'bg-yellow-400': day.status === 'opened',
                  'bg-sky-600': day.status === 'skipped',
                  'bg-red-500': day.status === 'broken',
                  'bg-zinc-700': day.status !== 'opened' && day.status !== 'skipped' && day.status !== 'broken'
                }"
              >
                <BsCheckLg v-if="day.status === 'opened'" class="text-black size-5" />
                <BsSnow v-else-if="day.status === 'skipped'" class="text-white size-5" />
                <CgClose v-else-if="day.status === 'broken'" class="text-white size-4" />
              </div>
            </div>
            <div
              v-if="i < streakStore.weekDays.length - 1"
              class="flex-1 h-[3px] rounded-full"
              :class="{
                'bg-yellow-400': day.status === 'opened',
                'bg-sky-600': day.status === 'skipped',
                'bg-red-500': day.status === 'broken',
                'bg-zinc-700': day.status !== 'opened' && day.status !== 'skipped' && day.status !== 'broken'
              }"
            />
          </template>
        </div>
      </div>

      <p class="text-[.72rem] opacity-40 mt-3 flex justify-center items-center gap-1.5">
        <BsSnow class="size-[1.2em] -mt-0.5" />
        Você tem um congelamento disponível
      </p>

      <Button @click="close" class="mt-7 mb-6 w-full bg-white! text-black py-2.5">
        {{ streakStore.broken ? 'Começar nova sequência' : 'Continuar' }}
      </Button>
    </div>
  </ModalSheet>
</template>
