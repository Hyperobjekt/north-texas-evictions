import React from "react";
import PropTypes from "prop-types";
import { Divider } from "@material-ui/core";
import { Stack } from "@hyperobjekt/material-ui-website";
import StatWithSeries from "./StatWithSeries";
import Stat from "./Stat";

/**
 * Displays a primary statistic with a time series, and a
 * list of secondary stats below.
 */
const StatsSummary = ({ value, label, series, stats, children, ...props }) => {
  return (
    <Stack direction="vertical" alignItems="stretch" between="md" {...props}>
      <StatWithSeries value={value} label={label} series={series} />
      <Divider style={{ marginTop: 4, background: "transparent" }} />
      {Array.isArray(stats) &&
        stats.map((stat) => <Stat key={stat.id} {...stat} />)}
      {children}
    </Stack>
  );
};

StatsSummary.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  series: PropTypes.arrayOf(PropTypes.object),
  stats: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.node,
};

export default StatsSummary;
