import { Button, ButtonGroup, Box, Typography, withStyles} from "@material-ui/core";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import React from "react";
import TimeComparisonChart from "./components/TimeComparisonChart";
import TimeComparisonToggle from "./components/TimeComparisonToggle";
import TimeComparisonLegend from "./components/TimeComparisonLegend";
import useComparisonLines from "./hooks/useComparisonLines";
import PropTypes from "prop-types";

import { getXTooltipFormatter, getXTickFormatter } from "./utils";

export const styles = (theme) => ({
  legend: {
    marginTop: '0px !important',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
  }
});

const TimeComparison = ({
  colors,
  years,
  compareToYear,
  classes, 
  ...props
}) => {

  const [view, setView] = React.useState("count");
  
  const lines = useComparisonLines(years, colors, view === 'count' ? '' : compareToYear);
  const yAccessor = (d) => d?.ef;
  const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`)
  const xTooltipFormatter = getXTooltipFormatter('monthly')
  const xTickFormatter = getXTickFormatter('monthly');
  const yTickFormatter = view === 'count' ? (d) => d : (d) => `${d}%`;
  const yFormatter = (d) => view === 'count' ? d.toFixed(0) : `${d.toFixed(0)}%`;

  const handleToggleView = (view) => (e) => {
    setView(view);
  };

  const threshold = scaleOrdinal({
    domain: years,
    range: colors,
  });

  return (
    <>
      <Typography variant="overline" color="textSecondary">
        Pre-COVID vs. COVID-19 Era
      </Typography>
      <TimeComparisonToggle 
        view={view}
        clickHandler={handleToggleView}
      > 
        {['Filling Counts', 'Relative to 2019 (Pre-COVID)']}
      </TimeComparisonToggle>
      <TimeComparisonChart
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTickFormatter={xTickFormatter}
        yTickFormatter={yTickFormatter}
        xTooltipFormatter={xTooltipFormatter}
        lines={lines}
      />
      <TimeComparisonLegend 
        years={years}
        colors={colors}
      />
    </>
  );
};

TimeComparison.propTypes = {
  classes: PropTypes.any,
  className: PropTypes.string,
};

export default withStyles(styles)(TimeComparison);
