import { alpha, createTheme } from "@mui/material/styles";

// Site palette
// Rust: #bb3e00, Amber: #f7ad45, Olive: #7b6f19, Cream: #fff1d7
const brandColors = {
  rust: "#bb3e00",
  amber: "#f7ad45",
  olive: "#7b6f19",
  cream: "#fff1d7",
  ink: "#261406",
};

const appFontFamily =
  '"Google Sans", "Google Sans Text", "Product Sans", Arial, sans-serif';

const sitePalette = {
  brand: brandColors,
  primary: {
    0: "#000000",
    10: "#351000",
    20: "#5a1d00",
    25: "#702500",
    30: "#862d00",
    35: "#9f3500",
    40: "#bb3e00",
    50: "#d95b1f",
    60: "#ef7940",
    70: "#ff9c6f",
    80: "#ffc2a6",
    90: "#ffdbca",
    95: "#ffede5",
    99: "#fff8f3",
    100: "#ffffff",
    main: brandColors.rust,
    light: "#ef7940",
    dark: "#862d00",
    contrastText: "#FFFFFF",
  },
  secondary: {
    0: "#000000",
    10: "#2b1800",
    20: "#4b2b00",
    25: "#5f3700",
    30: "#734300",
    35: "#895100",
    40: "#a16000",
    50: "#c17c16",
    60: "#e1982f",
    70: "#f7ad45",
    80: "#ffc879",
    90: "#ffe1b0",
    95: "#fff0d8",
    99: "#fff9ef",
    100: "#ffffff",
    main: brandColors.amber,
    light: "#ffc879",
    dark: "#a16000",
    contrastText: brandColors.ink,
  },
  tertiary: {
    0: "#000000",
    10: "#242000",
    20: "#3e3900",
    25: "#4d4605",
    30: "#5d5410",
    35: "#6c6216",
    40: "#7b6f19",
    50: "#96892d",
    60: "#b1a446",
    70: "#ccc05f",
    80: "#e8dc7a",
    90: "#fff5ad",
    95: "#fff9d6",
    99: "#fffdf0",
    100: "#ffffff",
    main: brandColors.olive,
    light: "#ccc05f",
    dark: "#4d4605",
    contrastText: "#FFFFFF",
  },
  error: {
    0: "#000000",
    10: "#410e0b",
    20: "#601410",
    30: "#8c1d18",
    40: "#b3261e",
    50: "#de3730",
    60: "#f9dedc",
    70: "#f9dedc",
    80: "#f2b8b5",
    90: "#f9dedc",
    95: "#fceeec",
    99: "#fffbf9",
    100: "#ffffff",
    main: "#b3261e",
    light: "#f9dedc",
    dark: "#8c1d18",
  },
  warning: {
    main: brandColors.amber,
    light: "#ffe1b0",
    dark: "#a16000",
    contrastText: brandColors.ink,
  },
  success: {
    main: brandColors.olive,
    light: "#fff5ad",
    dark: "#4d4605",
    contrastText: "#FFFFFF",
  },
  neutral: {
    0: "#000000",
    10: brandColors.ink,
    20: "#3d2818",
    25: "#4a3423",
    30: "#58412f",
    40: "#715943",
    50: "#8b725b",
    60: "#a68b72",
    70: "#c2a78d",
    80: "#dec2a7",
    90: "#f6dec3",
    95: brandColors.cream,
    99: "#fffaf0",
    100: "#ffffff",
  },
  background: {
    default: brandColors.cream,
    paper: "#fffaf0",
  },
  surface: {
    main: brandColors.cream,
    bright: "#ffffff",
    dim: "#f1d9b6",
    containerLowest: "#ffffff",
    containerLow: "#fff8ea",
    container: brandColors.cream,
    containerHigh: "#f8e5c4",
    containerHighest: "#efd4a9",
    variant: "#e4c79f",
  },
  outline: {
    main: "#8b725b",
    variant: "#dec2a7",
  },
  text: {
    primary: brandColors.ink,
    secondary: "#5f4b2f",
    tertiary: brandColors.olive,
  },
  divider: "#e4c79f",
};

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: sitePalette,
    },
  },
  palette: sitePalette,
  typography: {
    fontFamily: appFontFamily,
    // M3 Expressive typography - bold, confident, emotional
    h1: {
      fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
      fontWeight: 900,
      lineHeight: 1.08,
      letterSpacing: 0,
      marginBottom: "1.2rem",
      userSelect: "none",
    },
    h2: {
      fontSize: "clamp(2rem, 5vw, 3rem)",
      fontWeight: 900,
      lineHeight: 1.12,
      letterSpacing: 0,
      marginBottom: "1rem",
      userSelect: "none",
    },
    h3: {
      fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
      fontWeight: 800,
      lineHeight: 1.16,
      letterSpacing: 0,
      marginBottom: "0.875rem",
      userSelect: "none",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: 0,
      marginBottom: "0.75rem",
      userSelect: "none",
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 800,
      lineHeight: 1.25,
      letterSpacing: 0,
      userSelect: "none",
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 800,
      lineHeight: 1.3,
      letterSpacing: 0,
      userSelect: "none",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0.5,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.57,
      letterSpacing: 0.25,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: 0.5,
      fontSize: "1rem",
      lineHeight: 1.25,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.66,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 700,
      lineHeight: 1.66,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    label: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.33,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    "none",
    "0px 1px 2px rgba(0, 0, 0, 0.05)",
    "0px 2px 4px rgba(0, 0, 0, 0.08)",
    "0px 4px 8px rgba(0, 0, 0, 0.1)",
    "0px 4px 12px rgba(0, 0, 0, 0.12)",
    "0px 8px 16px rgba(0, 0, 0, 0.14)",
    "0px 8px 24px rgba(0, 0, 0, 0.16)",
    "0px 12px 32px rgba(0, 0, 0, 0.18)",
    "0px 16px 40px rgba(0, 0, 0, 0.2)",
    "0px 20px 48px rgba(0, 0, 0, 0.22)",
    "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3)",
    "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3)",
    "0px 3px 8px 2px rgba(0, 0, 0, 0.15), 0px 2px 4px 0px rgba(0, 0, 0, 0.3)",
    "0px 5px 12px 2px rgba(0, 0, 0, 0.15), 0px 3px 6px 0px rgba(0, 0, 0, 0.3)",
    "0px 6px 16px 2px rgba(0, 0, 0, 0.15), 0px 3px 8px 0px rgba(0, 0, 0, 0.3)",
    "0px 8px 20px 2px rgba(0, 0, 0, 0.15), 0px 4px 10px 0px rgba(0, 0, 0, 0.3)",
    "0px 10px 24px 2px rgba(0, 0, 0, 0.15), 0px 5px 12px 0px rgba(0, 0, 0, 0.3)",
    "0px 12px 28px 2px rgba(0, 0, 0, 0.15), 0px 6px 14px 0px rgba(0, 0, 0, 0.3)",
    "0px 14px 32px 2px rgba(0, 0, 0, 0.15), 0px 7px 16px 0px rgba(0, 0, 0, 0.3)",
    "0px 16px 36px 2px rgba(0, 0, 0, 0.15), 0px 8px 18px 0px rgba(0, 0, 0, 0.3)",
    "0px 18px 40px 2px rgba(0, 0, 0, 0.15), 0px 9px 20px 0px rgba(0, 0, 0, 0.3)",
    "0px 20px 44px 2px rgba(0, 0, 0, 0.15), 0px 10px 22px 0px rgba(0, 0, 0, 0.3)",
    "0px 22px 48px 2px rgba(0, 0, 0, 0.15), 0px 11px 24px 0px rgba(0, 0, 0, 0.3)",
    "0px 24px 52px 2px rgba(0, 0, 0, 0.15), 0px 12px 26px 0px rgba(0, 0, 0, 0.3)",
    "0px 26px 56px 2px rgba(0, 0, 0, 0.15), 0px 13px 28px 0px rgba(0, 0, 0, 0.3)",
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: brandColors.cream,
          position: "relative",
          fontFamily: appFontFamily,
        },
        a: {
          color: "inherit",
          textDecoration: "none",
        },
        "::-webkit-scrollbar": {
          width: "12px",
          height: "12px",
        },
        "::-webkit-scrollbar-track": {
          background: "#fff8ea",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#bb3e00",
          borderRadius: "6px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#862d00",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ ownerState }) => {
          return {};
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.97),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.12)}`,
          color: theme.palette.text.primary,
          backdropFilter: "blur(24px)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          minHeight: 48,
          paddingInline: 28,
          fontWeight: 700,
          fontSize: "1rem",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          textTransform: "none",
          letterSpacing: 0.5,
          position: "relative",
          overflow: "hidden",
        },
        contained: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          boxShadow: `0 8px 24px ${alpha(
            theme.palette.tertiary.main,
            0.35
          )}`,
          "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
            boxShadow: `0 16px 32px ${alpha(
              theme.palette.tertiary.main,
              0.45
            )}`,
            transform: "scale(1.025)",
          },
          "&:active": {
            transform: "scale(1.01)",
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.tertiary.main,
          borderWidth: 2,
          color: theme.palette.tertiary.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.tertiary.main, 0.12),
            borderColor: theme.palette.tertiary.main,
            transform: "scale(1.025)",
          },
        }),
        text: ({ theme }) => ({
          color: theme.palette.tertiary.main,
          "&:hover": {
            backgroundColor: alpha(theme.palette.tertiary.main, 0.12),
          },
        }),
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          borderRadius: 20,
          backgroundColor: theme.palette.surface.containerLowest,
          boxShadow: `0 4px 12px ${alpha(theme.palette.text.primary, 0.08)}`,
          transition: "all 0.4s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            boxShadow: `0 16px 40px ${alpha(
              theme.palette.text.primary,
              0.16
            )}`,
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
        }),
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
          transformOrigin: "center",
          "&:hover": {
            transform: "scale(1.015)",
          },
          "&:active": {
            transform: "scale(1.005)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          fontWeight: 700,
          fontSize: "0.875rem",
          height: "auto",
          padding: "8px 16px",
          transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
        }),
        filled: ({ theme }) => ({
          background: alpha(theme.palette.secondary.main, 0.2),
          color: theme.palette.tertiary.dark,
          fontWeight: 700,
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.tertiary.main,
          color: theme.palette.tertiary.main,
          borderWidth: 2,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 20,
          backgroundColor: theme.palette.surface.containerHigh,
          boxShadow: `0 24px 56px ${alpha(
            theme.palette.text.primary,
            0.2
          )}`,
          backdropFilter: "blur(16px)",
        }),
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 14,
          backgroundColor: alpha(theme.palette.secondary.main, 0.14),
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.6),
            borderWidth: 2,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.tertiary.main, 0.55),
            borderWidth: 2,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.tertiary.main,
            borderWidth: 2,
            boxShadow: `0 0 0 4px ${alpha(
              theme.palette.tertiary.main,
              0.14
            )}`,
          },
        }),
        input: {
          fontSize: "1rem",
          padding: "16px 18px",
          fontWeight: 500,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontSize: "0.95rem",
          fontWeight: 600,
          color: theme.palette.text.secondary,
          "&.Mui-focused": {
            fontWeight: 700,
            color: theme.palette.tertiary.main,
          },
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.secondary.main, 0.22),
            transform: "scale(1.03)",
          },
          "&:active": {
            transform: "scale(1.015)",
          },
        }),
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1rem",
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          "&.Mui-selected": {
            color: theme.palette.tertiary.main,
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) => ({
          background: theme.palette.secondary.main,
          height: 4,
          borderRadius: "2px",
        }),
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            transform: "scale(1.025)",
          },
        }),
        ellipsis: ({ theme }) => ({
          color: theme.palette.text.secondary,
        }),
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          boxShadow: `0 12px 32px ${alpha(
            theme.palette.tertiary.main,
            0.35
          )}`,
          transition: "all 0.3s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
            boxShadow: `0 20px 48px ${alpha(
              theme.palette.tertiary.main,
              0.45
            )}`,
            transform: "scale(1.035)",
          },
        }),
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.secondary.main, 0.2),
        }),
        bar: ({ theme }) => ({
          background: theme.palette.secondary.main,
        }),
      },
    },
  },
});

export default theme;
