import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, withStyles } from "@material-ui/core";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import { useLang } from "../../Language";
import useDashboardContext from "../../Dashboard/hooks/useDashboardContext";
import LegendRow from "./LegendRow";
import useSummaryData from "../../Data/useSummaryData";

const styles = (theme) => ({
  root: {},
  value: {
    color: "#000000",
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(14),
  },
});

const SummaryTrend = () => (
  <svg
    width="117"
    height="24"
    viewBox="0 0 117 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 20C4.09383 16.0835 13.2244 8.25047 24.9961 8.25047C39.7106 8.25047 49.6713 -1.31309 57.5945 8.25047C65.5177 17.814 69.3661 18.6338 79.7795 18.6338C88.1102 18.6338 107.398 16.9943 116 16.1746"
      stroke="#EC7406"
      strokeWidth="2"
    />
    <path
      d="M24.9961 8.25047C13.2244 8.25047 4.09383 16.0835 1 20H116V16.1746C107.398 16.9943 88.1102 18.6338 79.7795 18.6338C69.3661 18.6338 65.5177 17.814 57.5945 8.25047C49.6713 -1.31309 39.7106 8.25047 24.9961 8.25047Z"
      fill="#EC7406"
      fillOpacity="0.3"
    />
  </svg>
);

const Summary = ({ classes, ...props }) => {
  const { data: summary } = useSummaryData();
  console.log({ summary });

  if (!summary) return null;

  return (
    <Box>
      <LegendRow
        title={"Total Eviction Filings"}
        value={
          <Typography className={classes.value}>{summary.filings}</Typography>
        }
      />
      <LegendRow
        title={"Total Amount Filed"}
        value={
          <Typography className={classes.value}>${summary.amount}</Typography>
        }
      />
      <LegendRow title={"Filings By Day"} value={<SummaryTrend />} />
    </Box>
  );
};

Summary.propTypes = {};

export default withStyles(styles)(Summary);
