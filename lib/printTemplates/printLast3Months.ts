import { capitalizeWords } from "../utils";

export type WeeklyDataForPrint = {
  weekDate: string;
  earnings: number;
};

/**
 * Opens a formal employment verification letter in a new tab
 * with company letterhead and weekly earnings summary
 */
export const printLast3Months = (
  employeeName: string,
  weeklyData: WeeklyDataForPrint[],
  totalEarnings: number
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    console.error("Could not open print window");
    return;
  }

  // Format current date as "December 19, 2025"
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Build table rows
  const tableRows = weeklyData
    .map(
      (week) => `
        <tr>
          <td>${week.weekDate}</td>
          <td class="text-right">$${week.earnings.toLocaleString()}</td>
        </tr>
      `
    )
    .join("");

  const formattedName = capitalizeWords(employeeName);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Employment Verification - ${formattedName}</title>
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            padding: 40px 60px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
            color: #333;
          }
          .letterhead {
            text-align: left;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .letterhead h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .letterhead p {
            margin: 5px 0;
            font-size: 14px;
          }
          .date {
            text-align: left;
            margin-bottom: 30px;
          }
          .salutation {
            margin-bottom: 20px;
          }
          .body-text {
            margin-bottom: 20px;
            text-align: justify;
          }
          table {
            width: 50%;
            border-collapse: collapse;
            margin: 20px 0 30px 0;
            font-size: 14px;
          }
          th, td {
            border: 1px solid #333;
            padding: 6px 12px;
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
          .text-right {
            text-align: right;
          }
          .closing {
            margin-top: 40px;
          }
          .signature {
            margin-top: 50px;
          }
          .signature p {
            margin: 5px 0;
          }
          @media print {
            body {
              padding: 20px 40px;
            }
            @page {
              margin: 0.75in 0.5in;
            }
          }
        </style>
      </head>
      <body>
        <div class="letterhead">
          <h1>EHC Delivery</h1>
          <p>100 Lone Oak Dr</p>
          <p>White House, TN, 37188</p>
          <p>(646) 453-9387</p>
          <p>admin@ehc-delivery.com</p>
        </div>

        <div class="date">
          ${currentDate}
        </div>

        <div class="salutation">
          To Whom It May Concern,
        </div>

        <div class="body-text">
          This letter is to certify that Mr. ${formattedName} is currently employed at EHC Delivery as delivery specialist.
        </div>

        <div class="body-text">
          Please find below a summary of his weekly payment details for the last 3 months:
        </div>

        <table>
          <thead>
            <tr>
              <th>Week Date</th>
              <th class="text-right">Earnings</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
          <tfoot>
            <tr>
              <td>Total (${weeklyData.length} weeks)</td>
              <td class="text-right">$${totalEarnings.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div class="body-text">
          Should you have any questions or require additional information, please feel free to contact us at the details provided at the top of this letter.
        </div>

        <div class="closing">
          Sincerely,
          <p><strong>Omar Leiva</strong></p>
          <p>General Manager</p>
          <p>EHC Delivery LLC</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
};
