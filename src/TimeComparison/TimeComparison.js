import { Typography, withStyles} from "@material-ui/core";
import React from "react";
import TimeComparisonChart from "./components/TimeComparisonChart";
import TimeComparisonToggle from "./components/TimeComparisonToggle";
import TimeComparisonLegend from "./components/TimeComparisonLegend";
import useComparisonLines from "./hooks/useComparisonLines";
import PropTypes from "prop-types";

import { getXTooltipFormatter, getXTickFormatter } from "./utils";

export const styles = (theme) => ({
  
});

const TimeComparison = ({
  colors,
  years,
  legendLabels = years,
  compareToYear,
  featureId,
  classes, 
  ...props
}) => {

  const [view, setView] = React.useState("count");
  
  const {lines, canCompare} = useComparisonLines(featureId, years, colors, compareToYear, view);
  console.log(canCompare)
  const yAccessor = (d) => d?.ef;
  const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`)
  const xTooltipFormatter = getXTooltipFormatter('monthly')
  const xTickFormatter = getXTickFormatter('monthly');
  const yTickFormatter = view === 'count' ? (d) => d : (d) => `${d}%`;
  const yFormatter = (d) => view === 'count' ? d.toFixed(0) : `${d.toFixed(0)}%`;

  const handleToggleView = (view) => (e) => {
    setView(view);
  };

  return (
    <>
      <Typography variant="overline" color="textSecondary">
        Pre-COVID vs. COVID-19 Era
      </Typography>
      <TimeComparisonToggle 
        view={view}
        clickHandler={handleToggleView}
        disableRelative={!canCompare}
      > 
        {['Filling Counts', 'Relative to 2019 (Pre-COVID)']}
      </TimeComparisonToggle>
      <TimeComparisonChart
        compareToYear={compareToYear}
        view={view}
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
        legendLabels={legendLabels}
        colors={colors}
        compareToYear={compareToYear}
        view={view}
      />
    </>
  );
};

TimeComparison.propTypes = {
  colors: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired,
  compareToYear: PropTypes.string.isRequired,
  featureId: PropTypes.string.isRequired,
  classes: PropTypes.any,
};

export default withStyles(styles)(TimeComparison);
