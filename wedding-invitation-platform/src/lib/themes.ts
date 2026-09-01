import { ThemeName } from './types';

/**
 * Every theme is expressed purely as CSS custom properties.
 * Content and layout never change between themes — only the
 * visual system does. This keeps the "one codebase, many themes"
 * promise honest: swapping a theme is swapping a token set.
 */
export interface ThemeTokens {
  label: string;
  '--color-bg': string;
  '--color-bg-elevated': string;
  '--color-text': string;
  '--color-text-muted': string;
  '--color-accent': string;
  '--color-accent-soft': string;
  '--color-hairline': string;
}

export const THEMES: Record<ThemeName, ThemeTokens> = {
  champagne: {
    label: 'Champagne',
    '--color-bg': '#0d0d0e',
    '--color-bg-elevated': '#151516',
    '--color-text': '#f7f3ec',
    '--color-text-muted': 'rgba(247, 243, 236, 0.62)',
    '--color-accent': '#c9a875',
    '--color-accent-soft': 'rgba(201, 168, 117, 0.16)',
    '--color-hairline': 'rgba(247, 243, 236, 0.12)',
  },
  emerald: {
    label: 'Emerald Luxury',
    '--color-bg': '#0a1210',
    '--color-bg-elevated': '#101b18',
    '--color-text': '#f2f6f2',
    '--color-text-muted': 'rgba(242, 246, 242, 0.6)',
    '--color-accent': '#5e8f76',
    '--color-accent-soft': 'rgba(94, 143, 118, 0.18)',
    '--color-hairline': 'rgba(242, 246, 242, 0.12)',
  },
  burgundy: {
    label: 'Burgundy Romance',
    '--color-bg': '#140a0c',
    '--color-bg-elevated': '#1d1012',
    '--color-text': '#f6ece9',
    '--color-text-muted': 'rgba(246, 236, 233, 0.6)',
    '--color-accent': '#9c4b4f',
    '--color-accent-soft': 'rgba(156, 75, 79, 0.18)',
    '--color-hairline': 'rgba(246, 236, 233, 0.12)',
  },
  midnight: {
    label: 'Cinematic Dark',
    '--color-bg': '#07070b',
    '--color-bg-elevated': '#0e0e14',
    '--color-text': '#eef0f7',
    '--color-text-muted': 'rgba(238, 240, 247, 0.58)',
    '--color-accent': '#8890b5',
    '--color-accent-soft': 'rgba(136, 144, 181, 0.16)',
    '--color-hairline': 'rgba(238, 240, 247, 0.1)',
  },
  ivory: {
    label: 'Ivory Editorial',
    '--color-bg': '#f7f3ec',
    '--color-bg-elevated': '#efe9de',
    '--color-text': '#171512',
    '--color-text-muted': 'rgba(23, 21, 18, 0.6)',
    '--color-accent': '#a9834e',
    '--color-accent-soft': 'rgba(169, 131, 78, 0.14)',
    '--color-hairline': 'rgba(23, 21, 18, 0.12)',
  },
  rose: {
    label: 'Modern Colorful',
    '--color-bg': '#120c10',
    '--color-bg-elevated': '#1a1216',
    '--color-text': '#f8eef0',
    '--color-text-muted': 'rgba(248, 238, 240, 0.6)',
    '--color-accent': '#c17a8a',
    '--color-accent-soft': 'rgba(193, 122, 138, 0.18)',
    '--color-hairline': 'rgba(248, 238, 240, 0.12)',
  },
};

export function themeStyle(theme: ThemeName, accentOverride?: string): React.CSSProperties {
  const tokens = THEMES[theme] ?? THEMES.champagne;
  const style: Record<string, string> = { ...tokens };
  delete (style as any).label;
  if (accentOverride) {
    style['--color-accent'] = accentOverride;
  }
  return style as React.CSSProperties;
}
