"use client";
import { useState } from "react";
import BarChartRace from "@/components/BarChartRace";
import PlayerBarChartRace from "@/components/PlayerBarChartRace";
import type { MatchSnapshot, PlayerSnapshot } from "@/lib/types";

interface Props {
  teamSnapshots: MatchSnapshot[];
  playerSnapshots: PlayerSnapshot[];
}

const TABS = ["Teams", "Top Run Scorers"] as const;
type Tab = (typeof TABS)[number];

export default function Tabs({ teamSnapshots, playerSnapshots }: Props) {
  const [active, setActive] = useState<Tab>("Teams");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              color: active === tab ? "#ffffff" : "#6b7280",
              borderBottom: active === tab ? "2px solid #ffffff" : "2px solid transparent",
              marginBottom: -1,
              transition: "color 0.15s, border-color 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {active === "Teams" ? (
        <BarChartRace snapshots={teamSnapshots} />
      ) : (
        <PlayerBarChartRace snapshots={playerSnapshots} />
      )}
    </div>
  );
}
