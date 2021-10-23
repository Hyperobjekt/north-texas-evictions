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
  subtitle:{
    fontSize: theme.typography.pxToRem(44)
  },
  titleBody: {
    paddingTop: 20,
  },
  divider: {
    width: 50,
    height: 10,
    marginTop: 20,
  },
  subsection: {
    "& .MuiBox-root": {
      paddingLeft: 0,
      paddingRight: 0,
    },
    "& .HypBlock-visible": {
      "&:first-child": {
        paddingTop: 20
      },
    },
  },
  headerLinkContainer: {
    zIndex: 1,
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
  sectionHead: {
    fontSize: theme.typography.pxToRem(44)
  }
})

/** Renders a section block with title and content */
const Section = ({ title, children, titleStyle, ...props }) => {
  return (
    <Block large {...props}>
      <Grid container>
        <Grid item xs={12} sm={5} md={4}>
          <Typography className={titleStyle} variant="h1">{title}</Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          {children}
        </Grid>
      </Grid>
    </Block>
  );
};

const SectionWithSubsections = ({ title, children, titleStyle, classes, ...props }) => {
  return (
    <Block large {...props}>
      <Grid container>
        <Grid item xs={12} sm={5} md={4}>
          <Typography className={titleStyle} variant="h1">{title}</Typography>
        </Grid>
      </Grid>
      <Box className={classes.divider}>
        <svg viewbox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="5" x2="50" y2="5" stroke="black" />
        </svg>
      </Box>
      <Box className={classes.subsection}>
        {children.length ? 
          children.map((child) => child)
          : children
        }
      </Box>
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
                <Box className={classes.divider}>
                  <svg viewbox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="5" x2="50" y2="5" stroke="white" />
                  </svg>
                </Box>
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
        {/* 1 */}
        <SectionWithSubsections classes={classes} titleStyle={classes.subtitle} title="About Evictions" bgcolor="background.paper">
          <Section title="How does eviction impact kids and their families" bgcolor="background.paper">
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
          <Section title="What is the eviction process?" bgcolor="background.paper">
            <Box clone padding="0px" maxWidth="36em">
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
        </SectionWithSubsections>
        {/* 2 */}
        <Section titleStyle={classes.subtitle} title="About the Data" bgcolor="background.alt">
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
        {/* 3 */}
        <Section titleStyle={classes.subtitle} title="More..." bgcolor="background.paper">
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
