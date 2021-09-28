import React from "react";
import { Button } from "@material-ui/core";
import { useLang } from "../../Language";

import useTogglePanel from "../../Panel/useTogglePanel";

const ToggleOptions = ({ classes, ...props }) => {
  // prepare language
  const showDataOptionsLabel = useLang(`LABEL_SHOW_DATA_OPTIONS`);

  const handleToggle = useTogglePanel();

  return (
    <Button variant="contained" onClick={handleToggle} {...props}>
      {showDataOptionsLabel}
    </Button>
  );
};

export default ToggleOptions;
