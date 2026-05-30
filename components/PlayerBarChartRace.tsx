"use client";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PlayerBar, { PLAYER_BAR_HEIGHT, PLAYER_GAP } from "@/components/PlayerBar";
import Controls from "@/components/Controls";
import type { PlayerSnapshot } from "@/lib/types";

const SPEEDS: Record<1 | 2 | 4, number> = { 1: 1200, 2: 700, 4: 350 };
const CONTAINER_HEIGHT = 10 * (PLAYER_BAR_HEIGHT + PLAYER_GAP);

interface Props {
  snapshots: PlayerSnapshot[];
}

export default function PlayerBarChartRace({ snapshots }: Props) {
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setFrame((f) => {
        if (f >= snapshots.length - 1) {
          setIsPlaying(false);
          return f;
        }
        return f + 1;
      });
    }, SPEEDS[speed]);
    return () => clearInterval(id);
  }, [isPlaying, speed, snapshots.length]);

  const snapshot = snapshots[frame];

  // Fixed scale: use the all-time leader's final total so bar widths
  // only animate when a player actually scores, not when the scale shifts.
  const maxRuns = useMemo(
    () => snapshots[snapshots.length - 1].standings[0]?.runs ?? 1,
    [snapshots]
  );

  // All players that ever appear in any top-10, in first-seen order.
  // Always rendered so there are no mount-triggered initial animations.
  const allPlayers = useMemo(() => {
    const seen = new Map<string, string>(); // player -> team
    for (const snap of snapshots) {
      for (const s of snap.standings) {
        if (!seen.has(s.player)) seen.set(s.player, s.team);
      }
    }
    return Array.from(seen.entries()).map(([player, team]) => ({ player, team }));
  }, [snapshots]);

  // Current frame standings for O(1) lookup
  const standingMap = useMemo(
    () => new Map(snapshot.standings.map((s) => [s.player, s])),
    [snapshot]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Match header */}
      <div style={{ textAlign: "center" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={snapshot.matchNumber}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>
              {snapshot.label}
            </div>
            <div style={{ fontSize: 14, color: "#9ca3af", marginTop: 4 }}>
              {new Date(snapshot.date + "T00:00:00").toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <div style={{ width: 39, flexShrink: 0 }}>Team</div>
        <div style={{ flex: 1 }}>Runs scored</div>
        <div style={{ width: 28, textAlign: "right", flexShrink: 0 }}>INNS</div>
        <div style={{ width: 28, textAlign: "right", flexShrink: 0, color: "#fbbf24" }}>50</div>
        <div style={{ width: 28, textAlign: "right", flexShrink: 0, color: "#fb923c" }}>100</div>
        <div style={{ width: 48, textAlign: "right", flexShrink: 0 }}>Runs</div>
      </div>

      {/* Bars — all ever-seen players always mounted; position/opacity drive enter/exit */}
      <div style={{ position: "relative", height: CONTAINER_HEIGHT, overflow: "hidden" }}>
        {allPlayers.map(({ player, team }) => {
          const standing = standingMap.get(player) ?? { player, team, runs: 0, innings: 0, fifties: 0, hundreds: 0, rank: 11 };
          return (
            <PlayerBar
              key={player}
              standing={standing}
              maxRuns={maxRuns}
            />
          );
        })}
      </div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        speed={speed}
        frame={frame}
        total={snapshots.length}
        onTogglePlay={() => {
          if (frame >= snapshots.length - 1) setFrame(0);
          setIsPlaying((p) => !p);
        }}
        onSpeedChange={setSpeed}
        onFrameChange={(f) => {
          setFrame(f);
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
