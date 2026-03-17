"use client";

import { useState, useRef } from "react";

type MqttMessage = {
  device: string;
  metric: string;
  value: number | string;
  timestamp: string;
};

export default function Dashboard() {
  const [data, setData] = useState<MqttMessage[]>([]);
  const [connected, setConnected] = useState(false);

  // ✅ useRef instead of state
  const socketRef = useRef<WebSocket | null>(null);

  function connect() {
    if (connected) return;

    const ws = new WebSocket("ws://localhost:1880/mqtt-stream");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected");
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
  }

  function disconnect() {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      setConnected(false);
    }
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

      {data.map((d, i) => (
        <div key={i}>
          <strong>{d.device}</strong> — {d.metric}: {d.value}
        </div>
      ))}
    </div>
  );
}