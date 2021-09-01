import React, { useEffect } from "react";
import Dashboard from "../Dashboard";
import Header from "./components/Header";
import useDashboardRoute from "../Dashboard/hooks/useDashboardRoute";
import Search from "./components/Search";

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
        <Search className="dark" placeholder="search" />
      </Header>
      <Dashboard {...defaults} />
    </>
  );
};

App.propTypes = {};

export default App;
