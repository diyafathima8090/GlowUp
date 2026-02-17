3// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const OrderStateCircle = () => {
//   const data = {
//     labels: ["Delivered", "Pending", "Cancelled"],
//     datasets: [
//       {
//         label: "Orders",
//         data: [60, 25, 15],
//         backgroundColor: [
//           "rgba(197, 34, 110, 0.7)",
//           "rgba(78, 23, 54, 0.7)",
//           "rgba(239,68,68,0.7)",
//         ],
//         borderColor: [
//           "rgba(197, 34, 110, 0.7)",
//           "rgba(78, 23, 54, 0.7)",
//           "rgba(239,68,68,0.7)",
//         ],
//         borderWidth: 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false, // chart will fill container
//     rotation: -90,
//     circumference: 360,
//     animation: {
//       animateRotate: true,
//       duration: 1500,
//       easing: "easeInOutQuad",
//     },
//     plugins: {
//       legend: { position: "bottom" },
//       tooltip: { enabled: true },
//     },
//   };

//   return (
//     <div className="w-full h-full flex justify-center items-center">
//       {/* Container fills parent and chart scales automatically */}
//       <div className="w-full h-full min-h-[200px] max-w-[400px]">
//         <Doughnut data={data} options={options} />
//       </div>
//     </div>
//   );
// };

// export default OrderStateCircle;



import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Define the colors for the chart segments
// Make sure these match the status names in your database (Delivered, Pending, Cancelled, Shipped, Processing)
const CHART_COLORS = {
    Delivered: "rgba(197, 34, 110, 0.7)", // Pink
    Pending: "rgba(78, 23, 54, 0.7)",    // Darker Pink
    Cancelled: "rgba(239, 68, 68, 0.7)", // Red
    Shipped: "rgba(250, 35, 189, 0.7)",   // Forest Green
    Processing: "rgba(255, 165, 0, 0.7)" // Orange
};

// Component now accepts a 'data' prop (e.g., [{name: 'Delivered', value: 3}, ...])
const OrderStateCircle = ({ data: dynamicData }) => {

    // Helper function to extract labels, values, and colors from the dynamic data
    const labels = dynamicData.map(item => item.name);
    const values = dynamicData.map(item => item.value);
    const backgroundColors = dynamicData.map(item => CHART_COLORS[item.name] || 'rgba(128, 128, 128, 0.7)');

    // This is the data object passed to the <Doughnut> component
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Orders",
                data: values, // Dynamically set by your calculated order counts (e.g., [3, 1, 2, 1, 1])
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')), // Use a solid border color
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        rotation: -90,
        circumference: 360,

        animation: {
            animateRotate: true,
            duration: 1500,
            easing: "easeInOutQuad",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: '#fff', // Ensure legend text is visible on dark background
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    // Customize tooltip to show count and percentage
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return `${label}: ${value} (${percentage})`;
                    }
                }
            },
        },
    };

    if (!dynamicData || dynamicData.length === 0) {
        return <p className="text-white text-center">No order data available for charting.</p>;
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-full min-h-[200px] max-w-[400px]">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default OrderStateCircle;