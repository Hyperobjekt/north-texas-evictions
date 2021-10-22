import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import { Body, Header, Page } from "../App";
import { Block } from "@hyperobjekt/material-ui-website";
import clsx from "clsx";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = (theme) => ({
  root:{
  },
  titleContainer: {
    padding: "0px 50px",
    margin: "auto",
    display:"flex",
    flexDirection: "column",
    justifyContent: "center",
    height:"100%",
    width:"100%",
  },
  title:{
    fontSize: theme.typography.pxToRem(60)
  },
  titleBody: {
    paddingTop: 20,
  },
  headerLinkContainer: {
    zIndex: 1,
    position: "sticky",
    top: 64,
    paddingLeft: theme.typography.pxToRem(24),
    paddingBottom: 15,
    background: theme.palette.background.dark,
  },
  footerContainer: {
    display: "flex",
    background: theme.palette.background.dark,
    alignItems: "center",
  },
  link: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    color: theme.palette.primary.main,
    textDecoration: 'none',
    width: "max-content",
    "& svg":{
      transition: "left .1s",
      position: "absolute",
      left: 0
    },
    "& p":{
      paddingLeft: 20,
      fontFamily: `"degular", "Roboto", "Helvetica", "Arial", sans-serif`,
    },
    "&:hover":{
      "& svg":{
        left: theme.typography.pxToRem(-5),
      }
    },
    "&.header": {
      "& svg":{
        height: theme.typography.pxToRem(20),
        width: theme.typography.pxToRem(20),
      },
      "& p":{
        fontSize: theme.typography.pxToRem(20),
      },
    },
    "&.footer": {
      "& svg":{
        height: theme.typography.pxToRem(67),
        width: theme.typography.pxToRem(67),
      },
      "& p":{
        paddingLeft: theme.typography.pxToRem(67),
        fontSize: theme.typography.pxToRem(67),
      },
    },
  },
})

/** Renders a section block with title and content */
const Section = ({ title, children, ...props }) => {
  return (
    <Block large {...props}>
      <Grid container>
        <Grid item xs={12} sm={5} md={4}>
          <Typography variant="h1">{title}</Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          {children}
        </Grid>
      </Grid>
    </Block>
  );
};

/** Renders the about page */
const About = ({props, classes}) => {
  return (
    <Page className={classes.root} {...props}>
      <Header sticky stickyOffset={0}>
      </Header>
      <Box className={classes.headerLinkContainer}>
        <Link className={clsx(classes.link, "header")} to="/">
          <ArrowBackIcon/>
          <Typography>Back to dashboard</Typography>
        </Link>
      </Box>
      <Body bgcolor="background.default" flex={1}>
        <Block bgcolor="background.dark" color="common.white" large>
          <Grid container>
            <Grid item sm={12} sm={6}>
              <Box clone width="100%" textAlign="center">
                <img alt="About" src="./assets/aboutHead.png"/>
              </Box>
            </Grid>
            <Grid item sm={12} sm={6}>
              <Box className={classes.titleContainer}>
                <Typography className={classes.title} variant="h1">About</Typography>
                <Typography className={classes.titleDivider} variant="h1">____</Typography>
                <Typography className={classes.titleBody} variant="body1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
                  nunc eget nunc efficitur efficitur. Nullam euismod, nisl eget
                  consectetur consectetur, nisi nisi aliquet nunc, euismod efficitur
                  nunc nisi euismod nunc. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Donec eu nunc eget nunc efficitur efficitur.
                  Nullam euismod, nisl eget consectetur consectetur, nisi nisi
                  aliquet nunc, euismod efficitur nunc nisi euismod nunc.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Block>
        <Section title="About Evictions" bgcolor="background.default">
          <Box clone maxWidth="36em">
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
              nunc eget nunc efficitur efficitur. Nullam euismod, nisl eget
              consectetur consectetur, nisi nisi aliquet nunc, euismod efficitur
              nunc nisi euismod nunc. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Donec eu nunc eget nunc efficitur efficitur.
              Nullam euismod, nisl eget consectetur consectetur, nisi nisi
              aliquet nunc, euismod efficitur nunc nisi euismod nunc.
            </Typography>
          </Box>
        </Section>
        <Section title="About the Data" bgcolor="background.paper">
          <Box clone maxWidth="36em">
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
              nunc eget nunc efficitur efficitur. Nullam euismod, nisl eget
              consectetur consectetur, nisi nisi aliquet nunc, euismod efficitur
              nunc nisi euismod nunc. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Donec eu nunc eget nunc efficitur efficitur.
              Nullam euismod, nisl eget consectetur consectetur, nisi nisi
              aliquet nunc, euismod efficitur nunc nisi euismod nunc.
            </Typography>
          </Box>
        </Section>
        <Section title="More..." bgcolor="background.default">
          <Box clone maxWidth="36em">
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
              nunc eget nunc efficitur efficitur. Nullam euismod, nisl eget
              consectetur consectetur, nisi nisi aliquet nunc, euismod efficitur
              nunc nisi euismod nunc. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Donec eu nunc eget nunc efficitur efficitur.
              Nullam euismod, nisl eget consectetur consectetur, nisi nisi
              aliquet nunc, euismod efficitur nunc nisi euismod nunc.
            </Typography>
          </Box>
        </Section>
      </Body>
      {/* FOOTER */}
      <Grid container className={classes.footerContainer}>
        <Grid item sm={5} md={4}>
          <img alt="About" src="./assets/aboutFoot.png"/>
        </Grid>
        <Grid item sm={7} md={8}>
          <Box className={classes.footerLinkContainer}>
            <Link className={clsx(classes.link, "footer")} to="/">
              <ArrowBackIcon/>
              <Typography>Back to dashboard</Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Page>
  );
};

About.propTypes = {};

export default withStyles(styles)(About);
