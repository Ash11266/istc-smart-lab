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
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        textStyle: { color: '#0f172a' },
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
        axisLabel: { color: '#475569', fontSize: 11 }
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
  
  const latestValue = useMemo(() => {
    if (isEmpty) return '--';
    const val = data[data.length - 1].value;
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val);
    }
    return typeof val === 'number' ? val.toFixed(2) : String(val);
  }, [data, isEmpty]);

  return (
    <div className="bg-white p-2 w-full h-[320px] flex flex-col overflow-hidden transition-all">
      <div className="flex items-center justify-between mb-4 border-b-2 border-slate-200 pb-2">
        <div className="flex items-center gap-3">
            <h4 className="text-[#003366] font-bold text-lg tracking-wide uppercase">
              {metric}
            </h4>
            <div className="bg-slate-100 px-3 py-1 border border-slate-300 flex items-center gap-2">
                <span className="text-[#003366] font-mono text-sm font-bold">{latestValue}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="relative flex h-2.5 w-2.5">
             <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500"></span>
           </span>
           <span className="text-slate-600 text-xs font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-0 relative -mx-2">
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
  );
}
