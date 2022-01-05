import React from "react";
import { Typography, withStyles, Box } from "@material-ui/core";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import PropTypes from "prop-types";

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

const TimeComparisonLegend = ({
  years,
  colors,
  classes,
  compareToYear,
  view,
  ...props
}) => {
  const threshold = scaleOrdinal({
    domain: years,
    range: colors,
  });

  const Bullet = ({bulletSize, label}) => {
    return (
      <svg width={bulletSize} height={bulletSize} style={{ margin: '5px 0' }}>
        <circle fill={label.value} r={bulletSize / 2} cx={bulletSize / 2} cy={bulletSize / 2} />
      </svg>
    )
  }

  const Line = ({width, label}) => {
    return(
      <svg height={20} width={width}>
        <line stroke-dasharray="2,2" x1="0" y1="10" x2={width} y2="10" style={{stroke: label.value, strokeWidth: 2}}/>
      </svg>
    )
  }

  return (
    <Box className={classes.legend}>
      <LegendOrdinal scale={threshold}>
        {(labels) => labels.map((label) => {
        return (
          <LegendItem key={label.index} label={label.text}>
            <LegendLabel>
              {view === 'relative' && label.text === compareToYear ? <Line width={12} label={label}/> : <Bullet bulletSize={8} label={label} />}
              <Typography className={classes.label}>
                {label.text}
              </Typography>
            </LegendLabel>
          </LegendItem>
        )
        })}
      </LegendOrdinal>
    </Box>
  )
};

TimeComparisonLegend.propTypes = {};

export default withStyles(styles)(TimeComparisonLegend);