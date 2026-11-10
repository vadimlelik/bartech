import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1D6FE8',
            dark: '#1859BD',
            light: '#E8F0FE',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#E8F0FE',
            dark: '#D3E2FC',
            contrastText: '#1D6FE8',
        },
        error: {
            main: '#D93C3C',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#1E8E4E',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#B7791F',
            contrastText: '#FFFFFF',
        },
        text: {
            primary: '#1F2933',
            secondary: '#6B7683',
            disabled: '#9AA3AF',
        },
        divider: '#E1E5EB',
        background: {
            default: '#F3F5F8',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontSize: '2rem',
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: 0,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: 0,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: 0,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.9375rem',
            lineHeight: 1.55,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: 0,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    color: '#1F2933',
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 20,
                    paddingRight: 20,
                },
                maxWidthLg: {
                    maxWidth: '1240px !important',
                },
                maxWidthXl: {
                    maxWidth: '1240px !important',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 500,
                    boxShadow: 'none',
                    minHeight: 40,
                    '&.Mui-focusVisible': {
                        outline: '2px solid #1D6FE8',
                        outlineOffset: 2,
                    },
                },
                sizeSmall: {
                    minHeight: 32,
                    padding: '4px 12px',
                    fontSize: 14,
                },
                sizeMedium: {
                    minHeight: 40,
                    padding: '8px 16px',
                },
                sizeLarge: {
                    minHeight: 48,
                    padding: '12px 24px',
                    fontSize: 16,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#D3E2FC',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&.Mui-focusVisible': {
                        outline: '2px solid #1D6FE8',
                        outlineOffset: 2,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #E1E5EB',
                    boxShadow: 'none',
                    backgroundImage: 'none',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                },
                notchedOutline: {
                    borderColor: '#CBD2DC',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                    fontWeight: 500,
                },
            },
        },
        MuiSnackbar: {
            styleOverrides: {
                root: {
                    '@media (max-width:899.95px)': {
                        bottom: 'calc(72px + env(safe-area-inset-bottom))',
                    },
                },
            },
        },
    },
});

export default theme;
