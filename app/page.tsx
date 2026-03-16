import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div style={styles.container}>

      {/* Navbar */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>CSIO Smart Lab</h2>

        <div>
          <Link href="/experiments">
            <button style={styles.navButton}>Experiments</button>
          </Link>

          <Link href="/create-experiment">
            <button style={styles.primaryButton}>Create Experiment</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Smart Experiment Monitoring Platform
        </h1>

        <p style={styles.heroText}>
          Welcome to the CSIO Smart Lab Dashboard. This platform allows
          researchers and students to manage and monitor laboratory
          experiments using an IoT and SQL powered system.
        </p>

        <div style={{ marginTop: 25 }}>
          <Link href="/experiments">
            <button style={styles.primaryButton}>
              View Experiments
            </button>
          </Link>

          <Link href="/create-experiment">
            <button style={styles.secondaryButton}>
              Create Experiment
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Platform Features</h2>

        <div style={styles.featuresGrid}>

          <div style={styles.card}>
            <h3>📊 Experiment Monitoring</h3>
            <p>
              Track experiment data collected from IoT devices and
              analyze results through the dashboard.
            </p>
          </div>

          <div style={styles.card}>
            <h3>🧪 Experiment Management</h3>
            <p>
              Create and manage experiments easily through the
              integrated database system.
            </p>
          </div>

          <div style={styles.card}>
            <h3>🔗 Data Integration</h3>
            <p>
              All experiment data is stored in an SQL database
              and linked with the dashboard interface.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        CSIO Smart Lab Dashboard • IoT Monitoring Platform
      </footer>

    </div>
  );
}


const styles: { [key: string]: React.CSSProperties } = {

  container: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fb",
    minHeight: "100vh"
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    backgroundColor: "#1f2937",
    color: "white"
  },

  logo: {
    margin: 0
  },

  navButton: {
    marginRight: 10,
    padding: "8px 14px",
    border: "none",
    cursor: "pointer"
  },

  hero: {
    textAlign: "center",
    padding: "80px 20px"
  },

  heroTitle: {
    fontSize: 40,
    marginBottom: 20
  },

  heroText: {
    maxWidth: 700,
    margin: "auto",
    fontSize: 18,
    lineHeight: "1.6",
    color: "#444"
  },

  primaryButton: {
    padding: "12px 20px",
    marginRight: 10,
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: 6,
    cursor: "pointer"
  },

  secondaryButton: {
    padding: "12px 20px",
    border: "1px solid #2563eb",
    backgroundColor: "white",
    color: "#2563eb",
    borderRadius: 6,
    cursor: "pointer"
  },

  featuresSection: {
    padding: "60px 40px"
  },

  sectionTitle: {
    textAlign: "center",
    marginBottom: 40
  },

  featuresGrid: {
    display: "flex",
    gap: 20,
    justifyContent: "center",
    flexWrap: "wrap"
  },

  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    width: 260,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  footer: {
    marginTop: 60,
    padding: 20,
    textAlign: "center",
    backgroundColor: "#1f2937",
    color: "white"
  }

};