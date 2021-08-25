import { createTheme } from "@material-ui/core";

export const HEADER_TEXT_COLOR = "#E1DFDF";
export const HEADER_BACKGROUND_COLOR = "#292929";

const FOCUS_STATE = {
  boxShadow: "0 0 0 2px #fff, 0 0 0 4px #649BA6",
};
const DARK_FOCUS_STATE = {
  boxShadow: `0 0 0 2px ${HEADER_BACKGROUND_COLOR}, 0 0 0 4px #649BA6`,
};

export default createTheme({
  palette: {
    primary: { main: "#EC7406" },
    secondary: {
      main: "#8AB5BC",
    },
    action: {
      hover: "rgba(236, 236, 213, 0.333)",
      active: "rgba(236, 236, 213, 0.666)",
      selected: "rgba(236, 236, 213, 0.666)",
      focus: "rgba(236, 236, 213, 0.333)",
    },
    header: { text: HEADER_TEXT_COLOR, background: HEADER_BACKGROUND_COLOR },
  },
  shape: {
    borderRadius: 2,
  },
  overrides: {
    HypHeader: {
      root: {
        background: "#292929",
        color: "#fff",
      },
    },
    MuiAppBar: {
      colorPrimary: {
        background: HEADER_BACKGROUND_COLOR,
        color: HEADER_TEXT_COLOR,
      },
    },
    MuiButton: {
      root: {
        textTransform: "none",
        "&:focus": {
          ...FOCUS_STATE,
        },
      },
      contained: {
        backgroundColor: "#ECECD5",
        "&:hover": {
          backgroundColor: "#D6D6B6",
        },
        "&.dark": {
          background: "#4a4646",
          border: 0,
          color: HEADER_TEXT_COLOR,
          "&:focus": {
            ...DARK_FOCUS_STATE,
          },
        },
      },
      outlined: {
        borderColor: "#eaeaea",
        backgroundColor: "rgba(255,255,255,0.2)",
        "&:hover": {
          borderColor: "#cbcbcb",
          backgroundColor: "rgba(236,236,213,0.2)",
        },
      },
    },
    MuiInputBase: {
      input: {
        padding: "0.75rem 0.75rem 0.6666rem",
      },
    },
    MuiInput: {
      root: {
        background: "rgba(255,255,255,0.1)",
        borderRadius: 2,
        border: `1px solid #EAEAEA`,

        "&:hover": {
          borderColor: "#cbcbcb",
        },
        "&:focus-within": {
          ...FOCUS_STATE,
        },
        "&.dark": {
          background: "#4a4646",
          border: 0,
          "& $input": {
            color: HEADER_TEXT_COLOR,
          },
          "&:focus-within": {
            ...DARK_FOCUS_STATE,
          },
        },
      },
    },
    MuiInputAdornment: {
      positionStart: {
        marginLeft: "0.75rem",
        marginRight: 0,
        position: "relative",
        top: "0.06125rem",
      },
    },
    MuiSelect: {
      select: {
        "&:focus": {
          backgroundColor: "rgba(236, 236, 213, 0.333)",
        },
      },
      icon: {
        right: "0.5rem",
        color: "#92928B",
      },
    },
    MuiSvgIcon: {
      root: {
        color: "#92928B",
      },
    },
    MuiInputLabel: {
      formControl: {
        top: -4,
      },
    },
  },
  props: {
    MuiInput: {
      disableUnderline: true,
    },
    MuiButton: {
      variant: "outlined",
      disableElevation: true,
    },
  },
});
