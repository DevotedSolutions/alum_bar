import React from 'react';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
const LastWeekSales = (props) => {
  // console.log(props.lastWeek,"lasttttttttt");

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun","Mon"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Last Week Sales",
        backgroundColor: "#0D8B92",
        borderColor: "#0D8B92",
        borderRadius: 4,
        data: props.lastWeek,
      },
    
    ],
  };
  const options = {
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
    elements: {
      line: {
        tension: 0, // Set tension to 0 to remove curves
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
    },
  };
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default LastWeekSales;
