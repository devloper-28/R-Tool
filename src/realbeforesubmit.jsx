import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [responseData, setResponseData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = responseData?.recordPerPage || 10; // Default to 10 items per page

  useEffect(() => {
    // Define the API URL
    const apiUrl = "http://192.168.100.187:8080/Report/list";

    // Make the Axios GET request to fetch data
    axios
      .post(apiUrl, {
        reportId: 2,
        param1: "2023",
        param2: "4",
      })
      .then((response) => {
        setResponseData(response.data.responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!responseData) {
    return <div>Loading...</div>;
  }

  const reportList = responseData.getReportList || [];
  const columnDetails = responseData.tblReportDetails[0].columnDetails;
  const columns = columnDetails.split(" ~ ").map((column) => {
    const [, , alignment] = column.split(":"); // Extract alignment (L or C)
    return alignment;
  });

  // Create an array of column names from columnDetails
  const columnNames = columnDetails
    .split(" ~ ")
    .map((column) => column.split(":")[0]);

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = reportList.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(reportList.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <h2>{responseData.reportHeading}</h2>
      <div>
        {/* Render controls based on tblReportSearchColumnDetails */}
        {responseData.tblReportSearchColumnDetails.map((columnDetail) => (
          <div key={columnDetail.columnId}>
            <label>{columnDetail.columnName}</label>
            {console.log(columnDetail.controlType, "a")}
            {columnDetail &&
            columnDetail.tblReportControlMaster &&
            columnDetail.tblReportControlMaster[0] &&
            columnDetail.tblReportControlMaster[0].controlType === "combo" ? (
              <>
                <select>
                  {columnDetail.tblReportControlMaster[0].tblReportControlDetail.map(
                    (controlDetail) => (
                      <option
                        key={controlDetail.reportControlDetailId}
                        value={controlDetail.controlValue}
                      >
                        {controlDetail.lang1}
                      </option>
                    )
                  )}
                </select>
              </>
            ) : (
              <input type="text" />
            )}
          </div>
        ))}
        
      </div>

      <table>
        <thead>
          <tr>
            {columnNames.map((columnName, index) => (
              <th
                key={index}
                style={{
                  textAlign: columns[index] === "C" ? "center" : "left",
                }}
              >
                {columnName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itemsToDisplay.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((alignment, columnIndex) => (
                <td
                  key={columnIndex}
                  style={{ textAlign: alignment === "C" ? "center" : "left" }}
                >
                  {item[`fieldValue${columnIndex + 1}`]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
