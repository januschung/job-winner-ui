import { createTheme } from "@mui/material/styles";

const getDesignTokens = (mode) => {
  const baseTheme = createTheme(); // Default Material-UI theme for light mode

  return {
    ...baseTheme, // Ensure the base theme properties are retained
    palette: {
      mode,
      ...(mode === "dark"
        ? {
          }
        : {
            ...baseTheme.palette,
          }),
    custom: {
      table: {
        header: mode === "dark" ? "#263238" : "#e3f2fd",
        headerHover: mode === "dark" ? "#757575" : "#e0e0e0",
      },
    },
  },
};
};

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
