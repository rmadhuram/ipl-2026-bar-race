import { processData } from "@/lib/processData";
import BarChartRace from "@/components/BarChartRace";

export default function Home() {
  const snapshots = processData();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 24px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#ffffff",
          }}
        >
          IPL 2026 — Points Race
        </h1>
        <p style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
          Team standings after each match · sorted by points, then NRR
        </p>
      </div>

      <BarChartRace snapshots={snapshots} />
    </main>
  );
}
