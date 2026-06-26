<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { FaGraduationCap as PracticeIcon } from '@kalimahapps/vue-icons/fa';
import { useWordsStore, type Word } from '../stores/feed';
import ModalSheet from './ModalSheet.vue';
import Button from './Button.vue';
import wordsData from '../data/words.json';
import { shuffle } from '../lib/utils';
const allWords = wordsData as Word[];

const props = defineProps<{
  show: boolean;
}>();
const emit = defineEmits<{ close: [] }>();

const store = useWordsStore();

interface Question {
  word: string;
  options: { text: string; correct: boolean }[];
}

const state = reactive({
  started: false,
  finished: false,
  questions: [] as Question[],
  insufficientData: false,
  correctCount: 0,
  currentIndex: 0,
  selectedIndex: null as number | null,
});

const currentQuestion = computed(() => state.questions[state.currentIndex]);
const scorePercent = computed(() => {
  if (state.questions.length === 0) return 0;
  const score = Math.round((state.correctCount / state.questions.length) * 100);
  return Math.max(0, Math.min(score, 100));
});

function startPractice() {
  generateQuestions();
  state.started = true;
}

function generateQuestions() {
  // 10 últimas palavras vistas no feed
  const lastSeenWords = Array.from(store.viewedWords).slice(-10);

  const allWordsMap = new Map(allWords.map((w) => [w.word, w]));
  const words = lastSeenWords.map((n) => allWordsMap.get(n)).filter(Boolean) as Word[];

  if (words.length < 5) {
    // Só permite praticar se houver pelo menos 5 palavras vistas
    state.insufficientData = true;
    state.questions = [];
    state.currentIndex = 0;
    state.selectedIndex = null;
    return;
  }

  const selected = shuffle(words);

  // Gera as perguntas com 1 opção correta + 2 aleatórias de outras palavras
  state.questions = selected.map((w) => {
    // Sorteia 2 significados errados diferentes (de outras palavras quaisquer)
    const wrongMeanings: string[] = [];
    while (wrongMeanings.length < 2) {
      const random = allWords[Math.floor(Math.random() * allWords.length)];
      if (random.word !== w.word && !wrongMeanings.includes(random.meaning)) {
        wrongMeanings.push(random.meaning);
      }
    }

    // Monta as 3 opções e embaralha para não dar pistas visuais
    const options = shuffle([
      { text: w.meaning, correct: true },
      { text: wrongMeanings[0], correct: false },
      { text: wrongMeanings[1], correct: false },
    ]);
    return { word: w.word, options };
  });

  state.currentIndex = 0;
  state.selectedIndex = null;
  state.correctCount = 0;
  state.finished = false;
  state.insufficientData = false;
}

watch(
  () => props.show,
  (isOpen) => {
    if (isOpen) {
      state.started = false;
      state.finished = false;
      state.insufficientData = false;
      state.questions = [];
      state.currentIndex = 0;
      state.selectedIndex = null;
      state.correctCount = 0;
    }
  },
);

function selectOption(index: number) {
  if (state.selectedIndex !== null) return;
  state.selectedIndex = index;

  if (currentQuestion.value.options[index].correct) {
    state.correctCount++;
  }

  setTimeout(() => {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex++;
      state.selectedIndex = null;
    } else {
      state.finished = true;
    }
  }, 1200);
}

function restart() {
  generateQuestions();
}
</script>

<template>
  <ModalSheet :show="show" @close="emit('close')" modalClass="h-[85dvh]! overflow-x-hidden">
    <div
      v-if="!state.started"
      class="px-6 text-center h-full flex flex-col items-center justify-center"
    >
      <PracticeIcon class="size-16 mb-6 text-white/80" />
      <h2 class="text-4xl font-lora font-medium mb-4">Hora de praticar</h2>
      <p class="text-gray-300 text-sm/6 max-w-xs">
        Reveja as 10 palavras que você acabou de ver para fixá-las na memória.
      </p>
      <Button @click="startPractice" class="mt-20 w-full bg-white! text-black py-3 max-w-[90%]">
        Começar
      </Button>
    </div>

    <div v-else-if="state.insufficientData" class="px-10 py-50 text-center opacity-70 text-sm">
      Você precisa ver pelo menos 5 palavras antes de praticar.
    </div>

    <div
      v-else-if="state.finished"
      class="px-6 text-center h-full flex flex-col items-center justify-center"
    >
      <p class="text-white font-medium mb-2" :class="scorePercent >= 70 ? 'text-3xl' : 'text-xl'">
        {{ scorePercent >= 70 ? 'Parabéns!' : 'Continue praticando...' }}
      </p>
      <p class="text-gray-300 text-sm mt-8 mb-2">
        Você acertou {{ state.correctCount }} de {{ state.questions.length }}
      </p>

      <div
        class="text-7xl font-bold"
        :class="scorePercent >= 70 ? 'text-green-400' : scorePercent >= 50 ? 'text-yellow-400' : 'text-red-400'"
      >
        {{ scorePercent }}%
      </div>

      <div v-if="scorePercent < 70" class="mt-20 text-center text-xs">
        <p class="text-gray-400/90 text-xs mb-4">
          Você precisa de pelo menos <br />70% para passar.
        </p>
        <Button @click="restart" class="bg-white! text-black text-lg py-3 px-8!">
          Recomeçar
        </Button>
      </div>

      <Button v-else @click="emit('close')" class="mt-20 bg-white! text-black py-3 px-8!">
        Continuar aprendendo
      </Button>
    </div>

    <div v-else-if="currentQuestion">
      <h3 class="text-[1.06rem] font-medium text-center opacity-90 pt-6">Hora de praticar</h3>
      <Transition name="slide" mode="out-in">
        <div :key="state.currentIndex" class="px-6 pt-14">
          <div class="text-sm text-gray-400 mb-2 text-center">
            {{ state.currentIndex + 1 }}
            / {{ state.questions.length }}
          </div>

          <p class="opacity-80 text-center mb-3">O que significa:</p>

          <p class="text-4xl font-lora text-center mb-14">{{ currentQuestion.word }}</p>

          <div class="space-y-4">
            <button
              v-for="(opt, i) in currentQuestion.options"
              :key="i"
              type="button"
              class="w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer"
              :class="
              state.selectedIndex !== null
                ? opt.correct
                  ? 'border-green-500 bg-green-500/20'
                  : i === state.selectedIndex
                    ? 'border-red-500 bg-red-500/20 opacity-50 transition-all duration-1000'
                    : 'border-white/10 opacity-50'
                : 'border-white/20 hover:border-white/40'
            "
              @click="selectOption(i)"
            >
              {{ opt.text }}
            </button>
          </div>

          <div
            v-if="state.selectedIndex !== null"
            class="mt-4 text-center text-sm font-medium"
            :class="
            currentQuestion.options[state.selectedIndex].correct
              ? 'text-green-400'
              : 'text-red-400'
          "
          >
            {{ currentQuestion.options[state.selectedIndex].correct ? 'Correto!' : 'Errado!' }}
          </div>
        </div>
      </Transition>
    </div>
  </ModalSheet>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 200ms ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
