'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface BalanceChartProps {
    period?: string;
}

export function BalanceChart({ period = '7d' }: BalanceChartProps) {
    const { theme } = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const isDark = theme === 'dark';
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set colors based on theme
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const lineColor = isDark ? '#4f46e5' : '#6366f1'; // Primary color

        // Draw grid
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;

        // Horizontal grid lines
        for (let i = 0; i < 5; i++) {
            const y = i * (height / 4);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw line chart - generate different data based on period
        const dataPoints = 20; // Number of data points
        let data: number[] = [];

        // Generate different data based on period
        switch (period) {
            case '24h':
                data = Array.from({ length: dataPoints }, (_, i) =>
                    Math.sin(i / 2) * 20 + 50 + Math.random() * 10
                );
                break;
            case '7d':
                data = Array.from({ length: dataPoints }, (_, i) =>
                    Math.sin(i / 3) * 25 + 60 + Math.random() * 15
                );
                break;
            case '30d':
                data = Array.from({ length: dataPoints }, (_, i) =>
                    Math.sin(i / 4) * 30 + 70 + Math.random() * 20
                );
                break;
            case '90d':
                data = Array.from({ length: dataPoints }, (_, i) =>
                    i < dataPoints / 2
                        ? Math.sin(i / 5) * 20 + 50 + Math.random() * 10
                        : Math.sin(i / 5) * 30 + 70 + Math.random() * 15
                );
                break;
            default:
                data = Array.from({ length: dataPoints }, (_, i) =>
                    Math.sin(i / 3) * 25 + 60 + Math.random() * 15
                );
        }

        // Scale to fit canvas
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;

        const scaledData = data.map(
            value => height - ((value - min) / range) * (height * 0.8) - height * 0.1
        );

        // Draw line
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        scaledData.forEach((point, index) => {
            const x = (index / (dataPoints - 1)) * width;
            if (index === 0) {
                ctx.moveTo(x, point);
            } else {
                ctx.lineTo(x, point);
            }
        });

        ctx.stroke();

        // Draw area under the line
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, isDark ? 'rgba(79, 70, 229, 0.5)' : 'rgba(99, 102, 241, 0.5)');
        gradient.addColorStop(1, isDark ? 'rgba(79, 70, 229, 0)' : 'rgba(99, 102, 241, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height);

        scaledData.forEach((point, index) => {
            const x = (index / (dataPoints - 1)) * width;
            ctx.lineTo(x, point);
        });

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
    }, [theme, period]);

    return (
        <canvas
            ref={canvasRef}
            width={600}
            height={200}
            className="w-full h-full"
        />
    );
}
