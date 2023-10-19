import React, { createContext, useContext } from "react";

// Create a context
const PrintContext = createContext();

// Create a provider component
export const PrintProvider = ({ children }) => {
  const printContent = (contentId, title) => {
    const printWindow = window.open("", "", "width=600,height=600");
    const content = document.getElementById(contentId);

    if (printWindow && content) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
          </head>
          <body>${content.innerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      //   printWindow.close();
    }
  };

  return (
    <PrintContext.Provider value={{ printContent }}>
      {children}
    </PrintContext.Provider>
  );
};

// Custom hook to access the printing functionality
export const usePrint = () => {
  return useContext(PrintContext);
};
