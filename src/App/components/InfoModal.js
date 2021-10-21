import React from "react";
import Modal from "../../Dashboard/components/Modal";
import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  button: {
    height: 42,
  },
}));

const ContentWrapper = withStyles((theme) => ({
  root: {
    "& .MuiTypography-root + .MuiTypography-root": {
      marginTop: theme.spacing(2),
    },
  },
}))(Box);

const ModalContent = () => {
  return (
    <ContentWrapper>
      <Typography color="textSecondary" style={{ fontStyle: "italic" }}>
        The North Texas Eviction Project will release additional features
        monthly. In the meantime, the{" "}
        <Link
          href="https://public.tableau.com/app/profile/cpal/viz/DallasCountyEvictionDashboardDRAFT/DallasCountyEvictions"
          target="_blank"
        >
          Dallas County Eviction Filing Dashboard
        </Link>{" "}
        is still live and might help with data questions that aren't yet
        answered here.
      </Typography>
      <Typography variant="h2">About the Data</Typography>
      <Typography>
        The North Texas Eviction Project features eviction filing and
        demographic data for Dallas, Collin, Denton, and Tarrant Counties. Data
        is currently accessible for eviction filings only: case outcomes are not
        yet available. NTEP provides a geography-based summary of eviction
        filing data and does not include individual case details, such as
        plaintiff or defendant names.
      </Typography>
      <Typography>
        Some geographies may have more or less data available. For example,
        Dallas County data begins in 2017, but Collin and Denton begin in 2019,
        and Tarrant begins in 2020. Only Dallas County has median filing amount
        data available.
      </Typography>
      <Typography>
        Dallas County data is provided by Dallas County. Denton, Collin, and
        Tarrant County data is provided by our friends at January Advisors, a
        Houston-based data science group.
      </Typography>
    </ContentWrapper>
  );
};

const InfoModal = (props) => {
  const classes = useStyles();
  return (
    <Modal
      title="North Texas Eviction Project"
      content={<ModalContent />}
      className="dark"
      classes={classes}
    >
      <Info style={{ fontSize: 16, marginRight: 8 }} />
      About
    </Modal>
  );
};

InfoModal.propTypes = {};

export default InfoModal;
