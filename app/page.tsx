
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <h2 className={styles.logo}>CSIO Smart Lab</h2>

        <div>
          <Link href="/experiments">
            <button className={styles.navButton}>Experiments</button>
          </Link>

          <Link href="/create-experiment">
            <button className={styles.primaryButton}>Create Experiment</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Smart Experiment Monitoring Platform
        </h1>

        <p className={styles.heroText}>
          Welcome to the CSIO Smart Lab Dashboard. This platform allows
          researchers and students to manage and monitor laboratory
          experiments using an IoT and SQL powered system.
        </p>

        <div style={{ marginTop: "25px" }}>
          <Link href="/experiments">
            <button className={styles.primaryButton}>
              View Experiments
            </button>
          </Link>

          <Link href="/create-experiment">
            <button className={styles.secondaryButton}>
              Create Experiment
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>Platform Features</h2>

        <div className={styles.featuresGrid}>

          <div className={styles.card}>
            <h3>📊 Experiment Monitoring</h3>
            <p>
              Track experiment data collected from IoT devices and
              analyze results through the dashboard.
            </p>
          </div>

          <div className={styles.card}>
            <h3>🧪 Experiment Management</h3>
            <p>
              Create and manage experiments easily through the
              integrated database system.
            </p>
          </div>

          <div className={styles.card}>
            <h3>🔗 Data Integration</h3>
            <p>
              All experiment data is stored in an SQL database
              and linked with the dashboard interface.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        CSIO Smart Lab Dashboard • IoT Monitoring Platform
      </footer>

    </div>
  );
} 
