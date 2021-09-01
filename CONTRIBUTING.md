# Contributing to the North Texas Evictions Project

## Summary

This project consists of multiple repos:

- [Hyperobjekt/nte-backend](https://github.com/Hyperobjekt/nte-backend): contains backend infrastructure code and lambda functions for the api
- [childpovertyactionlab/cpal-evictions](https://github.com/childpovertyactionlab/cpal-evictions): this repo contains source data for populating the database in the nte-backend
- [Hyperobjekt/north-texas-evictions](https://github.com/Hyperobjekt/north-texas-evictions) (this repo): contains front end app code

## Common Tasks

### Updating the dataset

New data can be deployed by uploading a new source file to the source data bucket (AWS permissions required).

When a new file is uploaded to the S3 source data, an AWS Lambda function is triggered that clears the database and loads entries from the new source file.

The data file must be formatted as described in the [data dictionary](https://github.com/Hyperobjekt/nte-backend/blob/main/docs).

### Troubleshooting / Confirming the data was updated correctly

You can confirm the data update was successful by logging into the AWS console and navigating to CloudWatch > Log Groups.

In the log groups there will be an entry that contains `NtepStack-LoaderFunction` and looks something like this:

```
/aws/lambda/NtepStack-LoaderFunction{SOME_CHARACTERS}
```

Select this log group, then click on the most recent log stream in the list of log streams. Within this log stream you should see information indicating the insert was successful.

```
2021-08-10T17:54:52.481-07:00	2021-08-11T00:54:52.480Z 252d37f5-db59-4b81-b7b5-b69c05e97aba INFO setting up tables
...
2021-08-11T00:57:39.675Z 252d37f5-db59-4b81-b7b5-b69c05e97aba INFO ... 209000 rows inserted
...
2021-08-10T17:57:39.714-07:00	2021-08-11T00:57:39.714Z 252d37f5-db59-4b81-b7b5-b69c05e97aba INFO finished inserting data
```

If there were any problems loading the dataset, you will see errors in the log and can troubleshoot based on those.

### Deploying the front end app

The front end app is automatically deployed via Netlify when new code is commited to the following branches:

- `production`: live version of the site at north-texas-evictions.netlify.app
- `staging`: staging version of the site at staging--north-texas-evictions.netlify.app
- `development`: development version of the site at development--north-texas-evictions.netlify.app

See the development workflow in the Hyperobjekt docs for more details.

View the netlify build logs if you need to troubleshoot a build.
