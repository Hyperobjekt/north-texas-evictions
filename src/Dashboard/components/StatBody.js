import React from "react";
import { Box, Typography } from "@material-ui/core";
import { Stack } from "@hyperobjekt/material-ui-website";
import TrendLine from "../../Legend/components/TrendLine";

const StatBody = ({ value, series, extra, children, ...props }) => {
  return (
    <Stack direction="vertical" alignItems="stretch" between="md" {...props}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        flex={1}
      >
        <Box>
          <Typography variant="h1">{value}</Typography>
          <Typography
            component="p"
            variant="caption"
            color="textSecondary"
            style={{ lineHeight: 1.2, marginTop: 8 }}
          >
            {extra}
          </Typography>
        </Box>
        {series && <TrendLine data={series} height={48} width={144} />}
      </Box>
      {children}
    </Stack>
  );
};

export default StatBody;
