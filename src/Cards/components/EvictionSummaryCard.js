import React from "react";
import { Typography } from "@material-ui/core";
import { timeFormat } from "d3-time-format";
import useSummaryData from "../../Data/useSummaryData";
import {
  Card,
  StatsSummary,
  parseDate,
  useDashboardStore,
  useFormatter,
} from "../../Dashboard";
import { useLang } from "../../Language";

const EvictionSummaryCard = (props) => {
  const { data: summary, status } = useSummaryData();
  const dateRange = useDashboardStore((state) => state.dateRange);
  const langKeys = [`SUMMARY_EF`, `SUMMARY_TFA`, `SUMMARY_UPDATED`, `SUMMARY`];
  const [filingsLabel, amountLabel, lastUpdated, summaryTitle] = useLang(
    langKeys,
    {
      date: timeFormat("%b %e, %Y")(parseDate(dateRange[1])),
      dateRange: dateRange.join(" - "),
    }
  );

  const intFormatter = useFormatter("ef");
  const currencyFormatter = useFormatter("mfa");
  const hintKeys = ["HINT_EF", "HINT_TFA"];
  const hintValues = useLang(hintKeys);
  const isReady = status === "success";
  const stats = [
    {
      id: "tfa",
      label: amountLabel,
      value: isReady ? currencyFormatter(summary.amount) : "...",
      hint: hintValues[1],
    },
  ];

  return (
    <Card title={summaryTitle} {...props}>
      <StatsSummary
        value={isReady ? intFormatter(summary.filings) : "..."}
        label={filingsLabel}
        series={isReady ? summary.series : []}
        stats={stats}
      >
        <Typography variant="caption" color="textSecondary">
          {lastUpdated}
        </Typography>
      </StatsSummary>
    </Card>
  );
};

export default EvictionSummaryCard;
