import type { CSSProperties } from 'react';
import { alpha, createTheme } from '@mui/material/styles';

type PhasePalette = {
  menstrual: string;
  follicular: string;
  fertile: string;
  luteal: string;
};

type SurfacePalette = {
  canvas: string;
  canvasSubtle: string;
  raised: string;
  overlay: string;
  sunken: string;
  accent: string;
  accentStrong: string;
  selected: string;
  selectedStrong: string;
  progressTrack: string;
};

type BorderPalette = {
  subtle: string;
  default: string;
  strong: string;
  focus: string;
};

type StatusPalette = {
  warningSurface: string;
  warningText: string;
};

type AppRadiusTokens = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  card: number;
  pill: number;
};

type AppShadowTokens = {
  soft: string;
  card: string;
  floating: string;
  modal: string;
  icon: string;
};

type AppTypographyTokens = {
  eyebrow: CSSProperties;
  sectionLabel: CSSProperties;
  sectionValue: CSSProperties;
  helper: CSSProperties;
  microLabel: CSSProperties;
  metricValue: CSSProperties;
  titleMd: CSSProperties;
};

declare module '@mui/material/styles' {
  interface Palette {
    phase: PhasePalette;
    surface: SurfacePalette;
    border: BorderPalette;
    status: StatusPalette;
  }

  interface PaletteOptions {
    phase?: PhasePalette;
    surface?: SurfacePalette;
    border?: BorderPalette;
    status?: StatusPalette;
  }

  interface Theme {
    appTokens: {
      radius: AppRadiusTokens;
      shadow: AppShadowTokens;
      typography: AppTypographyTokens;
    };
  }

  interface ThemeOptions {
    appTokens?: {
      radius?: Partial<AppRadiusTokens>;
      shadow?: Partial<AppShadowTokens>;
      typography?: Partial<AppTypographyTokens>;
    };
  }
}

const rose = {
  primary: '#6c5a61',
  primaryContainer: '#f4dce4',
  secondary: '#566259',
  secondaryContainer: '#d9e6da',
  tertiary: '#53616a',
  tertiaryContainer: '#e1f0fb',
  background: '#fff8f8',
  backgroundSoft: '#fffdfd',
  paper: '#ffffff',
  surfaceLow: '#fff0f4',
  surface: '#fbe9ef',
  surfaceHigh: '#f6e4e9',
  text: '#3b2f34',
  textMuted: '#6a5b61',
  border: '#c0adb3',
  borderSubtle: '#e8dde1',
  error: '#a8364b',
  warningSurface: '#f8efe2',
  warningText: '#7b5d4b',
  phaseMenstrual: '#F08080',
  phaseFollicular: '#F8C8C8',
  phaseFertile: '#FF8A65',
  phaseLuteal: '#C9B8E0',
  primaryContrast: '#fff7f8',
  secondaryContrast: '#effcf0',
};

const baseTheme = createTheme();
const softShadows = baseTheme.shadows.map((shadow, index) => {
  if (index === 0) {
    return shadow;
  }

  return shadow
    .replaceAll('rgba(0,0,0,0.2)', 'rgba(0,0,0,0.08)')
    .replaceAll('rgba(0,0,0,0.14)', 'rgba(0,0,0,0.05)')
    .replaceAll('rgba(0,0,0,0.12)', 'rgba(0,0,0,0.04)');
}) as typeof baseTheme.shadows;

const appTokens = {
  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    card: 28,
    pill: 999,
  },
  shadow: {
    soft: `0 10px 20px ${alpha(rose.primary, 0.12)}`,
    card: `0 12px 24px ${alpha(rose.primary, 0.06)}`,
    floating: `0 14px 32px ${alpha(rose.primary, 0.1)}`,
    modal: `0 24px 48px ${alpha(rose.primary, 0.08)}`,
    icon: `0 18px 36px ${alpha(rose.primary, 0.14)}`,
  },
  typography: {
    eyebrow: {
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.16em',
      lineHeight: 1,
      textTransform: 'uppercase',
    },
    sectionLabel: {
      fontSize: '0.8125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    sectionValue: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    helper: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
    microLabel: {
      fontSize: '0.625rem',
      fontWeight: 700,
      letterSpacing: '0.08em',
      lineHeight: 1.2,
      textTransform: 'uppercase',
    },
    metricValue: {
      fontSize: '1.375rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    titleMd: {
      fontSize: '1.125rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
  },
} satisfies {
  radius: AppRadiusTokens;
  shadow: AppShadowTokens;
  typography: AppTypographyTokens;
};

export const appTheme = createTheme({
  shadows: softShadows,
  appTokens,
  palette: {
    mode: 'light',
    primary: {
      main: rose.primary,
      light: rose.primaryContainer,
      contrastText: rose.primaryContrast,
    },
    secondary: {
      main: rose.secondary,
      light: rose.secondaryContainer,
      contrastText: rose.secondaryContrast,
    },
    info: {
      main: rose.tertiary,
      light: rose.tertiaryContainer,
    },
    error: {
      main: rose.error,
    },
    background: {
      default: rose.background,
      paper: rose.paper,
    },
    text: {
      primary: rose.text,
      secondary: rose.textMuted,
    },
    divider: alpha(rose.border, 0.28),
    phase: {
      menstrual: rose.phaseMenstrual,
      follicular: rose.phaseFollicular,
      fertile: rose.phaseFertile,
      luteal: rose.phaseLuteal,
    },
    surface: {
      canvas: rose.background,
      canvasSubtle: rose.backgroundSoft,
      raised: alpha(rose.paper, 0.92),
      overlay: alpha(rose.paper, 0.98),
      sunken: rose.surfaceLow,
      accent: alpha(rose.primaryContainer, 0.72),
      accentStrong: rose.primaryContainer,
      selected: alpha(rose.primaryContainer, 0.42),
      selectedStrong: rose.primaryContainer,
      progressTrack: 'rgba(0, 0, 0, 0.06)',
    },
    border: {
      subtle: rose.borderSubtle,
      default: rose.border,
      strong: alpha(rose.border, 0.82),
      focus: rose.primary,
    },
    status: {
      warningSurface: rose.warningSurface,
      warningText: rose.warningText,
    },
  },
  shape: {
    borderRadius: 1,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontSize: 'clamp(2.4rem, 6vw, 3.35rem)',
      fontWeight: 700,
      letterSpacing: '-0.04em',
      lineHeight: 1.02,
    },
    h2: {
      fontSize: 'clamp(2rem, 5vw, 2.75rem)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.08,
    },
    h3: {
      fontSize: '1.45rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.12,
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.05rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    body1: {
      fontSize: '0.98rem',
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.92rem',
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: '0.88rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    overline: {
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    caption: {
      fontSize: '0.78rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: rose.background,
          backgroundImage:
            `radial-gradient(circle at top, ${alpha(rose.primaryContainer, 0.9)} 0%, transparent 38%), ` +
            `linear-gradient(180deg, ${rose.background} 0%, ${rose.backgroundSoft} 100%)`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.pill,
          minWidth: 120,
          paddingInline: 20,
        },
        sizeMedium: {
          minHeight: 48,
        },
        contained: {
          background: `linear-gradient(135deg, ${rose.primary} 0%, ${alpha(rose.primary, 0.72)} 100%)`,
          boxShadow: appTokens.shadow.soft,
          '&.Mui-disabled': {
            background: `linear-gradient(135deg, ${rose.primary} 0%, ${alpha(rose.primary, 0.72)} 100%)`,
            color: alpha(rose.primaryContrast, 0.72),
            opacity: 0.56,
          },
        },
        outlined: {
          borderColor: alpha(rose.border, 0.5),
          backgroundColor: alpha(rose.paper, 0.7),
          color: rose.textMuted,
        },
        text: {
          color: rose.primary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: appTokens.radius.xxl,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.card,
          backgroundColor: alpha(rose.paper, 0.94),
          boxShadow: appTokens.shadow.card,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: appTokens.radius.card,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paperAnchorBottom: {
          borderTopLeftRadius: appTokens.radius.xl,
          borderTopRightRadius: appTokens.radius.xl,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.lg,
          backgroundColor: alpha(rose.surfaceLow, 0.96),
          '& fieldset': {
            borderColor: alpha(rose.border, 0.2),
          },
          '&:hover fieldset': {
            borderColor: alpha(rose.primary, 0.34),
          },
          '&.Mui-focused fieldset': {
            borderWidth: 1,
            borderColor: alpha(rose.primary, 0.7),
          },
        },
        input: {
          paddingBlock: 14,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
            margin: 0,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: alpha(rose.textMuted, 0.82),
          fontWeight: 400,
          '&.MuiInputLabel-outlined.MuiInputLabel-sizeSmall:not(.MuiInputLabel-shrink)': {
            transform: 'translate(14px, 14px) scale(1)',
          },
          '&.Mui-focused': {
            color: alpha(rose.textMuted, 0.82),
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: rose.textMuted,
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
          marginRight: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.pill,
          backgroundColor: alpha(rose.primaryContainer, 0.85),
          color: rose.primary,
          fontWeight: 600,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.xxl,
          backgroundColor: alpha(rose.paper, 0.88),
          backdropFilter: 'blur(18px)',
          boxShadow: `0 10px 22px ${alpha(rose.primary, 0.08)}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: rose.textMuted,
          '&.Mui-selected': {
            color: rose.primary,
          },
        },
        label: {
          fontSize: '0.72rem',
          fontWeight: 700,
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 8,
          padding: 6,
          borderRadius: appTokens.radius.pill,
          backgroundColor: alpha(rose.surface, 0.92),
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: appTokens.radius.pill,
          paddingInline: 14,
          color: rose.textMuted,
          '&.Mui-selected': {
            color: rose.paper,
            background: `linear-gradient(135deg, ${rose.primary} 0%, ${alpha(rose.primary, 0.82)} 100%)`,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: rose.paper,
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: rose.primary,
            opacity: 1,
          },
        },
        track: {
          backgroundColor: alpha(rose.border, 0.5),
          opacity: 1,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: alpha(rose.primary, 0.5),
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: alpha(rose.primary, 0.5),
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: rose.primary,
        },
        rail: {
          backgroundColor: alpha(rose.primary, 0.18),
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: appTokens.radius.pill,
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: alpha(rose.border, 0.55),
          '&.Mui-active': {
            color: rose.primary,
          },
          '&.Mui-completed': {
            color: rose.secondary,
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: alpha(rose.border, 0.42),
        },
      },
    },
  },
});
