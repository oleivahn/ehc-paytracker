"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const YearSelector = ({
  selectedYear,
  onYearChange,
}: YearSelectorProps) => {
  const currentYear = new Date().getFullYear();
  const startYear = 2024;

  // Generate years from current year down to 2024
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Select Year:</label>
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onYearChange(parseInt(value))}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
