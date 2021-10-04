# North Texas Eviction Project 2.0 Specification

## Summary

**Included in this release:**

- [Roadmap](#roadmap)
- [Pinned Locations](#pinned-locations)
- [Detailed Location View](#detailed-location-view)
- [Time Series View](#time-series-view)
- [About Page](#about-page)
- [JP Precinct Regions](#jp-precinct-regions)
- [Basic Analytics](#basic-analytics)
- [Data Loading Notifications](#data-loading-notifications)

**For future release:**

- Time Series Improvements (highlight important dates, etc.)
- Location Comparison
- Data Table
- Export Location Report

## Roadmap

- **Target Release:** November 1, 2021

![](roadmap-v2.png)

## Pinned Locations

- the app should have a list of previously selected locations that contains the location name, a "pin" button, and a "dismiss" button.
  - when there are no previously selected locations, a hint should display that encourages the user to select a location via map or search
- when the "pin" button is pressed, it should toggle an outline of the map that highlights the corresponding location. the highlight should persist through geography changes.
  - each location should have a unique color (TBD)
- when the "dismiss" button is presses, the location should be removed from the previously selected location list and any pinned highlights should be removed.
- the app route should have a query parameter that includes the IDs for all previously selected locations and their "pinned" status (on/off) for direct linking
- when the app loads, any previously selected locations and pinned status should be loaded from the route
- the location panel should also include a toggle that allows the user pin/unpin the corresponding location

See [live prototype](https://deploy-preview-77--north-texas-evictions.netlify.app/) for example:

- click a location
- switch to different region
- toggle on / off in selected locations card

## Detailed Location View

- locations can be "selected" by clicking on the map or search
- when a location is selected:
  - a panel opens with additional information for the corresponding location
  - the corresponding location is highlighted on the map
- the panel contains the following information:
  - location name
  - indication of time range
  - total eviction filings, with a trend line for the selected time range
  - total amount filed in the selected time range
  - median filing amount for the selected time range
  - demographic data (median household income, poverty rate, etc.)
- the panel should have a button that allows the user to toggle on/off "pinned" status (see #60)
- the panel should have a button that allows the user to switch to the corresponding region for the location, if the map is currently on a different region
- the app route should have a query parameter that indicates the selected location (for direct linking)
- when the app loads, the active location should be loaded from the route (if any)

See [live prototype](https://deploy-preview-77--north-texas-evictions.netlify.app/) for example:

- click a location, panel opens

## Time Series View

- in the header:
  - the header has a button group that allows switching between "map view" and "time series view"
  - the placeholder text in the search at the top changes from "find a location" to "add a location"
- in the sidebar:
  - there is a "currently viewing" section that contains the current time series metric and date range
  - there is a "summary" section in time series view that contains the same summary as map view
  - there is a "selected locations" section that contains any locations that have been selected, with the addition of an "all data" entry
    - each location has a toggle that adds / removes the corresponding line from the time series
    - each location has a "dismiss" button that removes the corresponding location from the selected locations and removes the corresponding line from the time series
    - each location has a unique color that corresponds to the line color used on in the chart
- in the visualization area
  - there is a time series chart that displays lines for all selected locations that are toggled on
  - the time series chart displays a heading indicating the current Y axis metric and date range
  - the time series x axis is a date range reflects the time range selected in the "currently viewing" panel
  - the time series y axis is one of the available eviction metrics and dynamically adjusts based on the values of the selected locations
  - on time series hover:
    - a tooltip is shown that reads out the corresponding location name, eviction metric value, and date
    - the active line receives a hovered state
    - a dot appears over the corresponding data point on the line
- route update (URL):

  - the route has a path parameter that indicates the current visualization view (e.g. "map" or "time-series")
  - when the app loads via URL, the corresponding visualization view is activated

See [figma prototype](https://www.figma.com/proto/dkl0IqDVYtMFLVxIlG4vQM/Dashboard?page-id=454%3A1012&node-id=476%3A1025&viewport=307%2C48%2C1&scaling=min-zoom&starting-point-node-id=476%3A1025) for example

## About Page

- the site should have an "about" page containing content provided by the CPAL team
- the page has a unique route that can be linked to directly (e.g. https://northtexasevictions.org/about)

## JP Precinct Regions

- the region selection has an additional option for Justice of the Peace Precincts
- when selecting the "Justice of the Peace Precincts" option, the map updates to show data for this corresponding region

## Basic Analytics

- the app should have google analytics configured for basic tracking
- the app should log a custom event when locations are selected
- the app should log a custom event when selections are made (region, time range, bubble metric, choropleth metric)
- the CPAL team should have access to the analytics dashboard

## Data Loading Notifications

- the CPAL team should receive notification when data updates complete successfully or fail.
