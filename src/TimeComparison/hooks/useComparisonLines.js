/**
 * A hook that returns the lines used for time comparison charts
 */

export default function useComparisonLines(view) {
  return [
    {
      id: "overall",
      color: "#f00",
      data: [
        { date: new Date("2018-01-01"), value: 0.5 },
        { date: new Date("2018-01-02"), value: 0.6 },
        { date: new Date("2018-01-03"), value: 0.7 },
        { date: new Date("2018-01-04"), value: 0.8 },
        { date: new Date("2018-01-05"), value: 0.9 },
      ],
      visible: true,
    },
  ];
}
