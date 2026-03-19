"use client";

import { useState, useRef, useEffect } from "react";

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

  // live reference
  const selectedDeviceRef = useRef(selectedDevice);

  // keep ref updated
  useEffect(() => {
    selectedDeviceRef.current = selectedDevice;
  }, [selectedDevice]);

  function connect() {
    if (connected) return;

    // Use absolute URL if possible, assuming ws://localhost:1880/mqtt-stream from original logic
    const ws = new WebSocket("ws://localhost:1880/mqtt-stream");

    ws.onopen = () => {
      console.log("Connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message: MqttMessage = JSON.parse(event.data);
      const currentDevice = selectedDeviceRef.current;

      // Filter by metric if dataValues are provided
      if (allowedMetrics.length > 0 && message.metric && !allowedMetrics.includes(message.metric.toLowerCase())) {
        return; // Ignore this message as it doesn't match the required metrics
      }

      // always uses latest value
      if (!currentDevice || message.device === currentDevice) {
        setData((prev) => [...prev.slice(-49), message]);
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

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Live Telemetry Stream
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={connect}
            disabled={connected}
            className={`relative px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              connected 
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:-translate-y-0.5"
            }`}
          >
            {connected && (
              <span className="absolute flex h-2.5 w-2.5 top-[-3px] right-[-3px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            )}
            {connected ? "Connected" : "Connect"}
          </button>
          
          <button
            onClick={disconnect}
            disabled={!connected}
            className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              !connected 
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" 
                : "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:-translate-y-0.5"
            }`}
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center">
          <div className="flex gap-2">
            <input
              type="text"
              value={deviceInput}
              onChange={(e) => setDeviceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyDeviceFilter()}
              className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              placeholder="Filter by device identifier..."
            />
            <button
              onClick={applyDeviceFilter}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center">
           <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">Active Filter</span>
           <span className="text-lg font-bold text-slate-900 dark:text-white truncate w-full">{selectedDevice || "All Devices"}</span>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-black rounded-xl shadow-inner border border-slate-800 overflow-hidden flex flex-col h-[400px]">
        <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="text-white font-mono text-xs tracking-wider">Stream Output</span>
          </div>
          <div className="text-slate-400 font-mono text-xs">
            {data.length} msg
          </div>
        </div>

        <div className="p-4 overflow-y-auto font-mono text-xs leading-relaxed flex-1 flex flex-col gap-1 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {data.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 opacity-50">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
               <span>{connected ? "Waiting for incoming data..." : "Connect to start receiving data"}</span>
             </div>
          ) : (
            data.map((d, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 hover:bg-slate-800/50 p-1 rounded transition-colors"
              >
                <div className="text-slate-500 shrink-0">
                  {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
                <div className="flex-1 truncate">
                  <span className="text-emerald-400 font-bold">[{d.device}]</span>
                  <span className="text-indigo-300 mx-2">{d.metric}:</span>
                  <span className="text-white">{d.value}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
