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
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Revenue",
        backgroundColor: "#0D8B92",
        borderColor: "#0D8B92",
        borderWidth: 2,
        pointRadius: 0,
        pointBackgroundColor: "#0D8B92",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointHoverRadius: 5, // Adjust the size of the hover point
        pointHoverBackgroundColor: "white",
        pointHoverBorderColor: "#0D8B92",
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
    <div>
      <Line data={data} options={options} maxWidth="100%" />
    </div>
  );
};

export default TotalRevenu;
