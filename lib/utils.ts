export function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function isColor(bg: string): boolean {
  return bg.startsWith('#') || bg.startsWith('rgb') || bg.startsWith('hsl');
}

export function afterLast(char: string, value: string) {
  const index = value.lastIndexOf(char);

  if (index === -1) {
    return value;
  }

  return value.slice(index + char.length);
}
