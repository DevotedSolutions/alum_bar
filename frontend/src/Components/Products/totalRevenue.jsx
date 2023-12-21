import React from "react";
import { Line } from "react-chartjs-2";

const TotalRevenu = (props) => {
  // console.log(props.yearData, "iiiiiiiiiiiiiiiiii");
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
  const Dummydata = [0, 2, 3, 4, 5, 6, 7, 811, 3455, 5555, 4444];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Revenue",
        backgroundColor: "#3B71CA",
        borderColor: "#3B71CA",
        borderWidth: 2,
        pointRadius: 0,
        pointBackgroundColor: "#3B71CA",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointHoverRadius: 5, // Adjust the size of the hover point
        pointHoverBackgroundColor: "white",
        pointHoverBorderColor: "#3B71CA",
        pointHoverBorderWidth: 2,
        data: props.yearData,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },interaction: {
        mode: "index",
        intersect: false,
        axis: "x", // Set to "y" if you want to activate on the y-axis
      },
    },
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
      <Line data={data} options={options} maxWidth="100%" />
    </div>
  );
};

export default TotalRevenu;
