import { processData } from "@/lib/processData";
import { processPlayerData } from "@/lib/processPlayerData";
import { processWicketData } from "@/lib/processWicketData";
import Tabs from "@/components/Tabs";

export default function Home() {
  const teamSnapshots = processData();
  const playerSnapshots = processPlayerData();
  const wicketSnapshots = processWicketData();

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
          IPL 2026 — Season Race
        </h1>
        <p style={{ marginTop: 8, color: "#6b7280", fontSize: 14 }}>
          Animated standings across all 70 league matches
        </p>
      </div>

      <Tabs
        teamSnapshots={teamSnapshots}
        playerSnapshots={playerSnapshots}
        wicketSnapshots={wicketSnapshots}
      />
    </main>
  );
}
