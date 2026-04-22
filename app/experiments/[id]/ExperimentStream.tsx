"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import MetricStats from "./MetricStats";

const MetricLineChart = dynamic(() => import("./MetricLineChart"), { ssr: false });
const MetricDialChart = dynamic(() => import("./MetricDialChart"), { ssr: false });
const MetricGaugeChart = dynamic(() => import("./MetricGaugeChart"), { ssr: false });

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

export default function ExperimentStream({ dataValues }: { dataValues?: string }) {

  const allowedMetrics = dataValues
    ? dataValues.split(",").map(v => v.trim().toLowerCase()).filter(Boolean)
    : [];

  const [data, setData] = useState<MqttMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [deviceInput, setDeviceInput] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  const [chartTypes, setChartTypes] = useState<Record<string, string>>({});

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

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const message: MqttMessage = {
          device: raw.device || "",
          metric: raw.metric || "",
          value: raw.value || "",
          timestamp: raw.timestamp || new Date().toISOString()
        };

        setData(prev => [...prev.slice(-199), message]);

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

      {/* CONTROLS */}
      <div className="flex gap-3">
        <button onClick={downloadCSV} className="px-4 py-2 border bg-white">Export CSV</button>
        <button onClick={connect} className="px-4 py-2 bg-blue-600 text-white">Connect</button>
        <button onClick={disconnect} className="px-4 py-2 bg-red-600 text-white">Disconnect</button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        <input
          value={deviceInput}
          onChange={(e) => setDeviceInput(e.target.value)}
          placeholder="Device filter"
          className="border p-2"
        />
        <button onClick={applyDeviceFilter} className="bg-blue-600 text-white px-4">
          Apply
        </button>
      </div>

      {/* CHARTS */}
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
                    [metric]: e.target.value
                  }))
                }
              >
                <option value="line">Line</option>
                <option value="gauge">Gauge</option>
                <option value="dial">Dial</option>
                <option value="bar">Bar</option>
                <option value="area">Area</option>
                <option value="scatter">Scatter</option>
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

      {/* TERMINAL */}
      <div className="bg-black text-white p-4 h-60 overflow-y-auto">
        {data.map((d, i) => (
          <div key={i}>
            [{d.device}] {d.metric}: {d.value}
          </div>
        ))}
      </div>

    </div>
  );
}