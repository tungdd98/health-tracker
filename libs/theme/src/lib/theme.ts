import { alpha, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    phase: {
      menstrual: string;
      follicular: string;
      fertile: string;
      luteal: string;
    };
  }

  interface PaletteOptions {
    phase?: {
      menstrual: string;
      follicular: string;
      fertile: string;
      luteal: string;
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
  paper: '#ffffff',
  surfaceLow: '#fff0f4',
  surface: '#fbe9ef',
  surfaceHigh: '#f6e4e9',
  text: '#3b2f34',
  textMuted: '#6a5b61',
  border: '#c0adb3',
  error: '#a8364b',
  phaseMenstrual: '#F08080',
  phaseFollicular: '#F8C8C8',
  phaseFertile: '#FF8A65',
  phaseLuteal: '#C9B8E0',
};

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: rose.primary,
      light: rose.primaryContainer,
      contrastText: '#fff7f8',
    },
    secondary: {
      main: rose.secondary,
      light: rose.secondaryContainer,
      contrastText: '#effcf0',
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
  },
  shape: {
    borderRadius: 24,
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
            `linear-gradient(180deg, ${rose.background} 0%, #fffdfd 100%)`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 48,
          paddingInline: 20,
        },
        contained: {
          background: `linear-gradient(135deg, ${rose.primary} 0%, ${alpha(rose.primary, 0.72)} 100%)`,
          boxShadow: `0 18px 36px ${alpha(rose.primary, 0.18)}`,
        },
        outlined: {
          borderColor: alpha(rose.border, 0.36),
          backgroundColor: alpha(rose.paper, 0.7),
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
          borderRadius: 28,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          backgroundColor: alpha(rose.paper, 0.94),
          boxShadow: `0 24px 48px ${alpha(rose.primary, 0.08)}`,
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
          borderRadius: 20,
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
    MuiInputLabel: {
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
          borderRadius: 999,
          backgroundColor: alpha(rose.primaryContainer, 0.85),
          color: rose.primary,
          fontWeight: 600,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderRadius: 28,
          backgroundColor: alpha(rose.paper, 0.88),
          backdropFilter: 'blur(18px)',
          boxShadow: `0 18px 40px ${alpha(rose.primary, 0.12)}`,
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
          borderRadius: 999,
          backgroundColor: alpha(rose.surface, 0.92),
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 999,
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
