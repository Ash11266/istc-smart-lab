"use client";

import { useState } from "react";

// ✅ Define proper type
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

  function connect() {
    if (connected) return;

    const ws = new WebSocket("ws://localhost:1880/mqtt-stream");

    ws.onopen = () => {
      console.log("Connected to Node-RED WebSocket");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message: MqttMessage = JSON.parse(event.data);

      setData(prev => [...prev, message]);
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Smart Lab Dashboard</h1>

      <button onClick={connect} disabled={connected}>
        Connect
      </button>

      <button onClick={disconnect} disabled={!connected}>
        Disconnect
      </button>

      <hr />

      <div>
        {data.map((d, i) => (
          <div key={i}>
            <strong>{d.device}</strong> — {d.metric}: {d.value}
          </div>
        ))}
      </div>
    </div>
  );
}