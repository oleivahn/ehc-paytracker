import React from "react";
import { getDataAction } from "./getDataAction";
import DashboardForm from "./dashboardForm";

const Dashboard = async () => {
  // const data = await getDataAction();
  // console.log("📗 LOG [ data ]:", data);

  return (
    <>
      <div className="mt-6 px-2">
        <DashboardForm />
      </div>
    </>
  );
};

export default Dashboard;
