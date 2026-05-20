import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = {
    Delivered: "rgba(34, 197, 94, 0.7)",    // Emerald
    Pending: "rgba(245, 158, 11, 0.7)",      // Amber
    Cancelled: "rgba(239, 68, 68, 0.7)",     // Rose
    Shipped: "rgba(59, 130, 246, 0.7)",      // Blue
    Processing: "rgba(168, 85, 247, 0.7)"    // Purple
};

const OrderStateCircle = ({ data: dynamicData }) => {
    const labels = dynamicData.map(item => item.name);
    const values = dynamicData.map(item => item.value);
    const backgroundColors = dynamicData.map(item => CHART_COLORS[item.name] || 'rgba(128, 128, 128, 0.7)');

    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Orders",
                data: values,
                backgroundColor: backgroundColors,
                borderColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 8,
                hoverBorderWidth: 0,
                spacing: 4,
                borderRadius: 12,
                cutout: '75%'
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateRotate: true,
            duration: 2000,
            easing: "easeOutQuart",
        },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: '#94a3b8',
                    padding: 30,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 9,
                        weight: '800',
                        family: 'Inter'
                    },
                    generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label, i) => ({
                                text: label.toUpperCase(),
                                fillStyle: data.datasets[0].backgroundColor[i],
                                strokeStyle: 'transparent',
                                lineWidth: 0,
                                hidden: false,
                                index: i
                            }));
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(10, 5, 13, 0.9)',
                titleColor: '#ec4899',
                titleFont: { size: 10, weight: '900' },
                bodyColor: '#fff',
                bodyFont: { size: 14, weight: '900' },
                padding: 12,
                cornerRadius: 16,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(0) + '%';
                        return `${value} UNITS (${percentage})`;
                    }
                }
            },
        },
    };

    if (!dynamicData || dynamicData.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Telemetry Unavailable</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative group">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total</span>
                <span className="text-4xl font-black text-white italic">
                    {values.reduce((a, b) => a + b, 0)}
                </span>
            </div>
            <div className="w-full h-full">
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
};

export default OrderStateCircle;
