import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import PrintableTable from "./printTable";
import { usePrint } from "./PrintDataTable";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import MultiSelectDropdown from "./MultiSelectDropdown";

const App = () => {
  const [isPrintAllowed, setIsPrintAllowed] = useState(false);
  const [isExcelExportAllowed, setIsExcelExportAllowed] = useState(false);
  const { printContent } = usePrint();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [responseData, setResponseData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = responseData?.recordPerPage || 10;
  const [inputValues, setInputValues] = useState({});
  const [selectedComboValues, setSelectedComboValues] = useState({});
  const [dateType, setDateType] = useState("");
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    // Define the API URL
    const apiUrl = "http://192.168.100.187:9091/Report/list";

    // Make the Axios GET request to fetch data
    axios
      .post(apiUrl, {
        reportId: 3,
        param1: "",
        param2: "",
        condition: "",
      })
      .then((response) => {
        setResponseData(response.data.responseData);
        setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
        setIsExcelExportAllowed(
          response.data.responseData.excelRequired === "Y"
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleInputChange = (e, selectFieldName) => {
    const { value } = e.target;
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [selectFieldName]: value,
    }));
  };
  const handlePrint = (e) => {
    e.preventDefault();
    printContent("table-content");
    //   // Close the print window
    //   // printWindow.close();
  };

  // const handleComboChange = (e, columnDetail) => {
  //   const { value } = e.target;
  //   setSelectedComboValues((prevComboValues) => ({
  //     ...prevComboValues,
  //     [columnDetail.selectFieldName]: value, // Use selectFieldName as the key
  //   }));
  // };
  const handleComboChange = (e, columnDetail) => {
    const { value } = e.target;
    setSelectedComboValues((prevComboValues) => ({
      ...prevComboValues,
      [columnDetail.selectFieldName]: value, // Use selectFieldName as the key
    }));
  };
  const handleFormSubmit = () => {
    // Initialize an array to store conditions
    const conditions = [];

    // Iterate over tblReportSearchColumnDetails to build conditions
    responseData.tblReportSearchColumnDetails.forEach((columnDetail) => {
      const { selectFieldName, controlType } = columnDetail;
      const inputValue = inputValues[selectFieldName];
      const selectedComboValue = selectedComboValues[selectFieldName];

      if (controlType === "tab" && inputValue) {
        // For input fields (controlType === "tab"), add condition to array
        conditions.push(`${selectFieldName}='${inputValue}'`);
      } else if (controlType === "combo" && selectedComboValue) {
        // For combo boxes (controlType === "combo"), add condition to array
        conditions.push(`${selectFieldName}='${selectedComboValue}'`);
      }
    });

    // console.log("Input Values:");
    // console.log("Selected Combo Values:");
    // console.log("Combined Conditions:", combinedConditions);

    // Show the alert with the combined conditions

    let fildData = responseData.tblReportSearchColumnDetails.filter(
      (ele) => ele.datatype === "Date"
    )[0];

    let data = {};

    switch (dateType) {
      case "equal":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103) = convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "notEqual":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103)  != convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "less":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103)  < convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "lessOrEqual":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103)  <= convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "greater":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103)  > convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "greaterOrEqual":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${fildData.selectFieldName},103)  >= convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103)`;
        break;
      case "between":
        data[fildData.selectFieldName] = `convert(${
          fildData.tblReportControlMaster[0].controlType
        },${
          responseData?.tblReportSearchColumnDetails?.at(0)
            ?.tblReportControlMaster[0].controlType
        },103) between convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "From"]},103) and convert(${
          fildData.tblReportControlMaster[0].controlType
        },${inputValues[fildData.selectFieldName + "To"]},103)`;
        break;
      default: {
        console.log("error");
      }
    }

    delete inputValues.buyersPromptDateFrom;
    delete inputValues.buyersPromptDateTo;
    inputValues.buyersPromptDate = data.buyersPromptDate;

    // Join conditions with 'and' if there are multiple conditions
    Object.keys(inputValues).map((ele, index) =>
      ele !== "" ? (ele !== undefined ? setFlag(true) : "") : setFlag(false)
    );
    const combinedConditions = Object.keys(inputValues)
      .map((ele, index) =>
        ele !== "" && ele !== undefined
          ? ele + "=" + `${Object.values(inputValues)[index]}`
          : ""
      )
      .concat(Object.values(selectedComboValues))
      .join(" and ");

    // alert(combinedConditions);
    // console.log(inputValues, data, selectedOptions);

    const apiUrl = "http://192.168.100.187:9091/Report/list";

    // Make the Axios GET request to fetch data
    // axios
    //   .post(apiUrl, {
    //     reportId: 3,
    //     param1: "",
    //     param2: "",
    //     condition: flag
    //       ? combinedConditions + " and " + selectedOptions.length > 0
    //         ? `auctionCenterId in (${selectedOptions
    //             .map((ele) => ele.value)
    //             .join()})`
    //         : ""
    //       : "",
    //   })
    //   .then((response) => {
    //     setResponseData(response.data.responseData);
    //     setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
    //     setIsExcelExportAllowed(
    //       response.data.responseData.excelRequired === "Y"
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
    // axios
    //   .post(apiUrl, {
    //     reportId: 3,
    //     param1: "",
    //     param2: "",
    //     condition:
    //       flag === true
    //         ? combinedConditions + selectedOptions.length > 0
    //           ? ` and auctionCenterId in (${selectedOptions
    //               .map((ele) => ele.value)
    //               .join()})`
    //           : ""
    //         : "",
    //   })
    //   .then((response) => {
    //     setResponseData(response.data.responseData);
    //     setIsPrintAllowed(response.data.responseData.isPrintAllowed === 1);
    //     setIsExcelExportAllowed(
    //       response.data.responseData.excelRequired === "Y"
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error making API request:", error);
    //   });

    console.log(
      // inputValues,
      flag
        ? combinedConditions +
            "and" +
            `auctionCenterId in (${selectedOptions
              .map((ele) => ele.value)
              .join()})`
        : ""
      // data
    );
  };

  const reportList = responseData?.getReportList || [];
  const columnDetails = responseData?.tblReportDetails[0].columnDetails;
  const columns = columnDetails?.split(" ~ ").map((column) => {
    const [, , alignment] = column?.split(":"); // Extract alignment (L or C)
    return alignment;
  });

  // Create an array of column names from columnDetails
  const columnNames = columnDetails
    ?.split(" ~ ")
    ?.map((column) => column?.split(":")[0]);

  // Calculate start and end indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = reportList.slice(startIndex, endIndex);

  // Calculate total number of pages
  const totalPages = Math.ceil(reportList.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  if (!responseData) {
    return <div>Loading...</div>;
  }
  const handleExcelExport = () => {
    // Convert your data to an array of arrays
    const table = document.getElementById("table-content");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, responseData?.reportHeading + ".xlsx");
  };

  return (
    <div>
      <h2>{responseData?.reportHeading}</h2>
      <div>
        {/* Render controls based on tblReportSearchColumnDetails */}
        {responseData?.tblReportSearchColumnDetails?.map((columnDetail) => (
          <div key={columnDetail.columnId}>
            <label>{columnDetail.columnName}</label>
            {columnDetail &&
            columnDetail.tblReportControlMaster &&
            columnDetail.tblReportControlMaster[0] &&
            columnDetail.tblReportControlMaster[0].controlType === "combo" ? (
              <select onChange={(e) => handleComboChange(e, columnDetail)}>
                <option disabled selected>
                  {`Select ${columnDetail.columnName.condition}`}
                </option>
                {columnDetail.tblReportControlMaster[0].tblReportControlDetail?.map(
                  (controlDetail) => (
                    <option
                      key={controlDetail.reportControlDetailId}
                      value={controlDetail.condition}
                    >
                      {controlDetail.lang1}
                    </option>
                  )
                )}
              </select>
            ) : columnDetail.tblReportControlMaster[0].controlType === "date" ||
              columnDetail.tblReportControlMaster[0].controlType ===
                "datetime" ? (
              <>
                <select onChange={(e) => setDateType(e.target.value)}>
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not Equal</option>
                  <option value="less">Less</option>
                  <option value="lessOrEqual">Less or Equal</option>
                  <option value="greater">Greater</option>
                  <option value="greaterOrEqual">Greater or Equal</option>
                  <option value="between">Between</option>
                </select>
                <input
                  type={
                    columnDetail.tblReportControlMaster[0].controlType ===
                    "datetime"
                      ? "datetime-local"
                      : "date"
                  }
                  onChange={(e) =>
                    handleInputChange(e, columnDetail.selectFieldName + "From")
                  }
                />
                {dateType === "between" ? (
                  <input
                    type={
                      columnDetail.tblReportControlMaster[0].controlType ===
                      "datetime"
                        ? "datetime-local"
                        : "date"
                    }
                    onChange={(e) =>
                      handleInputChange(e, columnDetail.selectFieldName + "To")
                    }
                  />
                ) : (
                  ""
                )}
              </>
            ) : columnDetail.tblReportControlMaster[0].controlType ===
              "multiselect" ? (
              <MultiSelectDropdown
                optionsList={columnDetail.tblReportControlMaster[0]}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
              />
            ) : (
              <input
                type="text"
                onChange={(e) =>
                  handleInputChange(e, columnDetail.selectFieldName)
                }
              />
            )}
          </div>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            {columnNames?.map((columnName, index) => (
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
          {itemsToDisplay?.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns?.map((alignment, columnIndex) => (
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

      <div id="table-content" style={{ display: "none" }}>
        <PrintableTable columns={columnNames} data={itemsToDisplay} />
      </div>

      {/* Submit button */}
      <button onClick={handleFormSubmit}>Submit</button>
      <div>
        {/* Render Print and Excel Export buttons based on conditions */}
        {isPrintAllowed && (
          <button
            onClick={() =>
              printContent("table-content", responseData?.reportHeading)
            }
          >
            Print
          </button>
        )}
        {isExcelExportAllowed && (
          <button onClick={handleExcelExport}>Export to Excel</button>
        )}
      </div>
    </div>
  );
};

export default App;
