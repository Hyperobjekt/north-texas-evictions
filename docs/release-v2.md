# North Texas Eviction Project 2.0

## Summary

| Feature                                                   | Priority | Effort | Include in 2.0 |
| --------------------------------------------------------- | -------- | ------ | -------------- |
| [Detailed Location View](#detailed-location-view)         | 1        | 13     | yes            |
| [Filtering within a region](#filtering-within-a-region)   | 1        | 8      | yes            |
| [Improve time series](#improve-time-series)               | 1        | 40     | yes            |
| [Region Adjustments](#region-adjustments)                 | 2        | 5      | yes            |
| [Location Comparison](#location-comparison)               | 3        | 21     | no             |
| [Table + Export](#table--export)                          | 2        | 40     | no             |
| [Complementary Page](#complementary-page)                 | 1        | 5      | yes            |
| [Usage Analytics](#usage-analytics)                       | 3        | 3      | yes            |
| [~~Case Management Tool~~](#case-management-tool)         | -        | -      | -              |
| [~~Dynamic Demographic Data~~](#dynamic-demographic-data) | -        | -      | -              |

\*action items for CPAL team

## Detailed Location View

_Request from initial scope document:_

> The website should display change in eviction filings over time for a selected geography. E.g., a user might want to know how many evictions were filed in the City of Dallas in 2020 compared to 2019 or how the eviction filing rate has trended in a particular zip code since 2017.

**Discussion**

- what should the detailed view contain?

**Notes**

- list of all eviction metrics (# of filings, rate, total amount, median amount)
- time series for all eviction metrics (see above)
- list of all available demographic metrics
- filter within region

## Filtering within a region

_Request from Ashley via email:_

> for the County, City, and Council view, I wish there were a way to isolate the geography I'm interested in and take a closer look. E.g., let's say I'm interested in the City of Dallas. In the City view, I get a summary for the City but can't drill down further without losing the shape outline of the city. If I turn on census tracts, which shows me more granular data, I lose the outline of the City. In a perfect world, it would be neat if, in the County, City, or Council view, a user could click on a geography they're interested in and the geography would open in a new window with the option to then show census tracts or zip codes within the selected geography. Or, if a separate window wouldn't work, I'd love to at least be able to turn on a shape outline of a geography while, simultaneously, taking a closer look at the zips and census tracts within the outline.

**Discussion**

- when viewing a "detailed view" for a location, we could add buttons to "view census tracts within this region"
- which regions contain other regions? (e.g. how to determine which tracts fall within zip code boundaries)

**Notes**

- some geographies do not cleanly match up, so instead of filtering we could show outline of the geography (e.g. show a zip code outline when viewing tracts)
  - "pin" an outline to the map

## Improve time series

_Request from meeting:_

> - the time series would be more effective if it were larger, and included some labelling around dates and values for the axis.
> - interaction may also help the user pull out important points and values
> - the time series would be a good entry point into the data

**Discussion**

- should we change the legend design to accomodate this?
- what would using the time series as an entry point look like?

**Notes**

- might be better to use weekly to smooth out time series
  - duration changes based on total time range (eg. daily for < 30 days, weekly for > 90 days, etc.)
- interaction via tooltip to show date and value as they hover the line
- larger version of time series as its own panel

**Future Release**

- tell story between events that happen and what that looks like with evictions (eg. end of moratorium)
  - perhaps on detailed view, use larger view with event overlays
- entry page with data summary via time series.
- potential for multiple time range comparisons, identifying those interesting ranges

## Region Adjustments

_Request from initial scope document:_

> The website should have a map feature that can sort/display eviction filing data to suit the user’s needs. The data should be able to be displayed at the following levels:
>
> - ✅ County (assuming inclusion of Collin and Denton)
> - ✅ City
> - ❓ Justice of the Peace Precinct (and Court?)
> - ✅ City Council District
> - ✅ Zip Code
> - ✅ Census Tract
> - ❓ Block Group (Eviction Lab goes to this level)

_Request from Ashley via email:_

> I wonder if the JP Courts should be a drop-down in the "Region" instead of its own thing. It's a little confusing that selection of JP court is separate. Owen, do we have the shape files for the JP court jurisdictions in the other counties? Is this why it's a separate thing?

**Discussion**

- are the Justice of the Peace Precinct and Block group regions still desired?
- are there adjustments needed to the current court filtering functionality?

**Notes**

- limited JP boundaries for now, add region once available and drop court filter
- no block group level
- **ACTION ITEM: CPAL Team to provide JP court geojson shape files**

## Location Comparison

_Request from initial scope document:_

> The website should allow the user to compare two or more geographies side-by-side.

**Discussion**

- which metrics are most important for comparison? (e.g. # of filings, filing rate, median amount filed, total amount filed)
- are side-by-side time series acceptable, or should comparison have multiple lines on chart?

**Notes / Future Release**

- comparison importance:
  - filing rate comparison
  - if showing counts (add # of rental house holds, pop, size, etc)
  - filing rates of smaller regions vs filing rate of larger
  - telling stories between high eviction vs low eviction areas
- both on same time series for rates (larger time series view)

## Table + Export

_From Michael via email:_

> One of my main thoughts has to do with maybe a longer-term addition to the site, but I would love the ability to allow users to select multiple geographies and have it present a table that can be exported summarizing evictions across specific date ranges (by month, week etc.) for their personal use.

**Discussion**

- can the CPAL team provide a sample of what this export should look like? (e.g sample csv file)

**Notes / Future**

- could tie into location comparison
- export data or pdf (location based)
- map snapshot
- **ACTION ITEM: CPAL team to provide sample of what export should contain**

## Complementary Page

_Request from initial scope document:_

> - About eviction
>   - What is the eviction process?
>   - How does eviction impact kids and their families?
> - About the data/methods/FAQ
> - How to use the data / applications of the data

**Discussion**

- can the CPAL team provide the content for these pages?

**Notes**

- one page content, integrated within the tool.
- **ACTION ITEM: CPAL team to provide content**

## Usage Analytics

_From lane:_

> no requests for user tracking have been made so far, but we can add some if there is interest in seeing how users are using the tool (most common metrics, areas, date ranges, etc.)

**Discussion**

- is this desired? what usage data would be most helpful?

**Notes**

looking to track basic usage for now.

- zip code level clicks could be interesting (clicked locations)
- determine if people are ignoring certain eviction hotspots

## ~~Case Management Tool~~

_Request from initial scope document:_

> The website should also have a back-end case management tool that displays case-level information and can be accessed by authorized users (e.g., rental and legal assistance providers). This is a secondary priority and will depend on buy-in from frontline providers.

**Discussion**

- likely out of scope for this release, just want to keep it on the radar if needed.

**Notes**

- **deprioritized, currently using sheets, not high demand**

## ~~Dynamic Demographic Data~~

_Request from initial scope document:_

> The website should allow the user to select a specific period of time to view eviction filing data. This would include using demographic data linked to the specific time period (when available, like Eviction Lab)

**Discussion**

- do we want do adjust demographic data to display based on time range? if so, how should this be handled?

**Notes**

- **no longer required**
