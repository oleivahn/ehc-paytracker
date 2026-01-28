"use client";
import { YearlyReportForm } from "./yearlyReportForm";
import { SummaryReports } from "./summaryReports";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
  return (
    <main className="container mx-auto p-4">
      <Tabs defaultValue="employee-reports" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="employee-reports">Employee Reports</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="employee-reports">
          <YearlyReportForm />
        </TabsContent>
        <TabsContent value="summary">
          <SummaryReports />
        </TabsContent>
      </Tabs>
    </main>
  );
}
