import React from 'react';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
const LastWeekSales = () => {

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Last Week Sales",
        backgroundColor: "gray",
        borderColor: "rgb(255, 99, 132)",
        
        data: [0, 90, 5, 2, 20, 30, 45],
      },
    
    ],
  };

  return (
    <div style={{   padding: "6px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    borderRadius: "12px",}}>
      
  
      <Bar data={data} />
    </div>
  );
};

export default LastWeekSales;
