import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';

export type VisitResult = 'first_visit' | 'new_day' | 'broken_streak' | 'already_recorded';

export interface WeekDay {
  label: string;
  date: string;
  status: 'opened' | 'skipped' | 'future' | 'broken' | 'none';
}

export const useStreakStore = defineStore('streak', () => {
  const dates = useStorage<string[]>('streak_dates', []);
  const broken = ref(false);
  const brokenStreakCount = ref(0);

  const streakCount = computed(() => calculateStreak([...dates.value].sort()));

  const weekDays = computed<WeekDay[]>(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    const todayStr = formatDate(today);

    const sorted = [...dates.value].sort();
    const streakEnd = sorted.length > 0 ? sorted[sorted.length - 1] : null;
    let streakStart: string | null = null;
    if (streakEnd) {
      const end = parseDate(streakEnd);
      const start = new Date(end);
      start.setDate(end.getDate() - streakCount.value + 1);
      streakStart = formatDate(start);
    }

    let brokenDay: string | null = null;
    if (broken.value && sorted.length >= 2) {
      const lastBeforeToday = sorted[sorted.length - 2];
      const dayAfter = parseDate(lastBeforeToday);
      dayAfter.setDate(dayAfter.getDate() + 1);
      brokenDay = formatDate(dayAfter);
    }

    const days: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const dateStr = formatDate(date);

      let status: WeekDay['status'];
      if (dates.value.includes(dateStr)) {
        status = 'opened';
      } else if (dateStr === brokenDay) {
        status = 'broken';
      } else if (dateStr > todayStr) {
        status = 'future';
      } else if (streakStart && streakEnd && dateStr >= streakStart && dateStr <= streakEnd) {
        status = 'skipped';
      } else {
        status = 'none';
      }

      days.push({ label: DAY_NAMES[i], date: dateStr, status });
    }

    return days;
  });

  function recordVisit(): VisitResult {
    const today = formatDate(new Date());
    if (dates.value.includes(today)) return 'already_recorded';

    const wasEmpty = dates.value.length === 0;

    if (!wasEmpty) {
      const sorted = [...dates.value].sort();
      const lastDate = sorted[sorted.length - 1];
      const diff = daysBetween(lastDate, today);

      if (diff > 2) {
        broken.value = true;
        brokenStreakCount.value = calculateStreak(sorted);
      }
    }

    dates.value = [...dates.value, today];

    if (wasEmpty) return 'first_visit';
    if (broken.value) return 'broken_streak';
    return 'new_day';
  }

  function dismissBroken() {
    broken.value = false;
    brokenStreakCount.value = 0;
    dates.value = [];
    recordVisit();
  }

  return {
    dates,
    streakCount,
    broken,
    brokenStreakCount,
    weekDays,
    recordVisit,
    dismissBroken,
  };
});

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function daysBetween(a: string, b: string): number {
  const da = parseDate(a);
  const db = parseDate(b);
  return Math.round(Math.abs(db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

function calculateStreak(sorted: string[]): number {
  if (sorted.length === 0) return 0;
  let count = 1;
  let usedSkip = false;
  for (let i = sorted.length - 1; i >= 1; i--) {
    const diff = daysBetween(sorted[i - 1], sorted[i]);
    if (diff === 1) {
      count++;
      usedSkip = false;
    } else if (diff === 2 && !usedSkip) {
      count++;
      usedSkip = true;
    } else {
      break;
    }
  }
  return count;
}
