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
    fontWeight: 500,
  }
});

const TimeComparisonLegend = ({
  years,
  legendLabels,
  colors,
  compareToYear,
  view,
  classes,
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

  const Line = ({width}) => {
    return(
      <svg height={20} width={width}>
        <line stroke-dasharray="2,2" x1="0" y1="10" x2={width} y2="10" style={{stroke: '#000', strokeWidth: 2}}/>
      </svg>
    )
  }

  console.log(view)
  return (
    <Box className={classes.legend}>
      <LegendOrdinal scale={threshold}>
        {(labels) => labels.map((label, index) => {
        return (
          <LegendItem key={label.index} label={label.text}>
            <LegendLabel>
              {view === 'relative' && label.text === compareToYear ? <Line width={12} /> : <Bullet bulletSize={8} label={label} />}
              <Typography className={classes.label}>
                {legendLabels[index]}
              </Typography>
            </LegendLabel>
          </LegendItem>
        )
        })}
      </LegendOrdinal>
    </Box>
  )
};

TimeComparisonLegend.propTypes = {
  years: PropTypes.arrayOf(PropTypes.string).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  compareToYear: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimeComparisonLegend);