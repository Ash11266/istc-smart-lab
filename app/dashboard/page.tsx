"use client";

import { useState, useRef, useEffect } from "react";

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

export default function Dashboard() {
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

    const ws = new WebSocket("ws://localhost:1880/mqtt-stream");

    ws.onopen = () => {
      console.log("Connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message: MqttMessage = JSON.parse(event.data);
      const currentDevice = selectedDeviceRef.current;

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
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-8 animate-in mt-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Live Stream Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Monitor real-time MQTT telemetry data across devices
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={connect}
            disabled={connected}
            className={`relative px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              connected 
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            }`}
          >
            {connected && (
              <span className="absolute flex h-3 w-3 top-[-4px] right-[-4px]">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
              </span>
            )}
            {connected ? "Connected" : "Connect"}
          </button>
          
          <button
            onClick={disconnect}
            disabled={!connected}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
              !connected 
                ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" 
                : "bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5"
            }`}
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Controls Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Filter by Device Name
          </label>
          <div className="flex gap-3">
             <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={deviceInput}
                  onChange={(e) => setDeviceInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyDeviceFilter()}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  placeholder="Enter device identifier..."
                />
             </div>
            <button
              onClick={applyDeviceFilter}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors"
            >
              Filter
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 flex flex-col justify-center">
          <h3 className="text-indigo-800 dark:text-indigo-300 font-medium text-sm mb-1 uppercase tracking-wider">
            Active Filter
          </h3>
          <p className="text-2xl font-bold text-slate-900 dark:text-white truncate">
            {selectedDevice || "All Devices"}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${connected ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
            </span>
            {connected ? "Receiving live stream" : "Disconnected"}
          </div>
        </div>
      </div>

      {/* Real-time Data Output */}
      <div className="bg-slate-900 dark:bg-black rounded-2xl shadow-xl border border-slate-800 overflow-hidden flex flex-col min-h-[400px]">
        <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <h3 className="text-white font-mono text-sm tracking-wider">Terminal Output</h3>
          </div>
          <div className="text-slate-400 font-mono text-xs">
            {data.length} messages
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[500px] font-mono text-sm leading-relaxed flex-1 flex flex-col gap-1.5 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          {data.length === 0 ? (
             <div className="h-full flex items-center justify-center text-slate-500 gap-3">
               <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               <p>Awaiting incoming telemetry data...</p>
             </div>
          ) : (
            data.map((d, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 hover:bg-slate-800/50 p-1.5 rounded transition-colors group animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="text-slate-500 shrink-0 w-24">
                  {d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
                <div className="flex-1 w-full flex items-center">
                  <span className="text-emerald-400 font-bold min-w-[120px] shrink-0">
                    [{d.device}]
                  </span>
                  <span className="text-indigo-300 mx-2 uppercase text-xs tracking-wider min-w-[80px]">
                    {d.metric}
                  </span>
                  <span className="text-white">
                    {d.value}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}