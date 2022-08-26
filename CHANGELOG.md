# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.3.0] - 2022-08-26
- feat: add school attendance zones
- fix: locations not loading from url params
- fix: location card controls obscured on sm
## [3.2.2] - 2022-03-01

- fix: save the data download to disk instead of linking
- fix: do not include monthly totals for the current month
- fix: move events legend above summary
- content: update about intro

## [3.2.1] - 2022-02-08

- fix: no longer crashes when manually typing date

## [3.2.0] - 2022-02-07

- feat: show events on the time series
- feat: add download data button
- fix: adjust time series styles so 0 is always visible
- fix: parse dates consistently (with `parseDate` util)

## [3.1.1] - 2022-02-01

- fix: update fillSeries util to be inclusive of end date (fixes monthly totals)

## [3.1.0] - 2022-01-12

- feat: show sub-precincts on time series
- feat: show time comparison in location panel
- feat: add toggle for all data vs. selected locations

## [3.0.0] - 2021-12-20

- feat: add locations comparison
- feat: add eviction hotspots card
- fix: update language
- fix: adjust tooltip positioning

## [2.0.1] - 2021-11-12

- fix: monthly aggregation on time series for multi-year time ranges
- fix: add years to time series ticks for multi-year time ranges

## [2.0.0] - 2021-11-01

- switch to new card based layout
- add time series view
- allow location selection and toggle visibility on / off
- add new filing metrics (7 day average, 30 day average)
- add about page
- add analytics

## [1.0.1] - 2021-09-27

- add "since 2020" shortcut for dates
- add "renter households" to tooltip
- update metric labels

## [1.0.0] - 2021-09-16

- initial MVP release

## [0.1.0] - 2021-09-09

- initial release for demo
