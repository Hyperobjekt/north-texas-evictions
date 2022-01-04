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
    ...props
}) => {

    const threshold = scaleOrdinal({
        domain: years,
        range: colors,
    });

  return (
    <Box
        className={classes.legend}
    >
        <LegendOrdinal 
            scale={threshold}
        >
            {(labels) => labels.map((label) => {
            const size = 15;
            return (
                <LegendItem key={label.index} label={label}>
                <LegendLabel>
                    <svg width={size} height={size} style={{ margin: '5px 0' }}>
                    <circle fill={label.value} r={size / 2} cx={size / 2} cy={size / 2} />
                    </svg>
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