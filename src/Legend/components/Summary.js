import React from "react";
import { extent, max } from "d3-array";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Typography, withStyles } from "@material-ui/core";
import LegendRow from "./LegendRow";
import useSummaryData from "../../Data/useSummaryData";
import { useLang } from "../../Language";
import useFormatter from "../../Dashboard/hooks/useFormatter";
import { Stack } from "@hyperobjekt/material-ui-website";

// data accessors
const getX = (d) => new Date(`${d.date}T00:00:00`);
const getY = (d) => Number(d.ef);

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

  // add some extra points for the filled shape
  const lineDataFilled = lineData.concat([
    { ...lineData[lineData.length - 1], ef: 0 },
    { ...lineData[0], ef: 0 },
  ]);

  return (
    <svg
      width="117"
      height="24"
      viewBox="0 0 117 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <LinePath
        data={lineDataFilled}
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
        strokeWidth={1}
        strokeOpacity={1}
        shapeRendering="geometricPrecision"
      />
    </svg>
  );
};

const Summary = ({ classes, ...props }) => {
  const { data: summary, status } = useSummaryData();
  const langKeys = [`SUMMARY_EF`, `SUMMARY_TFA`, `SUMMARY_SERIES`];
  const [filingsLabel, amountLabel, seriesLabel] = useLang(langKeys);
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
        <SummaryTrend lineData={isReady ? summary.series : []} />
      </LegendRow>
    </Stack>
  );
};

Summary.propTypes = {};

export default withStyles(styles)(Summary);
