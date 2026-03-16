"use client";

import { useState } from "react";

export default function Home() {

  const [devices, setDevices] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await fetch("/api/devices");
    const data = await res.json();
    setDevices(data);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Smart IoT Monitoring Dashboard</h1>

      <button onClick={fetchData}>
        Fetch Device Data
      </button>

      <div style={{ marginTop: "20px" }}>
        {devices.map((device) => (
          <div key={device.id}>
            <h3>{device.device_id}</h3>
            <p>Temperature: {device.temperature}</p>
            <p>Humidity: {device.humidity}</p>
            <p>Status: {device.status}</p>
          </div>
        ))}
      </div>

    </div>
  );
}