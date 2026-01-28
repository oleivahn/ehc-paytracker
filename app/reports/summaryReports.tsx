"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getYearlyDataAction } from "./getYearlyDataAction";
import { YearSelector } from "./yearSelector";
import { capitalizeWords } from "@/lib/utils";
import { printElement } from "@/lib/printTemplates/printYearlySummary";

interface SummaryData {
  name: string;
  totalShifts: number;
  totalEarnings: number;
  firstShift: string;
  lastShift: string;
}

export const SummaryReports = () => {
  const [pending, setPending] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleGenerateSummary = async () => {
    const formData = new FormData();
    formData.append("year", selectedYear.toString());

    setPending(true);
    const res = await getYearlyDataAction(formData);

    if (res.data) {
      const processedData = res.data.map((employee: any) => {
        let totalEarnings = 0;

        if (!employee || !employee.shiftTypes) {
          return {
            name: employee?.name || "Unknown",
            totalShifts: 0,
            totalEarnings: 0,
            firstShift: "",
            lastShift: "",
          };
        }

        if (employee.name !== "jose furet") {
          employee.shiftTypes.forEach((shiftTypeGroup: any) => {
            shiftTypeGroup.shifts.forEach((shift: any) => {
              const shiftType = shift.shiftType;
              let shiftEarnings = 0;

              switch (shiftType) {
                case "driver":
                  shiftEarnings = shift.outOfState ? 250 : 200;
                  break;
                case "helper":
                  shiftEarnings = shift.outOfState ? 200 : 150;
                  break;
                case "thirdMan":
                  shiftEarnings = shift.outOfState ? 165 : 135;
                  break;
              }

              totalEarnings += shiftEarnings;
            });
          });
        } else {
          totalEarnings = employee.totalShifts * 700;
        }

        // Find the earliest and latest shift dates
        let firstDate: Date | null = null;
        let lastDate: Date | null = null;

        employee.shiftTypes.forEach((shiftTypeGroup: any) => {
          shiftTypeGroup.shifts.forEach((shift: any) => {
            const shiftDate = new Date(shift.shiftDate);
            if (!firstDate || shiftDate < firstDate) {
              firstDate = shiftDate;
            }
            if (!lastDate || shiftDate > lastDate) {
              lastDate = shiftDate;
            }
          });
        });

        return {
          name: employee.name,
          totalShifts: employee.totalShifts,
          totalEarnings,
          firstShift: firstDate ? (firstDate as Date).toLocaleDateString() : "",
          lastShift: lastDate ? (lastDate as Date).toLocaleDateString() : "",
        };
      });

      // Sort by total earnings descending
      processedData.sort(
        (a: SummaryData, b: SummaryData) => b.totalEarnings - a.totalEarnings
      );
      setSummaryData(processedData);
    }

    setPending(false);
  };

  const grandTotal = summaryData.reduce(
    (acc, emp) => acc + emp.totalEarnings,
    0
  );
  const totalShifts = summaryData.reduce(
    (acc, emp) => acc + emp.totalShifts,
    0
  );

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full flex-col gap-4 md:w-[650px] md:flex-row md:items-center md:justify-between">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateSummary}
            className="w-full md:w-auto"
            disabled={pending}
          >
            {pending ? "Generating..." : `Generate ${selectedYear} Summary`}
          </Button>
          {summaryData.length > 0 && (
            <Button
              onClick={() =>
                printElement(
                  "summary-report-content",
                  `${selectedYear} Yearly Summary`
                )
              }
              variant="outline"
              className="w-full md:w-auto"
            >
              Print
            </Button>
          )}
        </div>
      </div>

      {summaryData.length > 0 && (
        <Card className="mb-6 w-full shadow-lg dark:bg-darker md:w-[950px] md:px-6 md:py-8">
          <div id="summary-report-content">
            <CardHeader>
              <CardTitle>{selectedYear} Yearly Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pay Period</TableHead>
                    <TableHead className="text-center">Total Shifts</TableHead>
                    <TableHead className="text-right">Total Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryData.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {capitalizeWords(employee.name)}
                      </TableCell>
                      <TableCell>
                        {employee.firstShift} - {employee.lastShift}
                      </TableCell>
                      <TableCell className="text-center">
                        {employee.totalShifts}
                      </TableCell>
                      <TableCell className="text-right">
                        ${employee.totalEarnings.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Grand Total</TableCell>
                    <TableCell className="text-center">{totalShifts}</TableCell>
                    <TableCell className="text-right">
                      ${grandTotal.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};
