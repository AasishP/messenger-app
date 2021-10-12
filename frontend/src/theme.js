//This is the material ui theme

import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      light: "#75a7ff",
      main: "#00ab55",
      dark: "#004ecb",
    },
    background: {
      paper: "#fff",
      default: "#fff",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
