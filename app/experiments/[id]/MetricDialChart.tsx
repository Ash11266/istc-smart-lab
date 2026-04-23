"use client";

import React, { useMemo, useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

interface MetricDialChartProps {
  metric: string;
  data: MqttMessage[];
  unit?: string;
}

export default function MetricDialChart({ metric, data, unit }: MetricDialChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const latestValue = useMemo(() => {
    if (data.length === 0) return 0;
    const last = data[data.length - 1];
    const val = typeof last.value === 'string' ? parseFloat(last.value) : last.value;
    return isNaN(val as number) ? 0 : (val as number);
  }, [data]);

  const allValues = useMemo(() => {
    return data.map(d => {
      const v = typeof d.value === 'string' ? parseFloat(d.value) : d.value;
      return isNaN(v as number) ? 0 : (v as number);
    });
  }, [data]);

  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 100;
  const dialMax = maxVal <= 0 ? 100 : Math.ceil(maxVal * 1.2);

  // Percentage for the arc fill
  const pct = Math.min(100, (latestValue / dialMax) * 100);

  const option = useMemo(() => ({
    series: [
      // Background ring
      {
        type: 'gauge',
        min: 0,
        max: dialMax,
        radius: '88%',
        center: ['50%', '55%'],
        startAngle: 225,
        endAngle: -45,
        splitNumber: 0,
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        axisLine: {
          lineStyle: {
            width: 22,
            color: [[1, '#e2e8f0']],
          },
        },
        pointer: { show: false },
        detail: { show: false },
        data: [{ value: 0 }],
      },
      // Value arc
      {
        type: 'gauge',
        min: 0,
        max: dialMax,
        radius: '88%',
        center: ['50%', '55%'],
        startAngle: 225,
        endAngle: -45,
        splitNumber: 8,
        axisTick: {
          show: true,
          distance: -26,
          length: 6,
          lineStyle: { color: '#fff', width: 2 },
        },
        splitLine: {
          show: true,
          distance: -34,
          length: 14,
          lineStyle: { color: '#fff', width: 3 },
        },
        axisLabel: {
          show: true,
          color: '#22c55e',
          fontSize: 10,
          distance: -48,
          formatter: (val: number) => val.toFixed(0),
        },
        axisLine: {
          lineStyle: {
            width: 22,
            color: [
              [pct / 100, pct < 30 ? '#10b981' : pct < 70 ? '#f59e0b' : '#ef4444'],
              [1, 'rgba(0,0,0,0)'],
            ],
          },
        },
        pointer: {
          show: true,
          length: '55%',
          width: 6,
          itemStyle: { color: '#166534' },
        },
        anchor: {
          show: true,
          size: 18,
          itemStyle: {
            color: '#166534',
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 8,
            shadowColor: 'rgba(0,51,102,0.3)',
          },
        },
        detail: {
          show: true,
          valueAnimation: true,
          formatter: (val: number) => `{value|${val.toFixed(2)}${unit ? ' ' + unit : ''}}\n{label|${metric.toUpperCase()}}`,
          rich: {
            value: {
              fontSize: 24,
              fontWeight: 'bold',
              color: '#166534',
              lineHeight: 30,
            },
            label: {
              fontSize: 11,
              fontWeight: 'bold',
              color: '#4ade80',
              lineHeight: 20,
            },
          },
          offsetCenter: [0, '38%'],
        },
        data: [{ value: latestValue, name: metric }],
        animationDuration: 500,
        animationEasing: 'cubicOut',
      },
    ],
  }), [latestValue, dialMax, metric, pct]);

  const isEmpty = data.length === 0;

  return (
    <div ref={containerRef} className={`bg-white ${isFullscreen ? 'w-full h-[100dvh] p-6' : 'p-2 w-full h-[320px]'} flex flex-col overflow-hidden transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 border-b-2 border-green-200 pb-2 gap-2">
        <div className="flex items-center gap-3">
          <h4 className="text-[#166534] font-bold text-lg tracking-wide uppercase">{metric}</h4>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 font-bold uppercase tracking-widest border border-green-300">Dial</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-green-600 text-xs font-bold uppercase tracking-widest">Live</span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="text-slate-500 hover:text-[#003366] transition-colors p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl shadow-sm"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 w-full min-h-0 relative">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-green-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin text-green-800" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              WAITING FOR DATA
            </div>
          </div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
            lazyUpdate={false}
          />
        )}
      </div>
    </div>
  );
}
