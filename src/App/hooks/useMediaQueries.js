import { useMediaQuery } from "@material-ui/core";

export default function useMediaQueries() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return { isMobile };
}
