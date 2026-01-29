"use client";

import React, { useEffect, useState } from "react";
import { capitalizeWords } from "@/lib/utils";
import { printLast3Months } from "@/lib/printTemplates/printLast3Months";
import {
  getWeeklyDataAction,
  getEmployeeListAction,
  WeeklyData,
} from "./getWeeklyDataAction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const WeeklyReports = () => {
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [weeklyData, setWeeklyData] = useState<WeeklyData[] | null>(null);
  const [pending, setPending] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  // Load employee list on mount
  useEffect(() => {
    const loadEmployees = async () => {
      setLoadingEmployees(true);
      const employeeList = await getEmployeeListAction();
      setEmployees(employeeList);
      setLoadingEmployees(false);
    };
    loadEmployees();
  }, []);

  // Fetch weekly data when employee is selected
  const handleEmployeeSelect = async (employeeName: string) => {
    setSelectedEmployee(employeeName);
    setPending(true);
    setWeeklyData(null);

    const result = await getWeeklyDataAction(employeeName);
    if (!result.error && result.data) {
      setWeeklyData(result.data);
    }
    setPending(false);
  };

  // Calculate total earnings
  const totalEarnings =
    weeklyData?.reduce((sum, week) => sum + week.earnings, 0) || 0;
  const totalShifts =
    weeklyData?.reduce((sum, week) => sum + week.shiftsCount, 0) || 0;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full md:w-[650px]">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Employee:</label>
            <Select
              value={selectedEmployee}
              onValueChange={handleEmployeeSelect}
              disabled={loadingEmployees}
            >
              <SelectTrigger className="w-[180px] md:w-[250px]">
                <SelectValue
                  placeholder={
                    loadingEmployees ? "Loading..." : "Select an employee"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee} value={employee}>
                    {capitalizeWords(employee)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {weeklyData && weeklyData.length > 0 && (
            <Button
              onClick={() =>
                printLast3Months(selectedEmployee, weeklyData, totalEarnings)
              }
              variant="outline"
            >
              Print Letter
            </Button>
          )}
        </div>
        {pending && (
          <span className="mt-2 block text-sm text-muted-foreground">
            Loading weekly data...
          </span>
        )}
      </div>

      {weeklyData && weeklyData.length > 0 && (
        <Card className="mb-6 w-full shadow-lg dark:bg-darker md:w-[650px]">
          <div id="weekly-report-content">
            <CardHeader>
              <CardTitle>
                Last 3 Months - {capitalizeWords(selectedEmployee)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week Date</TableHead>
                    <TableHead className="text-right">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyData.map((week, index) => (
                    <TableRow key={index}>
                      <TableCell>{week.weekDate}</TableCell>
                      <TableCell className="text-right">
                        ${week.earnings.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Total ({weeklyData.length} weeks)</TableCell>
                    <TableCell className="text-right">
                      ${totalEarnings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </div>
        </Card>
      )}

      {weeklyData && weeklyData.length === 0 && (
        <div className="text-center text-muted-foreground">
          No data found for {capitalizeWords(selectedEmployee)} in the last 3
          months.
        </div>
      )}
    </div>
  );
};
