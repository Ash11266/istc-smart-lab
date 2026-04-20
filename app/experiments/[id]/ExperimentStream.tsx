"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import MetricStats from "./MetricStats";

const MetricLineChart = dynamic(() => import("./MetricLineChart"), { ssr: false });
const MetricDialChart = dynamic(() => import("./MetricDialChart"), { ssr: false });
const MetricGaugeChart = dynamic(() => import("./MetricGaugeChart"), { ssr: false });
const MetricBarChart = dynamic(() => import("./MetricBarChart"), { ssr: false });
const MetricAreaChart = dynamic(() => import("./MetricAreaChart"), { ssr: false });
const MetricScatterChart = dynamic(() => import("./MetricScatterChart"), { ssr: false });

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

export default function ExperimentStream({ dataValues }: { dataValues?: string }) {

  // 🔥 TEMP AUTH BYPASS
  const isAuthenticated = true;

  const allowedMetrics = dataValues
    ? dataValues.split(",").map(v => v.trim().toLowerCase()).filter(Boolean)
    : [];

  const [data, setData] = useState<MqttMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [deviceInput, setDeviceInput] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [customCommand, setCustomCommand] = useState("");

  type ChartType = "line" | "gauge" | "dial" | "bar" | "area" | "scatter";
  const [chartTypes, setChartTypes] = useState<Record<string, ChartType>>({});

  const selectedDeviceRef = useRef(selectedDevice);

  useEffect(() => {
    selectedDeviceRef.current = selectedDevice;
  }, [selectedDevice]);

  const metricsToDisplay = useMemo(() => {
    if (allowedMetrics.length > 0) return allowedMetrics;
    const unique = new Set(data.map(d => d.metric));
    return Array.from(unique).filter(Boolean);
  }, [data, allowedMetrics]);

  function connect() {
    if (connected) return;

    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}${process.env.NEXT_PUBLIC_WS_PATH}`
    );

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const message: MqttMessage = {
          device: raw.device?.value || raw.device || "",
          metric: raw.metric?.value || raw.metric || "",
          value: raw.value?.value || raw.value || "",
          timestamp: raw.timestamp || new Date().toISOString()
        };

        const currentDevice = selectedDeviceRef.current;

        if (allowedMetrics.length > 0 && message.metric && !allowedMetrics.includes(message.metric.toLowerCase())) {
          return;
        }

        if (!currentDevice || message.device === currentDevice) {
          setData((prev) => [...prev.slice(-199), message]);
        }

      } catch (err) {
        console.error("MQTT parse error:", err);
      }
    };

    ws.onclose = () => setConnected(false);

    setSocket(ws);
  }

  function disconnect() {
    socket?.close();
    setConnected(false);
  }

  function applyDeviceFilter() {
    setSelectedDevice(deviceInput.trim());
    setData([]);
  }

  const sendControlCommand = (device: string, action: string) => {
    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}${process.env.NEXT_PUBLIC_WS_CONTROL_PATH}`
    );

    ws.onopen = () => {
      ws.send(JSON.stringify({ device, action }));
      ws.close();
    };
  };

  function downloadCSV() {
    if (data.length === 0) return;

    const csv = [
      ["Timestamp", "Device", "Metric", "Value"],
      ...data.map(d => [d.timestamp, d.device, d.metric, d.value])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  }

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900">

      {/* 🔷 CONTROLS */}
      <div className="flex gap-3 flex-wrap">

        <button
          onClick={downloadCSV}
          className="px-4 py-2 border bg-white text-[#003366]"
        >
          Export CSV
        </button>

        <button
          onClick={connect}
          className="px-4 py-2 bg-[#003366] text-white"
        >
          Connect
        </button>

        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 text-white"
        >
          Disconnect
        </button>

      </div>

      {/* 🔷 FILTER */}
      <div className="flex gap-2">
        <input
          value={deviceInput}
          onChange={(e) => setDeviceInput(e.target.value)}
          placeholder="Device filter"
          className="border p-2"
        />
        <button onClick={applyDeviceFilter} className="bg-[#003366] text-white px-4">
          Apply
        </button>
      </div>

      {/* 🔷 METRIC CHARTS */}
      {metricsToDisplay.map((metric) => {
        const chartData = data.filter(d => d.metric === metric);
        const type = chartTypes[metric] || "line";

        return (
          <div key={metric} className="flex gap-4">

            <div className="flex-1 bg-white p-4 border">

              <select
                onChange={(e) =>
                  setChartTypes(prev => ({
                    ...prev,
                    [metric]: e.target.value as ChartType
                  }))
                }
              >
                <option value="line">Line</option>
                <option value="gauge">Gauge</option>
                <option value="dial">Dial</option>
              </select>

              {type === "line" && <MetricLineChart metric={metric} data={chartData} />}
              {type === "gauge" && <MetricGaugeChart metric={metric} data={chartData} />}
              {type === "dial" && <MetricDialChart metric={metric} data={chartData} />}

            </div>

            <div className="w-64 bg-white p-4 border">
              <MetricStats data={chartData} />
            </div>

          </div>
        );
      })}

      {/* 🔷 TERMINAL */}
      <div className="bg-black text-white p-4 h-60 overflow-y-auto">
        {data.map((d, i) => (
          <div key={i}>
            [{d.device}] {d.metric}: {d.value}
          </div>
        ))}
      </div>

<<<<<<< HEAD
      {/* Metric Charts */}
      {/* Metric Charts */}
      {metricsToDisplay.length > 0 && (
        <div className="flex flex-col gap-6 w-full mt-4 mb-2">

          {metricsToDisplay.map((metric) => {
            const chartData = selectedDevice
              ? data.filter(d => d.metric && d.metric.toLowerCase() === metric.toLowerCase())
              : [];

            const currentChartType = chartTypes[metric] || "line";

            return (
              <div key={metric} className="flex flex-col xl:flex-row gap-4 w-full">

                <div className="flex-1 border border-slate-300 bg-white shadow-sm p-4 min-w-0">

                  {/* 🔽 Per-metric dropdown */}
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-sm font-medium">Graph Type:</label>
                    <select
                      value={currentChartType}
                      onChange={(e) => {
                        const value = e.target.value as ChartType;

                        setChartTypes(prev => ({
                          ...prev,
                          [metric]: value
                        }));
                      }}
                      className="border border-slate-300 rounded px-2 py-1"
                    >
                      <option value="line">Line</option>
                      <option value="gauge">Gauge</option>
                      <option value="dial">Dial</option>
                      <option value="bar">Bar</option>
                      <option value="area">Area</option>
                      <option value="scatter">Scatter</option>
                    </select>
                  </div>

                  {currentChartType === "line" && (
                    <MetricLineChart metric={metric} data={chartData} />
                  )}

                  {currentChartType === "gauge" && (
                    <MetricGaugeChart metric={metric} data={chartData} />
                  )}

                  {currentChartType === "dial" && (
                    <MetricDialChart metric={metric} data={chartData} />
                  )}

                  {currentChartType === "bar" && (
                    <MetricBarChart metric={metric} data={chartData} />
                  )}

                  {currentChartType === "area" && (
                    <MetricAreaChart metric={metric} data={chartData} />
                  )}

                  {currentChartType === "scatter" && (
                    <MetricScatterChart metric={metric} data={chartData} />
                  )}

                </div>

                <div className="w-full xl:w-64 shrink-0 border border-slate-300 bg-white shadow-sm p-4 flex flex-col justify-center">
                  <MetricStats data={chartData} />
                </div>

              </div>
            );
          })}

        </div>
      )}

      <div className="bg-black border-2 border-slate-800 flex flex-col h-[400px]">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></span>
            <span className="text-white font-mono text-xs font-bold uppercase tracking-widest">Stream Output</span>
          </div>
          <div className="text-slate-400 font-mono text-xs font-bold uppercase">
            {data.length} Messages
          </div>
        </div>

        <div className="p-4 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed flex-1 flex flex-col gap-1 custom-scrollbar">
          {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-70">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="uppercase tracking-widest font-bold">{connected ? "WAITING FOR DATA SEQUENCE..." : "SYSTEM DISCONNECTED - CONNECT TO START"}</span>
            </div>
          ) : (
            data.map((d, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 hover:bg-slate-900 p-1.5 transition-colors border-b border-slate-900"
              >
                <div className="text-slate-500 shrink-0 font-bold whitespace-nowrap">
                  {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
                <div className="flex-1 break-all">
                  <span className="text-emerald-400 font-bold uppercase">[{d.device}]</span>
                  <span className="text-[#93c5fd] mx-2 font-bold uppercase">{d.metric}:</span>
                  <span className="text-white font-medium">{d.value}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
=======
>>>>>>> f7f93d9 (Initial commit - UI + AI + MQTT integration)
    </div>
  );
}