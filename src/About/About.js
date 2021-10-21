import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Typography } from "@material-ui/core";
import { Body, Header, Page } from "../App";
import { Block } from "@hyperobjekt/material-ui-website";

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
const About = (props) => {
  return (
    <Page {...props}>
      <Header sticky stickyOffset={0}>
        <Link to="/">Back to dashboard</Link>
      </Header>
      <Body bgcolor="background.default" flex={1}>
        <Block bgcolor="background.dark" color="common.white" large>
          <Typography variant="h1">About!</Typography>
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
    </Page>
  );
};

About.propTypes = {};

export default About;
