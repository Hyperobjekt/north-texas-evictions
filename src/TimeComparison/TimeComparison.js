import { Typography, withStyles} from "@material-ui/core";
import React from "react";
import TimeComparisonChart from "./components/TimeComparisonChart";
import TimeComparisonToggle from "./components/TimeComparisonToggle";
import TimeComparisonLegend from "./components/TimeComparisonLegend";
import useComparisonLines from "./hooks/useComparisonLines";
import PropTypes from "prop-types";

import { getXTooltipFormatter, getXTickFormatter } from "../TimeSeries/utils";

export const styles = (theme) => ({
  
});

const TimeComparison = ({
  colors,
  years,
  legendLabels = years,
  compareToYear,
  feature,
  classes,
  ...props
}) => {

  const [view, setView] = React.useState("counts");
  
  const {lines, canCompare} = useComparisonLines(feature.properties.id, years, colors, compareToYear, view, legendLabels);
  const yAccessor = (d) => d?.ef;
  const xAccessor = (d) => d && new Date(`${d["date"]}T00:00:00`)
  const xTooltipFormatter = getXTooltipFormatter('monthly')
  const xTickFormatter = getXTickFormatter('monthly');
  const yTickFormatter = view === 'counts' ? (d) => d : (d) => `${d}%`;
  const yFormatter = (d) => view === 'counts' ? d.toFixed(0) : `${d.toFixed(0)}%`;

  const handleToggleView = (view) => (e) => {
    setView(view);
  };

  return (
    <>
      <Typography variant="overline" color="textSecondary">
        Pre-COVID vs. COVID-19 Era
      </Typography>
      <TimeComparisonToggle 
        selected={view}
        clickHandler={handleToggleView}
        disableableButtons={[{id: 'relative', disabled: !canCompare, tip: `Pre-COVID data is not available for ${feature.properties.name}`}]}
      > 
        {[{label: 'Filling Counts', id: 'counts'}, {label: 'Relative to 2019 (Pre-COVID)', id: 'relative'}]}
      </TimeComparisonToggle>
      <TimeComparisonChart
        compareToYear={compareToYear}
        view={view}
        height={300}
        margin={{ right: 0, top: 16, left: 45, bottom: 32 }}
        xAccessor={xAccessor}
        yAccessor={yAccessor}
        yFormatter={yFormatter}
        xTickFormatter={xTickFormatter}
        yTickFormatter={yTickFormatter}
        xTooltipFormatter={xTooltipFormatter}
        lines={lines}
      />
      <TimeComparisonLegend
        lines={lines}
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
