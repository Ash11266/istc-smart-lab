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

  const allowedMetrics = dataValues
    ? dataValues.split(",").map(v => v.trim().toLowerCase()).filter(Boolean)
    : [];

  const [data, setData] = useState<MqttMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [deviceInput, setDeviceInput] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  type ChartType = "line" | "gauge" | "dial" | "bar" | "area" | "scatter";
  const [chartTypes, setChartTypes] = useState<Record<string, ChartType>>({});
  const [chartUnits, setChartUnits] = useState<Record<string, string>>({});

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Custom Buttons state
  const [customButtons, setCustomButtons] = useState<{ label: string, message: string }[]>([]);
  const [isAddingButton, setIsAddingButton] = useState(false);
  const [newBtnLabel, setNewBtnLabel] = useState("");
  const [newBtnMessage, setNewBtnMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("smartlab_custom_buttons");
    if (saved) {
      try {
        setCustomButtons(JSON.parse(saved));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (customButtons.length >= 0) {
      localStorage.setItem("smartlab_custom_buttons", JSON.stringify(customButtons));
    }
  }, [customButtons]);

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => setIsAuthenticated(data.authenticated))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // live reference
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
          device: raw.device?.value || raw.device || "",
          metric: raw.metric?.value || raw.metric || "",
          value: raw.value?.value || raw.value || "",
          timestamp: raw.timestamp || new Date().toISOString()
        };

        const currentDevice = selectedDeviceRef.current;

        if (allowedMetrics.length > 0 && message.metric && !allowedMetrics.includes(message.metric.toLowerCase())) return;

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
      <div className="flex gap-3 flex-wrap">
        <button onClick={downloadCSV} className="px-4 py-2 border bg-white text-[#003366]">Export CSV</button>
        <button onClick={connect} className="px-4 py-2 bg-[#003366] text-white">Connect</button>
        <button onClick={disconnect} className="px-4 py-2 bg-red-600 text-white">Disconnect</button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        <input value={deviceInput} onChange={(e) => setDeviceInput(e.target.value)} placeholder="Device filter" className="border p-2" />
        <button onClick={applyDeviceFilter} className="bg-[#003366] text-white px-4">Apply</button>
      </div>

      <div className="flex flex-col mt-2 gap-4">
        <div className="bg-slate-50 p-4 border border-slate-300 flex flex-col justify-center items-center gap-3 text-center">
          <span className="text-xl font-bold text-[#003366]">Control Tools</span>

          <div className="text-sm font-medium text-slate-600">
            Target Device: <span className="font-bold text-slate-900">{selectedDevice || (data.length > 0 ? data[data.length - 1].device : "None")}</span>
          </div>

          <div className="flex gap-3 mt-2 flex-wrap justify-center items-center">
            <button
              onClick={() => sendControlCommand(selectedDevice || (data.length > 0 ? data[data.length - 1].device : ""), "start")}
              disabled={!selectedDevice && data.length === 0}
              className={`px-8 py-2 text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${(!selectedDevice && data.length === 0) ? "bg-slate-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              Start
            </button>
            <button
              onClick={() => sendControlCommand(selectedDevice || (data.length > 0 ? data[data.length - 1].device : ""), "stop")}
              disabled={!selectedDevice && data.length === 0}
              className={`px-8 py-2 text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${(!selectedDevice && data.length === 0) ? "bg-slate-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              Stop
            </button>

            {/* Custom Buttons */}
            {customButtons.map((btn, idx) => (
              <div key={idx} className="relative group flex items-center justify-center">
                <button
                  onClick={() => sendControlCommand(selectedDevice || (data.length > 0 ? data[data.length - 1].device : ""), btn.message)}
                  disabled={!selectedDevice && data.length === 0}
                  className={`px-8 py-2 text-[#003366] bg-white border-2 border-[#003366] text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${(!selectedDevice && data.length === 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-100"}`}
                >
                  {btn.label}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomButtons(prev => prev.filter((_, i) => i !== idx));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                  title="Remove custom button"
                >
                  ×
                </button>
              </div>
            ))}

            <div className="flex gap-2 border-l-2 border-slate-300 pl-3 ml-1 h-full items-center">
              <input
                type="text"
                value={customCommand}
                onChange={(e) => setCustomCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customCommand.trim() && (selectedDevice || data.length > 0)) {
                    sendControlCommand(selectedDevice || data[data.length - 1].device, customCommand.trim());
                    setCustomCommand("");
                  }
                }}
                placeholder="Custom command..."
                className="px-3 py-2 border border-slate-400 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] w-36 sm:w-56 shadow-sm"
                disabled={!selectedDevice && data.length === 0}
              />
              <button
                onClick={() => {
                  if (customCommand.trim()) {
                    sendControlCommand(selectedDevice || (data.length > 0 ? data[data.length - 1].device : ""), customCommand.trim());
                    setCustomCommand("");
                  }
                }}
                disabled={(!selectedDevice && data.length === 0) || !customCommand.trim()}
                className={`px-6 py-2 text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${(!selectedDevice && data.length === 0) || !customCommand.trim() ? "bg-slate-300 cursor-not-allowed" : "bg-[#003366] hover:bg-slate-900"}`}
              >
                Send
              </button>

              <button
                onClick={() => setIsAddingButton(!isAddingButton)}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${isAddingButton ? "bg-slate-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                title={isAddingButton ? "Cancel creating custom button" : "Create a reusable custom button"}
              >
                {isAddingButton ? "×" : "+"}
              </button>
            </div>
          </div>

          {isAddingButton && (
            <div className="flex gap-3 mt-4 p-4 bg-white border-2 border-[#003366] w-full justify-center items-center shadow-md animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-bold uppercase text-[#003366]">New Button:</span>
              <input
                type="text"
                placeholder="Label (e.g. Calibrate)"
                value={newBtnLabel}
                onChange={e => setNewBtnLabel(e.target.value)}
                className="px-3 py-2 border border-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <input
                type="text"
                placeholder="Message (e.g. CMD_CAL)"
                value={newBtnMessage}
                onChange={e => setNewBtnMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newBtnLabel && newBtnMessage) {
                    setCustomButtons([...customButtons, { label: newBtnLabel, message: newBtnMessage }]);
                    setNewBtnLabel("");
                    setNewBtnMessage("");
                    setIsAddingButton(false);
                  }
                }}
                className="px-3 py-2 border border-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
              />
              <button
                onClick={() => {
                  if (newBtnLabel && newBtnMessage) {
                    setCustomButtons([...customButtons, { label: newBtnLabel, message: newBtnMessage }]);
                    setNewBtnLabel("");
                    setNewBtnMessage("");
                    setIsAddingButton(false);
                  }
                }}
                disabled={!newBtnLabel || !newBtnMessage}
                className={`px-6 py-2 text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm ${(!newBtnLabel || !newBtnMessage) ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Charts */}
      {metricsToDisplay.length > 0 && (
        <div className="flex flex-col gap-6 w-full mt-4 mb-2">

          {metricsToDisplay.map((metric) => {
            const chartData = selectedDevice
              ? data.filter(d => d.metric && d.metric.toLowerCase() === metric.toLowerCase())
              : [];

            const currentChartType = chartTypes[metric] || "line";

            return (
              <div key={metric} className="flex gap-4">
                <div className="flex-1 bg-white p-4 border">

                  {/* 🔽 Per-metric dropdown and unit input */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
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
                        className="border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#003366]"
                      >
                        <option value="line">Line</option>
                        <option value="gauge">Gauge</option>
                        <option value="dial">Dial</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Unit:</label>
                      <input
                        type="text"
                        placeholder="e.g. °C, V"
                        value={chartUnits[metric] || ""}
                        onChange={(e) => {
                          setChartUnits(prev => ({
                            ...prev,
                            [metric]: e.target.value
                          }));
                        }}
                        className="border border-slate-300 rounded px-2 py-1 w-24 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#003366]"
                      />
                    </div>
                  </div>

                  {currentChartType === "line" && (
                    <MetricLineChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                  )}

                  {currentChartType === "gauge" && (
                    <MetricGaugeChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                  )}

                  {currentChartType === "dial" && (
                    <MetricDialChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                  )}

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