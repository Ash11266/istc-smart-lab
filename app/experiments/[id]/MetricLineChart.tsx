"use client";

import React, { useMemo, useState, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

interface MetricLineChartProps {
  metric: string;
  data: MqttMessage[];
  unit?: string;
}

export default function MetricLineChart({ metric, data, unit }: MetricLineChartProps) {
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
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const option = useMemo(() => {
    const timeData = data.map((d) => {
      const date = d.timestamp ? new Date(d.timestamp) : new Date();
      const val = typeof d.value === 'string' ? parseFloat(d.value) : d.value;
      return [date.getTime(), isNaN(val) ? 0 : val];
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        textStyle: { color: '#0f172a' },
        formatter: (params: any) => {
          const pt = params[0];
          if (!pt) return '';
          const date = new Date(pt.value[0]);
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          return `${timeStr}<br/>${pt.seriesName}: <b>${pt.value[1]}${unit ? ' ' + unit : ''}</b>`;
        }
      },
      grid: {
        left: '2%',
        right: '2%',
        bottom: '5%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: '#64748b' } },
        axisLabel: {
          color: '#475569',
          fontSize: 11,
          formatter: (value: number) => {
            const date = new Date(value);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          }
        },
        axisTick: { show: true, lineStyle: { color: '#64748b' } },
        splitLine: { show: true, lineStyle: { color: '#e2e8f0', type: 'solid' } }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: true, lineStyle: { color: '#e2e8f0', type: 'solid' } },
        axisLine: { show: true, lineStyle: { color: '#64748b' } },
        axisTick: { show: true, lineStyle: { color: '#64748b' } },
        axisLabel: { 
          color: '#475569', 
          fontSize: 11,
          formatter: (value: any) => unit ? `${value} ${unit}` : value
        }
      },
      series: [
        {
          name: metric,
          type: 'line',
          smooth: false,
          showSymbol: true,
          symbolSize: 6,
          symbol: 'circle',
          data: timeData,
          lineStyle: {
            width: 2,
            color: '#003366' // Solid blue for mathematical crispness
          },
          itemStyle: {
            color: '#003366' // Match point color to the line
          },
          animationDuration: 300,
          animationEasing: 'cubicOut'
        }
      ]
    };
  }, [data, metric]);

  const isEmpty = data.length === 0;

  return (
    <div ref={containerRef} className={`bg-white ${isFullscreen ? 'w-full h-[100dvh] p-6' : 'p-2 w-full h-[320px]'} flex flex-col overflow-hidden transition-all`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 border-b-2 border-slate-200 pb-2 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h4 className="text-[#003366] font-bold text-lg tracking-wide uppercase">
            {metric}
          </h4>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Live</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="text-slate-500 hover:text-[#003366] transition-colors p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-sm shadow-sm"
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
        <div className="flex-1 min-w-0 relative -mx-2">
          {isEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-slate-600 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin text-slate-800" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                WAITING FOR DATA
              </div>
            </div>
          ) : (
            <ReactECharts
              option={option}
              style={{ height: '100%', width: '100%' }}
              notMerge={false}
              lazyUpdate={true}
            />
          )}
        </div>

      </div>
    </div>
  );
}
