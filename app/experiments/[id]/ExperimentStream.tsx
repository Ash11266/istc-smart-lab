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
  const [controlSocket, setControlSocket] = useState<WebSocket | null>(null);

  const [deviceInput, setDeviceInput] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [customCommand, setCustomCommand] = useState("");

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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCustomButtons(parsed);
        }
      } catch { }
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
    if (allowedMetrics.length > 0) {
      return allowedMetrics;
    }
    return Array.from(new Set(data.map(d => d.metric).filter(Boolean)));
  }, [data, allowedMetrics]);

  function connect() {
    if (connected) return;
    setData([]); // Clear old data when starting a new connection

    const wsPath = process.env.NEXT_PUBLIC_WS_PATH || "/mqtt-stream";
    const ws = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}${wsPath}`
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

    const controlPath = process.env.NEXT_PUBLIC_WS_CONTROL_PATH || "/control";
    const cWs = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_WS_HOST}:${process.env.NEXT_PUBLIC_WS_PORT}${controlPath}`
    );

    cWs.onopen = () => console.log("Control WebSocket connected to", controlPath);
    cWs.onerror = (err) => console.error("Control WebSocket error", err);
    cWs.onclose = () => console.log("Control WebSocket closed");

    setControlSocket(cWs);
  }

  function disconnect() {
    socket?.close();
    controlSocket?.close();
    setConnected(false);
  }

  function applyDeviceFilter() {
    setSelectedDevice(deviceInput.trim());
    setData([]);
  }

  function sendControlCommand(device: string, command: string) {
    if (controlSocket && controlSocket.readyState === WebSocket.OPEN) {
      controlSocket.send(JSON.stringify({
        action: "command",
        device,
        command,
        timestamp: new Date().toISOString()
      }));
    } else {
      console.warn("Control WebSocket is not connected or not ready. State:", controlSocket?.readyState);
    }
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
        <button onClick={downloadCSV} className="px-4 py-2 border bg-white text-[#003366] hover:bg-slate-50 transition-colors">Export CSV</button>
        <button
          onClick={connect}
          disabled={connected}
          className={`px-4 py-2 text-white transition-all ${connected ? "bg-slate-400 opacity-50 cursor-not-allowed" : "bg-[#003366] hover:bg-slate-800"}`}
        >
          Connect
        </button>
        <button onClick={disconnect} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors">Disconnect</button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        <input
          value={deviceInput}
          onChange={(e) => setDeviceInput(e.target.value)}
          placeholder="Device filter (leave empty for all)"
          className="border p-2 flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-[#003366]"
        />
        <button onClick={applyDeviceFilter} className="bg-[#003366] text-white px-6 hover:bg-slate-800 transition-colors">Apply</button>
      </div>

      {/* CONTROL TOOLS */}
      <div className="bg-slate-50 p-6 border border-slate-300 flex flex-col justify-center items-center gap-4 text-center rounded-xl">
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
                  sendControlCommand(selectedDevice || (data.length > 0 ? data[data.length - 1].device : ""), customCommand.trim());
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

      {/* METRIC CHARTS */}
      <div className="flex flex-col gap-6 w-full mt-4 mb-2">
        {metricsToDisplay.length > 0 ? metricsToDisplay.map((metric) => {
          const chartData = selectedDevice
            ? data.filter(d => d.device === selectedDevice && d.metric && d.metric.toLowerCase() === metric.toLowerCase())
            : data.filter(d => d.metric && d.metric.toLowerCase() === metric.toLowerCase());

          const currentChartType = chartTypes[metric] || "line";

          return (
            <div key={metric} className="flex flex-col xl:flex-row gap-4 w-full">
              <div className="flex-1 border border-slate-300 bg-white shadow-sm p-4 min-w-0">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium capitalize text-slate-700">{metric} Graph:</label>
                    <select
                      value={currentChartType}
                      onChange={(e) => {
                        const value = e.target.value as ChartType;
                        setChartTypes(prev => ({
                          ...prev,
                          [metric]: value
                        }));
                      }}
                      className="border border-slate-300 rounded-xl px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#003366]"
                    >
                      <option value="line">Line</option>
                      <option value="gauge">Gauge</option>
                      <option value="dial">Dial</option>
                      <option value="bar">Bar</option>
                      <option value="area">Area</option>
                      <option value="scatter">Scatter</option>
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
                      className="border border-slate-300 rounded-xl px-2 py-1 w-24 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#003366]"
                    />
                  </div>
                </div>

                <div className="h-[300px] w-full flex items-center justify-center">
                  {chartData.length > 0 ? (
                    <>
                      {currentChartType === "line" && (
                        <MetricLineChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                      {currentChartType === "gauge" && (
                        <MetricGaugeChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                      {currentChartType === "dial" && (
                        <MetricDialChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                      {currentChartType === "area" && (
                        <MetricAreaChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                      {currentChartType === "bar" && (
                        <MetricBarChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                      {currentChartType === "scatter" && (
                        <MetricScatterChart metric={metric} data={chartData} unit={chartUnits[metric]} />
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 italic">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
                      Waiting for data...
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full xl:w-64 shrink-0 border border-slate-300 bg-white shadow-sm p-4 flex flex-col justify-center">
                <MetricStats data={chartData} />
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col xl:flex-row gap-4 w-full">
            <div className="flex-1 border border-slate-300 bg-white shadow-sm p-4 min-w-0 h-[380px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-slate-400 italic text-center">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-[#003366] rounded-full animate-spin mb-2"></div>
                <p className="text-lg font-medium">Waiting for data stream...</p>
                <p className="text-sm">Connect to start receiving experiment metrics</p>
              </div>
            </div>
            <div className="w-full xl:w-64 shrink-0 border border-slate-300 bg-white shadow-sm p-4 flex flex-col justify-center">
              <MetricStats data={[]} />
            </div>
          </div>
        )}
      </div>

      {/* TERMINAL */}
      <div className="bg-black text-white p-4 h-60 overflow-y-auto mb-6 rounded-xl">
        {data.length === 0 && <span className="text-slate-500 italic text-sm">No data received yet...</span>}
        {data.map((d, i) => (
          <div key={i} className="text-sm font-mono opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-slate-400">[{new Date(d.timestamp).toLocaleTimeString()}]</span>{" "}
            <span className="text-emerald-300">[{d.device}]</span>{" "}
            <span className="text-blue-300">{d.metric}:</span> {d.value}
          </div>
        ))}
      </div>
    </div>
  );
}