import { alpha, createTheme, darken } from "@material-ui/core";

export const HEADER_TEXT_COLOR = "#E1DFDF";
export const HEADER_BACKGROUND_COLOR = "#292929";

export const FOCUS_STATE = {
  boxShadow: "0 0 0 2px #fff, 0 0 0 4px #649BA6",
};
const DARK_FOCUS_STATE = {
  boxShadow: `0 0 0 2px ${HEADER_BACKGROUND_COLOR}, 0 0 0 4px #649BA6`,
};

const SECONDARY = "#008097";

const fontFamily = `"franklin-gothic-urw", "Roboto", "Helvetica", "Arial", sans-serif`;
const altFontFamily = `"degular", "Roboto", "Helvetica", "Arial", sans-serif`;

export default createTheme({
  palette: {
    primary: { main: "#EC7406" },
    secondary: {
      main: SECONDARY,
    },
    text: {
      primary: "rgba(68, 71, 67, 1)",
      secondary: "rgba(114, 116, 109, 1)",
    },
    action: {
      hover: "rgba(236, 236, 213, 0.333)",
      active: "rgba(236, 236, 213, 0.666)",
      selected: "rgba(236, 236, 213, 0.666)",
      focus: "rgba(236, 236, 213, 0.333)",
    },
    header: { text: HEADER_TEXT_COLOR, background: HEADER_BACKGROUND_COLOR },
    background: {
      default: "#f0f3f4",
      dark: "#292929",
    },
  },
  typography: {
    fontFamily: fontFamily,
    // for dialog headings
    h1: {
      fontFamily: altFontFamily,
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1,
    },
    // for tooltip and panel headings
    h2: {
      fontFamily: fontFamily,
      fontSize: "0.875rem", // 14px
      fontWeight: 500,
      lineHeight: 1,
    },
    body1: {
      fontFamily: fontFamily,
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.42,
    },
    body2: {
      fontFamily: fontFamily,
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      lineHeight: 1.42,
    },
    // for labels
    caption: {
      fontFamily: fontFamily,
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      lineHeight: 16 / 12,
      letterSpacing: "0.02em", // 2%
    },
    // for section labels
    overline: {
      fontFamily: fontFamily,
      fontSize: "0.75rem", // 12px
      fontWeight: 500,
      lineHeight: 16 / 12,
      letterSpacing: "0.09em", // 9%
      textTransform: "uppercase",
    },
    button: {
      fontFamily: fontFamily,
      fontSize: "0.75rem", // 12px
      fontWeight: 500,
      lineHeight: 16 / 12,
      letterSpacing: "0.02em", // 2%
    },
  },
  shape: {
    borderRadius: 2,
  },
  shadows: [
    "none",
    "0px 8px 20px rgba(0, 0, 0, 0.03)",
    "0px 8px 20px rgba(0, 0, 0, 0.05)",
    "0px 8px 20px rgba(0, 0, 0, 0.08)",
    "0px 8px 22px rgba(0, 0, 0, 0.1)",
    "0px 8px 24px rgba(0, 0, 0, 0.12)",
    "0px 8px 26px rgba(0, 0, 0, 0.14)",
    "0px 8px 28px rgba(0, 0, 0, 0.16)",
    "0px 8px 30px rgba(0, 0, 0, 0.18)",
    "0px 8px 32px rgba(0, 0, 0, 0.2)",
    "0px 8px 34px rgba(0, 0, 0, 0.22)",
    "0px 8px 36px rgba(0, 0, 0, 0.24)",
    "0px 8px 38px rgba(0, 0, 0, 0.26)",
    "0px 8px 40px rgba(0, 0, 0, 0.28)",
    "0px 8px 42px rgba(0, 0, 0, 0.3)",
    "0px 8px 44px rgba(0, 0, 0, 0.32)",
    "0px 8px 46px rgba(0, 0, 0, 0.34)",
    "0px 8px 48px rgba(0, 0, 0, 0.36)",
    "0px 8px 50px rgba(0, 0, 0, 0.38)",
  ],
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
    MuiIconButton: {
      root: {
        color: "#92928B",
        "&:focus": {
          ...FOCUS_STATE,
        },
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
        position: "relative",
        backgroundColor: "#ECECD5",
        boxShadow: "none",
        "&.Mui-focusVisible, &:focus": {
          ...FOCUS_STATE,
        },
        "&:hover": {
          backgroundColor: "#D6D6B6",
        },
        "&.dark": {
          background: "#4a4646",
          border: 0,
          color: HEADER_TEXT_COLOR,
          "&:focus": {
            ...DARK_FOCUS_STATE,
            zIndex: 2,
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
      root: {},
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
          transition: `background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
          "& .MuiSvgIcon-root": {
            color: "#92928B",
          },
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
      root: {
        "& .MuiIconButton-root": {
          padding: "0.5rem",
          "&:focus": {
            // inset the focus state on input adornments so they dont overlap outer control focus
            boxShadow: "inset 0 0 0 4px #fff, inset 0 0 0 6px #649BA6",
          },
        },
      },
      positionStart: {
        marginLeft: "0.95rem",
        marginRight: 0,
        position: "relative",
        top: "0.0625rem",
        "@media (min-width:600px)": {
          marginLeft: "1.45rem",
        },
        "@media (min-width:960px)": {
          marginLeft: ".75rem",
        },
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
    // MuiSvgIcon: {
    //   root: {
    //     color: "#92928B",
    //   },
    // },
    MuiInputLabel: {
      formControl: {
        top: -4,
      },
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: SECONDARY,
      },
    },
    MuiPickersToolbarText: {
      toolbarTxt: {
        color: "white",
      },
      toolbarBtnSelected: {
        color: "white",
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: SECONDARY,
        color: "white",
        "&:hover": {
          backgroundColor: SECONDARY,
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: alpha(darken(SECONDARY, 0.6), 0.9),
        fontWeight: 400,
        fontSize: "0.8125rem",
        padding: "0.5rem",
        maxWidth: "14rem",
      },
      arrow: {
        color: alpha(darken(SECONDARY, 0.6), 0.9),
      },
    },
  },
  props: {
    MuiInput: {
      disableUnderline: true,
    },
    MuiButton: {
      variant: "outlined",
    },
    text: {
      primary: "#444743",
      secondary: "#72746D",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
