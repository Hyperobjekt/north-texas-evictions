import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import DownloadIcon from "@material-ui/icons/GetApp";

const StyledButton = withStyles({
  root: {
    borderRadius: 6,
    paddingRight: 12,
    paddingLeft: 16,
  },
  label: {
    alignItems: "center",
    justifyContent: "space-between",
  },
})(Button);

/**
 * Downloads a CSV file with the provided csv string data.
 * @param {string} filename - name of the file to download
 * @param {string} csvString - csv string (formatted by csvFormat)
 */
function downloadCsvFile(filename, csvString) {
  // for excel to interpret at UTF-8
  var universalBOM = "\uFEFF";
  // IE11 Download
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(
      new Blob([universalBOM + csvString], {
        type: "text/csv;charset=utf-8;",
      }),
      filename
    );
    return;
  }
  // all other browsers
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," +
      encodeURIComponent(universalBOM + csvString)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

/**
 * Renders a button that will fetch the NTEP data download on press, then save the file.
 */
const DownloadButton = (props) => {
  const [downloading, setDownloading] = React.useState(false);
  const handleDownloadData = () => {
    setDownloading(true);
    fetch(process.env.REACT_APP_DATA_DOWNLOAD)
      .then((response) => response.text())
      .then((data) => {
        downloadCsvFile("NTEP_data_export.csv", data);
        setDownloading(false);
      });
  };
  return (
    <StyledButton
      fullWidth
      variant="contained"
      color="secondary"
      onClick={handleDownloadData}
      {...props}
    >
      <span>Download Raw Data</span>
      {downloading ? (
        <CircularProgress style={{ color: "white" }} size={24} />
      ) : (
        <DownloadIcon />
      )}
    </StyledButton>
  );
};

export default DownloadButton;
