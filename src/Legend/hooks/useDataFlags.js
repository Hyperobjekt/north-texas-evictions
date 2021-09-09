import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import { timeDay } from "d3-time";

export default function useDataFlags() {
  const { activeBubble, activeChoropleth, activeDateRange, activeRegion } =
    useDashboardContext();
  const daysBetween = timeDay.count(...activeDateRange);
  const flags = [];
  // flag when viewing filings per 1000k with a short time frame
  if (daysBetween < 30 && activeBubble === "efr") flags.push("FLAG_SHORT_EFR");

  // flag when viewing median filing amounts
  if (activeBubble === "mfa") flags.push("FLAG_MFA");
}
