"use client";
import { TEAM_CONFIG } from "@/constants/teams";
import type { TeamPositionStats } from "@/lib/positionStats";

interface Props {
  stats: TeamPositionStats[];
}

const cell: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
  fontSize: 13,
  color: "#e5e7eb",
};

const headerCell: React.CSSProperties = {
  padding: "8px 10px",
  textAlign: "right",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

export default function PositionStatsTable({ stats }: Props) {
  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#9ca3af",
          marginBottom: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Position history — after each team's 3rd match
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <th style={{ ...headerCell, textAlign: "left", width: 80 }}>Team</th>
              <th style={headerCell}>Best</th>
              <th style={headerCell}>Worst</th>
              <th style={headerCell}>Avg</th>
              <th style={headerCell}>Median</th>
              <th style={headerCell}>Mode</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, i) => {
              const cfg = TEAM_CONFIG[row.team];
              return (
                <tr
                  key={row.team}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                  }}
                >
                  <td style={{ ...cell, textAlign: "left" }}>
                    <span
                      style={{
                        display: "inline-block",
                        background: cfg.primary,
                        color: cfg.text,
                        fontWeight: 700,
                        fontSize: 11,
                        padding: "2px 6px",
                        borderRadius: 4,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {row.abbrev}
                    </span>
                  </td>
                  <td style={{ ...cell, color: "#4ade80", fontWeight: 700 }}>
                    {row.best}
                  </td>
                  <td style={{ ...cell, color: "#f87171", fontWeight: 700 }}>
                    {row.worst}
                  </td>
                  <td style={cell}>{row.avg.toFixed(1)}</td>
                  <td style={cell}>{row.median}</td>
                  <td style={cell}>{row.mode.join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
