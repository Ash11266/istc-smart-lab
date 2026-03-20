"use client";

import React, { useMemo } from 'react';
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
}

export default function MetricLineChart({ metric, data }: MetricLineChartProps) {
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
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc' },
        formatter: (params: any) => {
          const pt = params[0];
          if (!pt) return '';
          const date = new Date(pt.value[0]);
          const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          return `${timeStr}<br/>${pt.seriesName}: <b>${pt.value[1]}</b>`;
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
        axisLine: { lineStyle: { color: '#475569' } },
        axisLabel: { 
          color: '#94a3b8', 
          fontSize: 11,
          formatter: (value: number) => {
            const date = new Date(value);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
          }
        },
        axisTick: { show: true, lineStyle: { color: '#475569' } },
        splitLine: { show: true, lineStyle: { color: '#334155', type: 'solid' } }
      },
      yAxis: {
        type: 'value',
        splitLine: { show: true, lineStyle: { color: '#334155', type: 'solid' } },
        axisLine: { show: true, lineStyle: { color: '#475569' } },
        axisTick: { show: true, lineStyle: { color: '#475569' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
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
            color: '#3b82f6' // Solid blue for mathematical crispness
          },
          itemStyle: {
            color: '#3b82f6' // Match point color to the line
          },
          animationDuration: 300,
          animationEasing: 'cubicOut'
        }
      ]
    };
  }, [data, metric]);

  const isEmpty = data.length === 0;
  
  const latestValue = useMemo(() => {
    if (isEmpty) return '--';
    const val = data[data.length - 1].value;
    return typeof val === 'number' ? val.toFixed(2) : val;
  }, [data, isEmpty]);

  return (
    <div className="bg-slate-900/80 dark:bg-slate-950 rounded-2xl border border-slate-700/50 p-5 shadow-lg w-full h-[320px] flex flex-col overflow-hidden backdrop-blur-sm transition-all hover:border-slate-600/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
            <h4 className="text-white font-bold text-lg tracking-wide capitalize">
              {metric}
            </h4>
            <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-sm font-semibold">{latestValue}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative -mx-2">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-slate-500 text-sm flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin text-slate-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Waiting for data...
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
  );
}
