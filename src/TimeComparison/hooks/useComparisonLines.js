import shallow from "zustand/shallow";
import { useLocationStore } from "../../Locations";
import useLocationSeries from "../../Locations/hooks/useLocationSeries";
import { groupByMonth } from "../../TimeSeries";
import useDashboardStore from "../../Dashboard/hooks/useDashboardStore";
import {
  TIME_COMPARISON_LINE_COLORS,
  TARRANT_COUNTY_IDS,
} from "../../Dashboard/constants";

const splitDataByYear = (years, data) => {
  const dataByYear = {};
  years.forEach((year) => {
    dataByYear[year] = groupByMonth(
      data.filter((d) => d.date.includes(year)),
      "ef"
    );
  });
  return dataByYear;
};

const getYears = (currentYear) => {
  const years = [];
  for (let i = 2019; i <= currentYear; i++) {
    years.push(`${i}`);
  }
  return years;
};

const guideYear = () => {
  let gYear = [];
  for (let i = 11; i >= 0; i--) {
    gYear.push({
      date: `2000-${i < 9 ? `0${i + 1}` : i + 1}-01`,
      ef: 1,
      name: "guide",
    });
  }
  return gYear;
};

const buildDateRange = (latestData) => {
  return [`2019-01-01`, `${latestData}`];
};

const averageForYear = (data) => {
  return data.reduce((prev, curr) => {
    return prev + curr.ef;
  }, 0);
};

/**
 * A hook that returns the lines used for time comparison charts
 * @param {string} featureId - the id of the geography detailed in the panel
 * @param {string} compareToYear - the year to compare to
 * @param {object} labelOverrides - if non-standard labels are desired for a year, e.g {2019: '2019 (Pre-COVID)'}
 * @param {string} view - count or relative, stateful
 */

export default function useComparisonLines(
  featureId,
  compareToYear,
  labelOverrides,
  view
) {
  const colors = TIME_COMPARISON_LINE_COLORS;
  //get all selected locations and the current location in view
  const [locations] = useLocationStore((state) => [
    state.locations,
    state.active,
  ]);
  //get range of all available dates
  const allAvailableDates = useDashboardStore(
    (state) => state.dateRange,
    shallow
  );
  //get range of dates from 2019 to current year
  const dateRange = buildDateRange(allAvailableDates[1]);
  //build array of dates from 2019 to current year
  const years = getYears(dateRange[1].split("-")[0]);
  //get data for all selected locations over the date range (2019-currentYear)
  const locationSeries = useLocationSeries(locations, dateRange);
  //create new array of objects, one for each location, coupling the location id with that locations yearly data
  const series = locationSeries?.map((location) => {
    if (!location?.data?.series) return [];
    const data = location.data.series;
    const dataByYear = splitDataByYear(years, data);
    return {
      id: location.data.id,
      data: dataByYear,
    };
  });
  //find the current location in view
  let activeLocation = series?.find((line) => line?.id === `${featureId}`);
  //if comparing to a specific year, store data for that year for calculation of difference
  const compareToYearData = activeLocation?.data[compareToYear];
  //while data loads (compareToYearData is undefined), assume canCompare will be false. If all values are 0 don't show, if location is in tarrant county don't show
  const canCompare = compareToYearData
    ? !!averageForYear(compareToYearData) &&
      !TARRANT_COUNTY_IDS.find((id) => id === featureId)
    : false;
  let lines = [];
  if (activeLocation?.data) {
    //add guide year
    activeLocation.data["guide"] = guideYear();
    Object.keys(activeLocation?.data).forEach((yearName, yrIndex) => {
      const year = activeLocation.data[yearName];
      //groupbymonth is returning backwards array (december first)
      year.reverse();
      if (
        yearName === compareToYear
          ? canCompare
          : averageForYear(year) > 0 && year.length > 1
      ) {
        lines.push({
          id: `${yearName}`,
          color:
            compareToYear === `${yearName}` && view === "relative"
              ? "#000"
              : colors[yrIndex % colors.length],
          data: year.map((month, mIndex) => {
            const dividedDate = month.date.split("-");
            return {
              date: `2000-${dividedDate[1]}-${dividedDate[2]}`,
              ef:
                view === "relative"
                  ? //don't allow -0%
                    -0.005 < month.ef / compareToYearData[mIndex].ef - 1 < 0
                    ? 0
                    : (month.ef / compareToYearData[mIndex].ef - 1) * 100
                  : month.ef,
              name: `${yearName}`,
            };
          }),
          visible: true,
          dashArray:
            compareToYear === `${yearName}` && view === "relative" ? "4,4" : "",
          legendLabel: labelOverrides[yearName]
            ? labelOverrides[yearName]
            : `${yearName}`,
          opacity: yearName === "guide" ? 0 : 1,
        });
      }
    });
  }
  return { lines, canCompare };
}
