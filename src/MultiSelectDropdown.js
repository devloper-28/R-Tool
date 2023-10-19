import React, { useState } from "react";
import Select from "react-select";

function MultiSelectDropdown({
  optionsList,
  selectedOptions,
  setSelectedOptions,
}) {
  // console.log(
  //   optionsList.tblReportControlDetail?.map((ele) => {
  //     return { value: ele.controlValue, label: ele.condition };
  //   })
  // );
  const options = optionsList.tblReportControlDetail?.map((ele) => {
    return { value: ele.controlValue, label: ele.condition };
  });

  const handleSelectChange = (selectedValues) => {
    setSelectedOptions(selectedValues);
  };

  return (
    <div>
      <h2>Select Multiple Options:</h2>
      <Select
        options={options}
        closeMenuOnSelect={false}
        isMulti
        value={selectedOptions}
        onChange={handleSelectChange}
      />
    </div>
  );
}

export default MultiSelectDropdown;
