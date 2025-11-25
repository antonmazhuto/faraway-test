import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            default: "#0d0d0d",
            paper: "#1a1d23",
        },
        primary: {
            main: "#3BAAF5",
        },
        error: {
            main: "#E53935",
        },
        text: {
            primary: "#ffffff",
            secondary: "#d0d0d0",
        },
    },
    typography: {
        fontFamily: "'Orbitron', sans-serif",
        h5: { fontWeight: 700, letterSpacing: "0.05em" },
        body1: { fontSize: "0.9rem" },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    background: "rgba(26,29,35,0.85)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 0 12px rgba(0,140,255,0.2)",
                    transition: "0.25s",
                    "&:hover": {
                        boxShadow: "0 0 20px rgba(0,140,255,0.4)",
                        transform: "translateY(-2px)",
                    },
                },
            },
        },
    },
});
