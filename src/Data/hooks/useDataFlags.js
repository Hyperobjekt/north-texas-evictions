import { timeDay } from "d3-time";
import { parseDate, useDashboardContext } from "../../Dashboard";
import { useLang } from "../../Language";

export default function useDataFlags() {
  const { activeBubble, activeDateRange } = useDashboardContext();
  const daysBetween = timeDay.count(...activeDateRange.map(parseDate));
  const flags = [];
  // flag when viewing filings per 1000k with a short time frame
  if (daysBetween < 30 && activeBubble === "efr") flags.push("FLAG_SHORT_EFR");

  // flag when viewing median filing amounts
  if (activeBubble === "mfa") flags.push("FLAG_MFA");

  // flag when viewing data before a certain date
  const noColinDentonData =
    +parseDate(activeDateRange[0]) < +parseDate("2019-01-01");
  if (noColinDentonData) flags.push("FLAG_COLLIN_DENTON");

  const noTarrantData =
    +parseDate(activeDateRange[0]) < +parseDate("2020-01-01");
  if (noTarrantData) flags.push("FLAG_TARRANT");

  const flagLabels = useLang(flags);
  return Array.isArray(flagLabels) ? flagLabels : [flagLabels];
}
