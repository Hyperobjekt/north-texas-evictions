import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Dashboard from "../Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { TextField } from "@material-ui/core";
import useDashboardRoute from "../Dashboard/hooks/useDashboardRoute";

const App = (props) => {
  const { route, getCurrentParams } = useDashboardRoute();

  // load defaults from current route
  const [defaults] = React.useState(getCurrentParams());

  // update route on state changes
  useEffect(() => {
    window.history && window.history.replaceState(null, null, "?" + route);
  }, [route]);

  return (
    <>
      <Header>
        <TextField placeholder="search" />
      </Header>
      <Dashboard {...defaults} />
      <Footer />
    </>
  );
};

App.propTypes = {};

export default App;
