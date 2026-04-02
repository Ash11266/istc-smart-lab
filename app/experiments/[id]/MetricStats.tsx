"use client";

import React, { useMemo } from 'react';

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

interface MetricStatsProps {
  data: MqttMessage[];
}

export default function MetricStats({ data }: MetricStatsProps) {
  const isEmpty = data.length === 0;

  const stats = useMemo(() => {
    if (isEmpty) return { min: '--', max: '--', avg: '--', stdev: '--' };

    const numericValues = data
      .map(d => typeof d.value === 'string' ? parseFloat(d.value) : d.value)
      .filter(val => typeof val === 'number' && !isNaN(val)) as number[];

    if (numericValues.length === 0) return { min: '--', max: '--', avg: '--', stdev: '--' };

    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;

    const squaredDiffs = numericValues.map(val => Math.pow(val - avg, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / numericValues.length;
    const stdev = Math.sqrt(avgSquaredDiff);

    return {
      min: min.toFixed(2),
      max: max.toFixed(2),
      avg: avg.toFixed(2),
      stdev: stdev.toFixed(2)
    };
  }, [data, isEmpty]);

  const latestValue = useMemo(() => {
    if (isEmpty) return '--';
    const val = data[data.length - 1].value;
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val);
    }
    return typeof val === 'number' ? val.toFixed(2) : String(val);
  }, [data, isEmpty]);

  return (
    <div className="w-full h-full flex flex-col gap-6 p-2">
      <div className="flex flex-col pb-2">
        <span className="text-slate-500 text-sm leading-none mb-2 font-bold uppercase tracking-widest">Latest Value</span>
        <span className="font-mono text-5xl font-bold text-[#003366] truncate" title={latestValue}>{latestValue}</span>
      </div>

      {!isEmpty && stats.avg !== '--' && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs leading-none mb-1 font-bold uppercase tracking-widest">AVG.</span>
            <span className="font-mono text-2xl font-bold text-[#003366]">{stats.avg}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs leading-none mb-1 font-bold uppercase tracking-widest">ST DEV</span>
            <span className="font-mono text-2xl font-bold text-[#003366]">{stats.stdev}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs leading-none mb-1 font-bold uppercase tracking-widest">MIN</span>
            <span className="font-mono text-2xl font-bold text-[#003366]">{stats.min}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs leading-none mb-1 font-bold uppercase tracking-widest">MAX</span>
            <span className="font-mono text-2xl font-bold text-[#003366]">{stats.max}</span>
          </div>
        </div>
      )}
    </div>
  );
}
