import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const _default_theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
    mode: "light",
  },
});
