"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateExperiment() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [components, setComponents] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const res = await fetch("/api/experiments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, components }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/experiments");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 40 }}>

      <h1>Create Experiment</h1>

      <form onSubmit={handleSubmit}>

        <input
          placeholder="Experiment Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Components"
          value={components}
          onChange={(e) => setComponents(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Create Experiment
        </button>

      </form>

    </div>
  );
}