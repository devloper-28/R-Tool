import React from "react";

const PrintableTable = ({ columns, data }) => {
  return (
    <table style={{ border: "1px solid black" }}>
      <thead>
        <tr style={{ border: "1px solid black" }}>
          {columns.map((column, index) => (
            <th
              key={column}
              style={{
                textAlign: columns[index] === "C" ? "center" : "left",
              }}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} style={{ border: "1px solid black" }}>
            {columns.map((column, columnIndex) => (
              <td key={column.name}>{item[`fieldValue${columnIndex + 1}`]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PrintableTable;
