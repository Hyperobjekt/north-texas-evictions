import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import LegendRow from "./LegendRow";
import useSummaryData from "../../Data/useSummaryData";
import { useLang } from "../../Language";
import useFormatter from "../../Dashboard/hooks/useFormatter";
import { Stack } from "@hyperobjekt/material-ui-website";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import shallow from "zustand/shallow";
import { timeFormat } from "d3-time-format";
import { parseDate } from "../../Dashboard/utils";
import TrendLine from "./TrendLine";

const styles = (theme) => ({
  root: {},
  value: {
    color: "#000000",
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(14),
  },
});

const Summary = ({ classes, ...props }) => {
  const { data: summary, status } = useSummaryData();
  const dateRange = useDashboardStore((state) => state.dateRange, shallow);
  const langKeys = [
    `SUMMARY_EF`,
    `SUMMARY_TFA`,
    `SUMMARY_SERIES`,
    `SUMMARY_UPDATED`,
  ];
  const [filingsLabel, amountLabel, seriesLabel, lastUpdated] =
    useLang(langKeys);

  const intFormatter = useFormatter("ef");
  const currencyFormatter = useFormatter("mfa");
  const hintKeys = ["HINT_TOTAL_FILINGS", "HINT_TOTAL_AMOUNT"];
  const hintValues = useLang(hintKeys);
  const isReady = status === "success";

  return (
    <Stack
      direction="vertical"
      alignItems="stretch"
      flex="1"
      between="md"
      mt={2}
      {...props}
    >
      <LegendRow
        title={filingsLabel}
        hint={hintKeys[0] !== hintValues[0] && hintValues[0]}
      >
        <Typography className={classes.value}>
          {isReady ? intFormatter(summary.filings) : "..."}
        </Typography>
      </LegendRow>
      <LegendRow
        title={amountLabel}
        hint={hintKeys[1] !== hintValues[1] && hintValues[1]}
      >
        <Typography className={classes.value}>
          {isReady ? currencyFormatter(summary.amount) : "..."}
        </Typography>
      </LegendRow>
      <LegendRow title={seriesLabel}>
        <TrendLine data={isReady ? summary.series : []} />
      </LegendRow>

      <LegendRow
        title={lastUpdated.replace(
          "{{date}}",
          timeFormat("%b %e, %Y")(parseDate(dateRange[1]))
        )}
      ></LegendRow>
    </Stack>
  );
};

Summary.propTypes = {};

export default withStyles(styles)(Summary);
