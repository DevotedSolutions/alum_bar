import React from "react";

import { Line } from "react-chartjs-2";
const TotalRevenu = (props) => {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Revnue",
        backgroundColor: "gray",
        borderColor: "gray",
        borderWidth: 2,
        pointRadius: 0,
        pointBackgroundColor: "gray",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointHoverRadius: 1,
        pointHoverBackgroundColor: "gray",

        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
      },
    ],
  };

  return (
    <div
      style={{
        padding: "6px",
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        borderRadius: "12px",
      }}
    >
      <Line data={data} maxWidth="100%" />
    </div>
  );
};

export default TotalRevenu;
