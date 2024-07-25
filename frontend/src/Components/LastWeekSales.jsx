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
        backgroundColor: "#3B71CA",
        borderColor: "rgb(255, 99, 132)",
        
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
    <div style={{   padding: "6px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    borderRadius: "12px",}}>
      
  
      <Bar data={data} options={options} />
    </div>
  );
};

export default LastWeekSales;
