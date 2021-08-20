# NTE Data Module

The NTE data module uses `react-query` to handle fetching and caching data. The hooks below can be used to provided data, extents, and loading status.

## `useBubblesData()`

Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics) containing bubble data (`{extents, geojson}`) and fetch status

## `useChoroplethData()`

Returns a [query object](https://react-query.tanstack.com/guides/queries#query-basics) containing choropleth data (`{extents, geojson}`) and fetch status.

## `useDataExtents()`

Provides an object that has an entry for every data property available. The value corresponding to each entry contains the min, max, and values for the data property.

example:

```js
{
  ef: [1, 450, [1, 10, 200, 450]]; // [min, max, values]
  ...
}
```

## `useDataStatus()`

Provides an object containing overall data status. Status is pulled from the `react-query` status.

example:

```js
{
  isReady: true // true when `choropleth` and `bubble` data collections have successfully loaded,
  bubble: "success",
  choropleth: "success"
}
```
