import React, { useCallback, useEffect } from "react";
import { Box } from "@material-ui/core";
import useLanguageStore from "../Language/useLanguageStore";
import { Legend } from "../Legend";
import { Map } from "../Map";
import Panel from "../Panel/Panel";
import { withStyles } from "@material-ui/styles";
import { Tooltip } from "../Tooltip";
import useDashboardStore from "./hooks/useDashboardStore";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Wrapper = withStyles({
  root: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
    flex: 1,
    overflow: "hidden",
  },
})(Box);

const Dashboard = ({ lang = "en", langDict }) => {
  // update language on changes
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  useEffect(() => {
    setLanguage(lang, langDict);
  }, [lang, langDict, setLanguage]);

  // track mouse coords for tooltip
  const setHoverCoords = useDashboardStore((state) => state.setHoverCoords);
  const handleMouseMove = useCallback(
    (e) => {
      setHoverCoords([e.clientX, e.clientY]);
    },
    [setHoverCoords]
  );

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Wrapper onMouseMove={handleMouseMove}>
        <Box position="relative" style={{ flex: 1 }}>
          <Legend />
          <Map />
        </Box>
        <Panel open={true} />
        <Tooltip />
      </Wrapper>
    </MuiPickersUtilsProvider>
  );
};

Dashboard.defaultProps = {
  lang: "en",
  langDict: {
    en: {
      APP_TITLE: "North Texas Evictions",
      BUTTON_MENU_OPEN: "Menu",
      METRIC_CPR: "Child Poverty Rate",
      METRIC_PVR: "Poverty Rate",
      METRIC_EF: "Eviction Filings",
      METRIC_EFR: "Filings Per 1000 Renters",
      METRIC_MFA: "Median Filing Amount",
      METRIC_PCW: "% Non-Hispanic White",
      METRIC_PCB: "% Black",
      METRIC_PCH: "% Latinx",
      METRIC_PCA: "% Asian",
      METRIC_MHI: "Median Household Income",
      METRIC_MGR: "Median Gross Rent",
      METRIC_MPV: "Median Property Value",
      METRIC_PRH: "% Renter Homes",
      METRIC_RB: "Rent Burden",
      METRIC_TFA: "Total Filing Amount",
      REGION_COUNTIES: "Counties",
      REGION_TRACTS: "Census Tracts",
      REGION_ZIPS: "ZIP Codes",
      REGION_CITIES: "Cities",
      REGION_DISTRICTS: "Council Districts",
      LEGEND_SUMMARY: "between {{start}} and {{end}}",
      BUTTON_CHANGE_OPTIONS: "Change Data Options",
      SELECT_CHOROPLETH: "Demographic Metric",
      SELECT_BUBBLE: "Eviction Metric",
      SELECT_REGION: "Region",
      SELECT_DATE_START: "Start Date",
      SELECT_DATE_END: "End Date",
      SELECT_COURT: "Court",
      SELECT_DATE_RANGE: "Date Range",
      TITLE_DATA_OPTIONS: "Data Options",
      SUMMARY: "Summary ({{dateRange}})",
      SUMMARY_EF: "Total Eviction Filings",
      SUMMARY_TFA: "Total Amount Filed",
      SUMMARY_SERIES: "Filings By Day",
      SUMMARY_UPDATED: "Data last updated on {{date}}.",
      LEGEND: "Map Legend",
      LEGEND_TITLE: "Currently Viewing",
      FLAG_MFA:
        "Median filings amounts are only available within Dallas County. ",
      FLAG_SHORT_EFR:
        "Filings per 1,000 renters will be small for short time ranges.",
      HINT_TOTAL_FILINGS: "",
      HINT_TOTAL_AMOUNT:
        "Filing amounts are only reported within Dallas County, the actual total is much higher.",
      LABEL_ALL_COURTS: "All Courts",
      LABEL_FIT_BOUNDS: "Zoom to all {{region}}",
      LABEL_UNAVAILABLE: "Unavailable",
      LABEL_REGION_UNAVAILABLE: "Unavailable for {{region}}",
      LABEL_SHOW_LEGEND: "Show Full Legend",
      LABEL_HIDE_LEGEND: "Show Full Map",
      LABEL_SHOW_DATA_OPTIONS: "Show All Data Options",
    },
  },
};

Dashboard.propTypes = {};

export default Dashboard;
