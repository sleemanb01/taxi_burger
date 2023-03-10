import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { _default_theme } from "./styles/defaultTheme";
import { ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "./hooks/auth-context";
import { ShiftContextProvider } from "./hooks/shift-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={_default_theme}>
      <AuthContextProvider>
        <ShiftContextProvider>
          <App />
        </ShiftContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
