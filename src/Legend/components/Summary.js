import React from "react";
import { extent, max } from "d3-array";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import PropTypes from "prop-types";
import { Box, Paper, Typography, withStyles } from "@material-ui/core";
import LegendRow from "./LegendRow";
import useSummaryData from "../../Data/useSummaryData";
import { format } from "d3-format";

const formatInteger = format(",d");

// data accessors
const getX = (d) => new Date(`${d.date}T00:00:00`);
const getY = (d) => Number(d.filings);

const styles = (theme) => ({
  root: {},
  value: {
    color: "#000000",
    fontWeight: 500,
    fontSize: theme.typography.pxToRem(14),
  },
});

const SummaryTrend = ({ lineData }) => {
  // scales
  const xScale = scaleTime({
    domain: extent(lineData, getX),
  });
  const yScale = scaleLinear({
    domain: [0, max(lineData, getY)],
  });

  // update scale output ranges
  xScale.range([1, 116]);
  yScale.range([21, 1]);

  return (
    <svg
      width="117"
      height="24"
      viewBox="0 0 117 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <LinePath
        data={[{ ...lineData[0], filings: 0 }]
          .concat(lineData)
          .concat([{ ...lineData[lineData.length - 1], filings: 0 }])}
        x={(d) => xScale(getX(d)) ?? 0}
        y={(d) => yScale(getY(d)) ?? 0}
        fill="#EC7406"
        opacity={0.3}
        shapeRendering="geometricPrecision"
      />
      <LinePath
        data={lineData}
        x={(d) => xScale(getX(d)) ?? 0}
        y={(d) => yScale(getY(d)) ?? 0}
        stroke="#EC7406"
        strokeWidth={2}
        strokeOpacity={1}
        shapeRendering="geometricPrecision"
      />
    </svg>
  );
};

const Summary = ({ classes, ...props }) => {
  const { data: summary } = useSummaryData();
  //   console.log({ summary });

  if (!summary) return null;

  return (
    <Box>
      <LegendRow
        title={"Total Eviction Filings"}
        value={
          <Typography className={classes.value}>
            {formatInteger(summary.filings)}
          </Typography>
        }
      />
      <LegendRow
        title={"Total Amount Filed"}
        value={
          <Typography className={classes.value}>
            ${formatInteger(summary.amount)}
          </Typography>
        }
      />
      <LegendRow
        title={"Filings By Day"}
        value={<SummaryTrend lineData={summary.series} />}
      />
    </Box>
  );
};

Summary.propTypes = {};

export default withStyles(styles)(Summary);
