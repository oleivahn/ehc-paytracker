"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getYearlyDataAction } from "./getYearlyDataAction";
import { YearSelector } from "./yearSelector";
import { capitalizeWords } from "@/lib/utils";
import { printElement } from "@/lib/printTemplates/printYearlySummary";

interface YearlyData {
  name: string;
  totalShifts: number;
  shiftCounts: {
    driver: {
      regular: number;
      outOfState: number;
      total: number;
    };
    helper: {
      regular: number;
      outOfState: number;
      total: number;
    };
    thirdMan: {
      regular: number;
      outOfState: number;
      total: number;
    };
  };
  totalEarnings: number;
  detailedShifts: Array<{
    date: string;
    shiftType: string;
    location: string;
    outOfState: boolean;
    earnings: number;
  }>;
}

export const YearlyReportForm = () => {
  const [pending, setPending] = useState(false);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Auto-load data on mount and when year changes
  useEffect(() => {
    const fetchYearlyData = async () => {
      const formData = new FormData();
      formData.append("year", selectedYear.toString());

      setPending(true);
      const res = await getYearlyDataAction(formData);

      if (res.data) {
        const processedData = res.data.map((employee: any) => {
          let totalEarnings = 0;
          let shiftCounts = {
            driver: {
              regular: 0,
              outOfState: 0,
              total: 0,
            },
            helper: {
              regular: 0,
              outOfState: 0,
              total: 0,
            },
            thirdMan: {
              regular: 0,
              outOfState: 0,
              total: 0,
            },
          };

          let detailedShifts: Array<{
            date: string;
            shiftType: string;
            location: string;
            outOfState: boolean;
            earnings: number;
          }> = [];

          if (!employee || !employee.shiftTypes) {
            console.error("Invalid employee data:", employee);
            return {
              name: employee?.name || "Unknown",
              totalShifts: 0,
              shiftCounts,
              totalEarnings: 0,
              detailedShifts: [],
            };
          }

          if (employee.name !== "Jose Furet") {
            employee.shiftTypes.forEach((shiftTypeGroup: any) => {
              shiftTypeGroup.shifts.forEach((shift: any) => {
                const shiftType = shift.shiftType as keyof typeof shiftCounts;
                let shiftEarnings = 0;

                if (shift.outOfState) {
                  shiftCounts[shiftType].outOfState++;
                } else {
                  shiftCounts[shiftType].regular++;
                }
                shiftCounts[shiftType].total++;

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

                detailedShifts.push({
                  date: new Date(shift.shiftDate).toLocaleDateString(),
                  shiftType: shift.shiftType,
                  location: shift.location,
                  outOfState: shift.outOfState,
                  earnings: shiftEarnings,
                });
              });
            });
          } else {
            totalEarnings = employee.totalShifts * 700;

            employee.shiftTypes.forEach((shiftTypeGroup: any) => {
              const shiftType = shiftTypeGroup.type as keyof typeof shiftCounts;
              shiftCounts[shiftType].total = shiftTypeGroup.count;
              shiftCounts[shiftType].regular = shiftTypeGroup.count;

              shiftTypeGroup.shifts.forEach((shift: any) => {
                detailedShifts.push({
                  date: new Date(shift.shiftDate).toLocaleDateString(),
                  shiftType: shift.shiftType,
                  location: shift.location,
                  outOfState: shift.outOfState,
                  earnings: 700,
                });
              });
            });
          }

          detailedShifts.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          return {
            name: employee.name,
            totalShifts: employee.totalShifts,
            shiftCounts,
            totalEarnings: totalEarnings,
            detailedShifts,
          };
        });

        // Sort alphabetically by employee name
        processedData.sort((a: YearlyData, b: YearlyData) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        setYearlyData(processedData);
      }

      setPending(false);
    };

    fetchYearlyData();
  }, [selectedYear]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex w-full flex-col gap-4 md:w-[650px] md:flex-row md:items-center md:justify-between">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        {pending && (
          <span className="text-sm text-muted-foreground">Loading...</span>
        )}
      </div>

      {yearlyData && yearlyData.length > 0 && (
        <Card className="mb-6 w-full shadow-lg dark:bg-darker md:w-[950px] md:px-6 md:py-8">
          <div id="employee-report-content">
            <CardHeader>
              <CardTitle>{selectedYear} Yearly Totals</CardTitle>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {yearlyData
                  .filter((employee) =>
                    employee.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((employee, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex w-full items-center justify-between pr-4">
                          <span className="text-lg font-bold text-primary">
                            {capitalizeWords(employee.name)}
                          </span>
                          <div className="flex gap-6 text-sm text-muted-foreground">
                            <span>Shifts: {employee.totalShifts}</span>
                            <span>
                              ${employee.totalEarnings.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-4">
                          <div className="mb-4">
                            <h4 className="mb-2 font-semibold">
                              Shift Breakdown:
                            </h4>
                            {Object.entries(employee.shiftCounts).map(
                              ([type, counts]) => (
                                <div key={type} className="ml-4">
                                  <p className="capitalize">{type}:</p>
                                  <ul className="ml-4">
                                    <li>Regular: {counts.regular}</li>
                                    <li>Out of State: {counts.outOfState}</li>
                                    <li>Total: {counts.total}</li>
                                  </ul>
                                </div>
                              )
                            )}
                          </div>

                          <div>
                            <h4 className="mb-2 font-semibold">
                              Detailed Shifts:
                            </h4>
                            <div className="max-h-60 overflow-y-auto">
                              {employee.detailedShifts.map(
                                (shift, shiftIndex) => (
                                  <div key={shiftIndex} className="mb-2 ml-4">
                                    <p>
                                      {shift.date} - {shift.location} -{" "}
                                      {shift.shiftType}
                                      {shift.outOfState
                                        ? " (Out of State)"
                                        : ""}{" "}
                                      - ${shift.earnings}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};
