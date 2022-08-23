import React, { useState, useEffect } from "react";
import Routes from "./routes";
import "react-toastify/dist/ReactToastify.css";

import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from "@mui/material";
import { ptBR } from "@mui/material/locale";

const App = () => {
  const [locale, setLocale] = useState();

  const theme = createTheme(adaptV4Theme({
    typography: {
      fontFamily: [
        "Public Sans",
        "Roboto",
        "Arial",
        "sans-serif"
      ].join(",")
    },
    scrollbarStyles: {
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
        backgroundColor: "#e8e8e8",
      },
    },
    palette: {
      primary: { main: process.env.REACT_APP_COLOR_PALETTE_PRIMARY || "#2576d2" },
    },
  }, locale));

  useEffect(() => {
    const i18nlocale = localStorage.getItem("i18nextLng");
    const browserLocale =
      i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

    if (browserLocale === "ptBR") {
      setLocale(ptBR);
    }
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
