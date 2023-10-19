import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

const App2 = () => {
  const auctioneerOptions = ["Auctioneer 1", "Auctioneer 2", "Auctioneer 3"];
  const categoryOptions = ["Category 1", "Category 2", "Category 3"];
  const sessionOptions = ["Session 1", "Session 2", "Session 3"];

  const [rowCount, setRowCount] = useState(1); // Initial row count
  const [formData, setFormData] = useState([]); // Store form data
  const [errorMessages, setErrorMessages] = useState([]); // Store error messages

  const handleRowCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setRowCount(count);
  };

  const handleFormSubmit = () => {
    const data = [];
    const errors = [];

    for (let i = 1; i <= rowCount; i++) {
      const auctioneer = document.getElementById(`auctioneer-${i}`).value;
      const category = document.getElementById(`category-${i}`).value;
      const teaType = document.getElementById(`teaType-${i}`).value;
      const session = document.getElementById(`session-${i}`).value;
      const saleDate = document.getElementById(`saleDate-${i}`).value;
      const startTime = document.getElementById(`startTime-${i}`).value;
      const endTime = document.getElementById(`endTime-${i}`).value;
      const minBidTime = document.getElementById(`minBidTime-${i}`).value;
      const numLots = document.getElementById(`numLots-${i}`).value;
      const status = document.getElementById(`status-${i}`).value;
      const remark = document.getElementById(`remark-${i}`).value;

      const row = {
        auctioneer,
        category,
        teaType,
        session,
        saleDate,
        startTime,
        endTime,
        minBidTime,
        numLots,
        status,
        remark,
      };

      if (new Date(endTime) <= new Date(startTime)) {
        errors.push(`End Time must be greater than Start Time for Row ${i}`);
      }

      data.push(row);
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
    } else {
      setFormData(data);
      setErrorMessages([]); // Clear any previous error messages
    }
  };

  const createTableRow = () => {
    const rows = [];
    for (let i = 1; i <= rowCount; i++) {
      rows.push(
        <tr key={i}>
          <td>{i}</td>
          <td>
            <select
              id={`auctioneer-${i}`}
              onChange={(e) => handleAuctioneerChange(e, i)}
            >
              {auctioneerOptions.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </td>
          <td id={`marketType-${i}`}>Market Type</td>
          <td>
            <select id={`category-${i}`}>
              {categoryOptions.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </td>
          <td>
            <select id={`teaType-${i}`}>
              <option>Tea Type 1</option>
              <option>Tea Type 2</option>
              <option>Tea Type 3</option>
            </select>
          </td>
          <td>
            <select id={`session-${i}`}>
              {sessionOptions.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          </td>
          <td>
            <input type="text" id={`saleDate-${i}`} placeholder="dd/mm/yyyy" />
          </td>
          <td>
            <input type="time" id={`startTime-${i}`} />
          </td>
          <td>
            <input type="time" id={`endTime-${i}`} />
          </td>
          <td>
            <input type="text" id={`minBidTime-${i}`} />
          </td>
          <td>
            <input type="text" id={`numLots-${i}`} />
          </td>
          <td>
            <input type="text" id={`status-${i}`} />{" "}
            {/* Add input field for Status */}
          </td>
          <td>
            <input type="text" id={`remark-${i}`} />
          </td>
        </tr>
      );
    }
    return rows;
  };

  const handleAuctioneerChange = (e, rowNumber) => {
    const selectedAuctioneer = e.target.value;
    // Make an API call to fetch market type data and update the table cell
    // Replace the URL and payload with your actual API endpoint and data
    const apiUrl =
      "http://192.168.101.75:5080/preauction/Common/BindMarketTypeByParam";
    const payload = {
      AuctioneerId: 5, // Default AuctioneerId
      auctionCenterId: 1,
      saleNo: 17,
      season: "2023",
    };

    if (selectedAuctioneer === "Auctioneer 2") {
      // If the selected auctioneer is "Auctioneer 2", update the payload
      payload.AuctioneerId = 10;
      payload.saleNo = 20;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200 && data.responseData.length > 0) {
          // Update the Market Type cell based on the API response
          document.getElementById(`marketType-${rowNumber}`).innerText =
            data.responseData[0].marketTypeName;
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  return (
    <>
      <input
        type="number"
        value={rowCount}
        onChange={handleRowCountChange}
        min="1"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Auctioneer</th>
            <th>Market Type</th>
            <th>Category</th>
            <th>Tea Type</th>
            <th>Session Type</th>
            <th>Sale Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Minimum Bid Time</th>
            <th>No of Lots</th>
            <th>Status</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>{createTableRow()}</tbody>
      </Table>
      <button onClick={handleFormSubmit}>Submit</button>
      {errorMessages.length > 0 && (
        <div>
          <h2>Error Messages:</h2>
          <ul>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {formData.length > 0 && (
        <div>
          <h2>Submitted Data:</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default App2;
