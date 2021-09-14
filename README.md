# North Texas Evictions Project

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Environment variables

You will need to set environment variables in a `.env` file to define the API and GeoJSON endpoints.

Staging environment:

```
REACT_APP_API_ENDPOINT=https://wkubgjbrr2.execute-api.us-east-1.amazonaws.com/
REACT_APP_GEOJSON_ENDPOINT=https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/main/
```

Production environment:

```
REACT_APP_API_ENDPOINT=https://faxkuv0im9.execute-api.us-east-1.amazonaws.com/
REACT_APP_GEOJSON_ENDPOINT=https://raw.githubusercontent.com/childpovertyactionlab/cpal-evictions/production/
```

You will also need to set the following variables for mapbox:

```
REACT_APP_MAPBOX_TOKEN={{api token}}
REACT_APP_MAPBOX_STYLE={{mapbox style url}}
```
