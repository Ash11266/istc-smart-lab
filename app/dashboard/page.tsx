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

  // 🔥 IMPORTANT: live reference
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

      // ✅ always uses latest value
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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Smart Lab Dashboard</h1>

      {/* 🔌 Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={connect} disabled={connected}>
          Connect
        </button>

        <button
          onClick={disconnect}
          disabled={!connected}
          style={{ marginLeft: "10px" }}
        >
          Disconnect
        </button>
      </div>

      {/* ✍️ Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={deviceInput}
          onChange={(e) => setDeviceInput(e.target.value)}
          placeholder="Enter device name"
        />

        <button onClick={applyDeviceFilter} style={{ marginLeft: "10px" }}>
          Apply
        </button>
      </div>

      <p>
        Current Filter:{" "}
        <strong>{selectedDevice || "All Devices"}</strong>
      </p>

      <hr />

      {/* 📡 Data */}
      <div>
        {data.length === 0 && <p>No data yet...</p>}

        {data.map((d, i) => (
          <div key={i}>
            <strong>{d.device}</strong> — {d.metric}: {d.value}
          </div>
        ))}
      </div>
    </div>
  );
}