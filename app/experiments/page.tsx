"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./experiments.module.css";

export default function ExperimentsPage() {

  const [experiments, setExperiments] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExperiments(data);
        } else if (Array.isArray(data.data)) {
          setExperiments(data.data);
        } else {
          setExperiments([]);
        }
      })
      .catch(() => setExperiments([]));
  }, []);

  return (
    <div className={styles.container}>

      <h1 className={styles.title}>Experiments</h1>

      <Link href="/experiments/create">
        <button className={styles.createButton}>
          + Create Experiment
        </button>
      </Link>

      <div className={styles.grid}>

        {experiments.length === 0 ? (
          <p>No experiments found</p>
        ) : (
          experiments.map((exp) => (
            <Link key={exp.uuid} href={`/experiments/${exp.uuid}`}>
              <div className={styles.card}>
                <h3>{exp.name}</h3>

                <p>
                  {exp.description
                    ? exp.description.substring(0, 120) + "..."
                    : "No description"}
                </p>

                <span className={styles.view}>
                  View Experiment →
                </span>
              </div>
            </Link>
          ))
        )}

      </div>

    </div>
  );
}