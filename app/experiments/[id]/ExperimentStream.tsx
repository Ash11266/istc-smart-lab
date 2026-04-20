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
  // Parse allowed metrics
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

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Custom Buttons state
  const [customButtons, setCustomButtons] = useState<{label: string, message: string}[]>([]);
  const [isAddingButton, setIsAddingButton] = useState(false);
  const [newBtnLabel, setNewBtnLabel] = useState("");
  const [newBtnMessage, setNewBtnMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("smartlab_custom_buttons");
    if (saved) {
      try {
        setCustomButtons(JSON.parse(saved));
      } catch (e) {}
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

  // keep ref updated
  useEffect(() => {
    selectedDeviceRef.current = selectedDevice;
  }, [selectedDevice]);

  // Determine active metrics
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
      console.log("Connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);

        const extractStringOrValue = (obj: any): string => {
          if (obj === null || obj === undefined) return "";
          if (typeof obj === 'object') {
            return 'value' in obj ? String(obj.value) : JSON.stringify(obj);
          }
          return String(obj);
        };

        const extractValue = (obj: any): number | string => {
          if (obj === null || obj === undefined) return "";
          if (typeof obj === 'object') {
            return 'value' in obj ? obj.value : JSON.stringify(obj);
          }
          return obj;
        };

        const message: MqttMessage = {
          device: extractStringOrValue(raw.device),
          metric: extractStringOrValue(raw.metric),
          value: extractValue(raw.value),
          timestamp: raw.timestamp ? extractStringOrValue(raw.timestamp) : new Date().toISOString()
        };

        const currentDevice = selectedDeviceRef.current;

        // Filter by metric if dataValues are provided
        if (allowedMetrics.length > 0 && message.metric && !allowedMetrics.includes(message.metric.toLowerCase())) {
          return; // Ignore this message as it doesn't match the required metrics
        }

        // always uses latest value
        if (!currentDevice || message.device === currentDevice) {
          setData((prev) => [...prev.slice(-199), message]);
        }
      } catch (err) {
        console.error("Error parsing MQTT websocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected");
      setConnected(false);
    };

    setSocket(ws);
  }

  function disconnect() {
    socket?.close();
    setConnected(false);
  }

  function applyDeviceFilter() {
    setSelectedDevice(deviceInput.trim());
    setData([]); // clear old data
  }

  const sendControlCommand = (device: string, action: string) => {
    try {
      const host = (process.env.NEXT_PUBLIC_WS_HOST || '').trim();
      const port = (process.env.NEXT_PUBLIC_WS_PORT || '').trim();
      const path = (process.env.NEXT_PUBLIC_WS_CONTROL_PATH || '').trim();
      const wsControlUrl = `ws://${host}:${port}${path}`;
      const ws = new WebSocket(wsControlUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ device, action }));
        ws.close();
      };
      ws.onerror = (err) => {
        console.error("Control WebSocket error:", err);
      };
    } catch (err) {
      console.error("Error creating control websocket:", err);
    }
  };

  function downloadCSV() {
    if (data.length === 0) return;

    const headers = ["Timestamp", "Device", "Metric", "Value"];
    const rows = data.map(d => [
      d.timestamp || new Date().toISOString(),
      d.device,
      d.metric,
      d.value
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `experiment_data_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#003366] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 border-2 border-dashed border-slate-300 gap-4 mt-4">
        <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        <span className="uppercase tracking-widest font-bold text-lg text-slate-700">Authentication Required</span>
        <p className="text-center font-medium max-w-md">You must be logged in to connect to the telemetry stream and view real-time data from devices.</p>
        <a href="/login" className="mt-2 text-center px-6 py-2.5 font-bold uppercase tracking-wide text-sm transition-colors border-2 shadow-sm bg-[#003366] border-[#003366] hover:bg-slate-900 text-white">
          Log In Now
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={downloadCSV}
            disabled={data.length === 0}
            className={`flex items-center gap-2 px-6 py-2.5 font-bold uppercase tracking-wide text-sm transition-colors border-2 shadow-sm ${data.length === 0
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
              : "bg-white border-[#003366] text-[#003366] hover:bg-slate-50"
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export CSV
          </button>

          <button
            onClick={connect}
            disabled={connected}
            className={`relative px-6 py-2.5 font-bold uppercase tracking-wide text-sm transition-colors border-2 shadow-sm ${connected
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
              : "bg-[#003366] border-[#003366] hover:bg-slate-900 text-white"
              }`}
          >
            {connected && (
              <span className="absolute flex h-2.5 w-2.5 top-[-3px] right-[-3px]">
                <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 bg-emerald-500 border-2 border-white"></span>
              </span>
            )}
            {connected ? "Connected" : "Connect Stream"}
          </button>

          <button
            onClick={disconnect}
            disabled={!connected}
            className={`px-6 py-2.5 font-bold uppercase tracking-wide text-sm transition-colors border-2 shadow-sm ${!connected
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
              : "bg-red-700 border-red-700 hover:bg-red-800 text-white"
              }`}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-50 p-4 border border-slate-300 flex flex-col justify-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={deviceInput}
              onChange={(e) => setDeviceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyDeviceFilter()}
              className="flex-1 px-4 py-2 border border-slate-400 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-[#003366]"
              placeholder="Filter by device identifier..."
            />
            <button
              onClick={applyDeviceFilter}
              className="px-6 py-2 bg-[#003366] hover:bg-slate-900 text-white text-sm font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Apply Filter
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border border-slate-300 flex flex-col justify-center items-center text-center">
          <span className="text-xs uppercase tracking-widest text-slate-600 font-bold mb-1">Active Filter</span>
          <span className="text-lg font-bold text-[#003366] truncate w-full">{selectedDevice || "NO DEVICE SELECTED"}</span>
        </div>
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
    </div>
  );
}
