/**
 * Opens the browser's print dialog to print the current page
 * or a specific element's content
 */
export const printPage = () => {
  window.print();
};

/**
 * Opens a specific element's content in a new tab for print preview
 * User can then decide whether to print from there
 */
export const printElement = (elementId: string, title?: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Could not open print window");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || "Print Report"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          tfoot td {
            font-weight: bold;
            background-color: #f5f5f5;
          }
          h1, h2, h3 {
            color: #333;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
};
