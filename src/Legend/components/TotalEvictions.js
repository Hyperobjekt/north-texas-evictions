import React from "react";
import useSummaryData from "../../Data/useSummaryData";
import useFormatter from "../../Dashboard/hooks/useFormatter";
import Card from "../../Dashboard/components/Card";
import StatBody from "../../Dashboard/components/StatBody";
import { Divider, Typography } from "@material-ui/core";
import LegendRow from "./LegendRow";
import { parseDate, useDashboardStore } from "../../Dashboard";
import { useLang } from "../../Language";
import { timeFormat } from "d3-time-format";

const TotalEvictions = ({ total, series, change, ...props }) => {
  const { data: summary, status } = useSummaryData();
  const dateRange = useDashboardStore((state) => state.dateRange);
  const langKeys = [`SUMMARY_EF`, `SUMMARY_TFA`, `SUMMARY_UPDATED`];
  const [filingsLabel, amountLabel, lastUpdated] = useLang(langKeys);

  const intFormatter = useFormatter("ef");
  const currencyFormatter = useFormatter("mfa");
  const hintKeys = ["HINT_TOTAL_FILINGS", "HINT_TOTAL_AMOUNT"];
  const hintValues = useLang(hintKeys);
  const isReady = status === "success";

  return (
    <Card title={`Summary (Jul 31, 2020 - Sep 24, 2021)`} {...props}>
      <StatBody
        value={isReady ? intFormatter(summary.filings) : "..."}
        extra={filingsLabel}
        series={isReady ? summary.series : []}
      >
        <Divider style={{ margin: "16px -16px 0" }} />
        <LegendRow
          title={amountLabel}
          hint={hintKeys[1] !== hintValues[1] && hintValues[1]}
        >
          <Typography variant="h2">
            {isReady ? currencyFormatter(summary.amount) : "..."}
          </Typography>
        </LegendRow>
        <LegendRow
          title={lastUpdated.replace(
            "{{date}}",
            timeFormat("%b %e, %Y")(parseDate(dateRange[1]))
          )}
        ></LegendRow>
      </StatBody>
    </Card>
  );
};

TotalEvictions.propTypes = {};

export default TotalEvictions;
