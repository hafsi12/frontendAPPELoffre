import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js";
import "chart.js/auto"; // Automatically register the required Chart.js components

const CustomChart = ({ data, options }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const chart = new Chart(canvasRef.current, {
        type: "bar", // Specify the type of chart (can be "bar", "line", etc.)
        data: data,
        options: options,
      });


      

      // Cleanup the chart instance when the component unmounts
      return () => {
        chart.destroy();
      };
    }
  }, [data, options]);

  return <canvas ref={canvasRef} />;
};

export default CustomChart;
