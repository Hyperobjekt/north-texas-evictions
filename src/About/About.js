import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import { Box, Grid, Typography, makeStyles } from "@material-ui/core";
import { Body, Header, Page } from "../App";
import { Block } from "@hyperobjekt/material-ui-website";
import clsx from "clsx";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const styles = (theme) => ({
  root:{
  },
  titleContainer: {
    padding: "0px 50px",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
    },
    margin: "auto",
    display:"flex",
    flexDirection: "column",
    justifyContent: "center",
    height:"100%",
    width:"100%",
  },
  title:{
    fontSize: theme.typography.pxToRem(60),
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
  section: {
    "& .MuiBox-root": {
      paddingLeft: 0,
      paddingRight: 0,
    },
    "& .HypBlock-root": {
      paddingBottom: 0,
      "& h1": {
        paddingBottom: 20,
      },
      "&:first-child": {
        paddingTop: 20
      },
    },
  },
  headerLinkContainer: {
    zIndex: 1,
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.typography.pxToRem(24),
    },
    paddingLeft: theme.typography.pxToRem(16),
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
        height: '10vw',
        width: '10vw',
        [theme.breakpoints.up("md")]: {
          height: '7vw',
          width: '7vw',
        },
      },
      "& p":{
        paddingLeft: '10vw',
        fontSize: '10vw',
        [theme.breakpoints.up("md")]: {
          paddingLeft: '7vw',
          fontSize: '7vw',
        },
      },
    },
  },
  headerImg: {
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  footerImg: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  list: {
    paddingLeft: 13,
    "& li": {
      paddingTop: 20,
    },
  },
})

/** Renders a section block with title and content */
const Section = ({ title, children, titleStyle, ...props }) => {
  const sectionStyles = makeStyles(theme => ({
    title:{
      paddingBottom: 20,
    },
    section: {
      paddingRight: 20,
    },
  }))
  return (
    <Block large {...props}>
      <Grid container>
        <Grid item className={sectionStyles().section} xs={12} sm={5} md={4}>
          <Typography className={clsx(titleStyle, sectionStyles().title)} variant="h1">{title}</Typography>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          {children}
        </Grid>
      </Grid>
    </Block>
  );
};

const SectionWithSubsections = ({ title, children, titleStyle, ...props }) => {
  const subsectionStyles = makeStyles(theme => ({
    root: {
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
      "& .HypBlock-root": {
        paddingBottom: 0,
        "& h1": {
          paddingBottom: 20,
        },
        "&:first-child": {
          paddingTop: 20
        },
      },
    },
  }))
  return (
    <Block className={subsectionStyles().root} large {...props}>
      <Grid container>
        <Grid item xs={12} sm={5} md={4}>
          <Typography className={titleStyle} variant="h1">{title}</Typography>
        </Grid>
      </Grid>
      <Box className={subsectionStyles().divider}>
        <svg viewBox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="5" x2="50" y2="5" stroke="black" />
        </svg>
      </Box>
      <Box className={subsectionStyles().subsection}>
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
            <Grid className={classes.headerImg} item sm={6}>
              <Box clone width="100%" textAlign="center">
                <img alt="About" src="./assets/aboutHead.png"/>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className={classes.titleContainer}>
                <Typography className={classes.title} variant="h1">About</Typography>
                <Box className={classes.divider}>
                  <svg viewbox="0 0 50 10" xmlns="http://www.w3.org/2000/svg">
                    <line x1="0" y1="5" x2="50" y2="5" stroke="white" />
                  </svg>
                </Box>
                <Typography className={classes.titleBody} variant="body1">
                  The North Texas Eviction Project will release additional features
                  monthly. In the meantime, the <Link>Dallas County Eviction Filling Dashboard</Link>
                  is still live and might help with data questions that aren't yet answered here.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Block>
        {/* 1 */}
        <SectionWithSubsections titleStyle={classes.subtitle} title="About Evictions" bgcolor="background.paper">
          <Section title="How does eviction impact kids and their families" bgcolor="background.paper">
            <Box clone maxWidth="36em">
              <Typography>
                Eviction has a devastating impact on families: involuntary displacement leads to 
                greater material hardship, poorer health and avoidable healthcare costs for children 
                and their mothers, negative impacts on children’s academic achievement, and greater 
                depression and parental stress. Eviction disproportionately impacts communities of 
                color, and the likelihood of receiving an eviction judgment is highest for mothers 
                with children.
              </Typography>
            </Box>
          </Section>
          <Section title="What is the eviction process?" bgcolor="background.paper">
            <Box clone padding="0px" maxWidth="36em">
              <Box>
                <Typography>
                  An eviction is the legal process by which a landlord removes a tenant and their 
                  possessions from the landlord’s property. Eviction generally follows these steps 
                  (adapted from the Texas State Law Library here):
                </Typography>
                <ul className={classes.list}>
                  <li>
                    <Typography>
                      The landloard provides a written Notice to Vacate to the tennt. The landlord must
                      give the tenant at least three days to move out, unless otherwise stated in the lease.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      If the tenant has not moved out by the appointed time, then the landlord files an 
                      eviction suit with the Justice of the Peace Court. Note: The North Texas Eviction 
                      Project reports on eviction filings only; data featured on the site does not extend 
                      beyond this step in the eviction process.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      A hearing takes place in the Justice of the Peace Court 10 or more days after the suit is 
                      filed.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      During the hearing, the judge considers the facts of the case and issues a 
                      judgment. No further action can take place for five days so that the tenant or 
                      landlord can appeal, if desired.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      If the judge rules in favor of the landlord and the tenant chooses not to appeal, 
                      then the tenant must vacate the property. If the tenant does not move out within 
                      the appointed time, then the landlord can ask the judge for a Writ of Possession 
                      to remove the tenant’s belongings from the property.
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      The constable executing the Writ of Possession must post a 24-hour notice 
                      beforehand.
                    </Typography>
                  </li>   
                </ul>
              </Box>
            </Box>
          </Section>
        </SectionWithSubsections>
        {/* 2 */}
        <Section titleStyle={classes.subtitle} title="About the Data" bgcolor="background.alt">
          <Box clone maxWidth="36em">
            <Typography>
              The North Texas Eviction Project features eviction filing and demographic data for 
              Dallas, Collin, Denton, and Tarrant Counties. Data is currently accessible for eviction 
              filings only: case outcomes are not yet available. NTEP provides a geography-based 
              summary of eviction filing data and does not include individual case details, such as 
              plaintiff or defendant names. 
              <br/>
              <br/>
              Some geographies may have more or less data available. 
              For example, Dallas County data begins in 2017, but Collin and Denton begin in 2019, 
              and Tarrant begins in 2020. Only Dallas County has median filing amount data available.
              <br/>
              <br/>
              Dallas County data is provided by Dallas County. Denton, Collin, and Tarrant County data 
              is provided by our friends at January Advisors, a Houston-based data science group.
            </Typography>
          </Box>
        </Section>
        {/* 3 */}
        <Section titleStyle={classes.subtitle} title="More..." bgcolor="background.paper">
          <Box clone maxWidth="36em">
            <Box>
              <Typography>
                NTEP makes local eviction data accessible and actionable so that frontline providers, 
                government and agency staff, and policymakers can activate upstream eviction solutions 
                to keep families securely housed.
                <br/>
                <br/>
                NTEP data has been used to:
              </Typography>
              <ul className={classes.list}>
                <li>
                  <Typography>
                    Bring awareness to the scope and scale of eviction in our community.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Select eviction "hotspots" - neighborhoods with a high density of eviction
                    filings - to host rent relief pop-up events and to conduct tenant/landlord 
                    outreach and education.
                  </Typography>
                </li>
                <li>
                  <Typography>
                    Compare where evicitions are happening to where rent relief is going to ensure
                    help is administered in the right places.
                  </Typography>
                </li>
              </ul>
            </Box>
          </Box>
        </Section>
      </Body>
      {/* FOOTER */}
      <Grid container className={classes.footerContainer}>
        <Grid className={classes.footerImg} item sm={5} md={3}>
          <img alt="About" src="./assets/aboutFoot.png"/>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
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
