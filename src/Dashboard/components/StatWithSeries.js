import React from "react";
import { Box, Tooltip, Typography } from "@material-ui/core";
import TrendLine from "../../TimeSeries/components/TrendLine";
import { useLang } from "../../Language";

const StatWithSeries = ({ value, series, label, interval, ...props }) => {
  const tooltipLang = useLang(`HINT_${interval}`);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="flex-end"
      flex={1}
      {...props}
    >
      <Box>
        <Typography variant="h1">{value || "..."}</Typography>
        <Typography
          component="p"
          variant="caption"
          color="textSecondary"
          style={{ lineHeight: 1.2, marginTop: 8 }}
        >
          {label}
        </Typography>
      </Box>
      <Tooltip title={tooltipLang} arrow placement="right">
        <div>
          <TrendLine data={series} height={48} width={144} />
        </div>
      </Tooltip>
    </Box>
  );
};

export default StatWithSeries;
