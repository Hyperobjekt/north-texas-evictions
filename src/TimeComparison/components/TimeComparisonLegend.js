import React from "react";
import { Typography, withStyles, Box } from "@material-ui/core";
import { LegendOrdinal, LegendItem, LegendLabel } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import PropTypes from "prop-types";

export const styles = (theme) => ({
  legend: {
    marginTop: "0px !important",
    display: "flex",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    fontWeight: 500,
  },
});

const TimeComparisonLegend = ({
  lines,
  compareToYear,
  view,
  classes,
  ...props
}) => {
  const threshold = scaleOrdinal({
    domain: lines?.map((line) => {
      return line.id;
    }),
    range: lines?.map((line) => {
      return line.color;
    }),
  });

  const Bullet = ({ bulletSize, label }) => {
    return (
      <svg width={bulletSize} height={bulletSize} style={{ margin: "5px 0" }}>
        <circle
          fill={label.value}
          r={bulletSize / 2}
          cx={bulletSize / 2}
          cy={bulletSize / 2}
        />
      </svg>
    );
  };

  const Line = ({ width }) => {
    return (
      <svg height={20} width={width}>
        <line
          stroke-dasharray="2,2"
          x1="0"
          y1="10"
          x2={width}
          y2="10"
          style={{ stroke: "#000", strokeWidth: 2 }}
        />
      </svg>
    );
  };

  return (
    <Box className={classes.legend} {...props}>
      <LegendOrdinal scale={threshold}>
        {(labels) =>
          labels.map((label, index) => {
            return (
              label.text !== "guide" && (
                <LegendItem key={label.index} label={label.text}>
                  <LegendLabel>
                    {view === "relative" && label.text === compareToYear ? (
                      <Line width={12} />
                    ) : (
                      <Bullet bulletSize={8} label={label} />
                    )}
                    <Typography className={classes.label}>
                      {lines[index].legendLabel}
                    </Typography>
                  </LegendLabel>
                </LegendItem>
              )
            );
          })
        }
      </LegendOrdinal>
    </Box>
  );
};

TimeComparisonLegend.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      legendLabel: PropTypes.string,
      color: PropTypes.string,
      dashArray: PropTypes.string,
      id: PropTypes.string,
      visible: PropTypes.bool,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string,
          ef: PropTypes.number,
          name: PropTypes.string,
        })
      ),
    })
  ),
  compareToYear: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimeComparisonLegend);
