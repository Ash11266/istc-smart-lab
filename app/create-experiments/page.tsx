"use client";

import { useState } from "react";
import styles from "./create.module.css";
import { useRouter } from "next/navigation";

export default function CreateExperiment() {

  const router = useRouter();

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [components,setComponents] = useState("");

  const handleSubmit = async (e:any) => {

    e.preventDefault();

    await fetch("/api/experiments",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        name,
        description,
        components
      })
    });

    router.push("/experiments");
  };

  return (

    <div className={styles.container}>

      <h1>Create Experiment</h1>

      <form onSubmit={handleSubmit} className={styles.form}>

        <input
          placeholder="Experiment Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Experiment Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <textarea
          placeholder="Components Used"
          value={components}
          onChange={(e)=>setComponents(e.target.value)}
        />

        <button type="submit">
          Create Experiment
        </button>

      </form>

    </div>
  );
}