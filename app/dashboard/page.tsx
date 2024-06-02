import React from "react";
import { getDataAction } from "./getDataAction";

const Dashboard = async () => {
  const data = await getDataAction();
  console.log("📗 LOG [ data ]:", data);

  return (
    <>
      <div className="container mt-6">
        <p className="text-3xl">Dashboard!</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default Dashboard;
