import { useMemo } from "react";
import { useMediaQuery } from "@material-ui/core";

export default function useMediaQueries() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isLargeDisplay = useMediaQuery("(min-width:1400px)");
  return useMemo(
    () => ({
      isMobile,
      isLargeDisplay,
    }),
    [isMobile, isLargeDisplay]
  );
}
