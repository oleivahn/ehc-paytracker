import React from "react";
import { getDataAction } from "./getDataAction";
import DashboardForm from "./dashboardForm";

const Dashboard = async () => {
  // const data = await getDataAction();
  // console.log("📗 LOG [ data ]:", data);

  return (
    <>
      <div className="container mt-6">
        <DashboardForm />


        
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </>
  );
};

export default Dashboard;
