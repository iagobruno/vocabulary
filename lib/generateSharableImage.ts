import type { Word } from '../stores/feed';
import { useThemeStore } from '../stores/theme';

export interface RenderOptions {
  width?: number;
  height?: number;
}

export async function generateSharableImage(
  word: Word,
  { width = 1080, height = 1400 }: RenderOptions = {} as RenderOptions,
): Promise<Blob> {
  const { currentTheme: theme } = useThemeStore();
  /**
   * Customizations
   */
  const wordSize = width * 0.12;
  const meaningSize = wordSize * 0.35;
  const sentenceSize = wordSize * 0.29;
  const gapBetween = wordSize * 0.45;
  const backgroundDarkOpacity = 0.4; // 1 = 100%

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const isImage = theme.background.startsWith('/') || theme.background.startsWith('http');
  if (isImage) {
    const img = await loadImage(theme.background);
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let sx: number, sy: number, sw: number, sh: number;
    if (imgRatio > canvasRatio) {
      sh = img.height;
      sw = img.height * canvasRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = img.width / canvasRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  } else {
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);
  }

  if (backgroundDarkOpacity > 0) {
    ctx.fillStyle = `rgba(0,0,0,${backgroundDarkOpacity})`;
    ctx.fillRect(0, 0, width, height);
  }

  if (document.fonts) {
    await Promise.all([
      document.fonts.load(`normal 400 ${wordSize}px "Lora"`).catch(() => {}),
      document.fonts.load(`normal 400 ${meaningSize}px "Inter"`).catch(() => {}),
      document.fonts.load(`normal 400 ${sentenceSize}px "Inter"`).catch(() => {}),
    ]);
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const cx = width / 2;
  const totalHeight = wordSize + gapBetween + meaningSize * 1.5 + gapBetween + sentenceSize * 1.5;
  const startY = (height - totalHeight) / 2;

  ctx.font = `400 ${wordSize}px "Lora", serif`;
  const wordY = startY + wordSize / 2;
  ctx.fillText(word.word, cx, wordY);

  ctx.font = `400 ${meaningSize}px "Inter", sans-serif`;
  const meaningY = wordY + wordSize / 2 + gapBetween;
  const meaningH = wrapText(ctx, word.meaning, cx, meaningY, width * 0.8, meaningSize * 1.5);

  ctx.font = `300 ${sentenceSize}px "Inter", sans-serif`;
  ctx.globalAlpha = 0.7;
  const sentenceY = meaningY + meaningH + gapBetween * 0.6;
  wrapText(ctx, `"${word.sentence}"`, cx, sentenceY, width * 0.75, sentenceSize * 1.5);
  ctx.globalAlpha = 1;

  const icon = await loadImage(import.meta.env.BASE_URL + 'icon.png');
  const iconSize = width * 0.08;
  const iconX = width - iconSize - width * 0.03;
  const iconY = height - iconSize - height * 0.028;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(icon, iconX, iconY, iconSize, iconSize);
  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      },
      'image/jpeg',
      0.95,
    );
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);

  return currentY + lineHeight - y;
}

function getHeightByRatio(width: number, aspectRatio: number) {
  return width / aspectRatio;
}
