"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RaceBar, { BAR_HEIGHT, GAP } from "@/components/RaceBar";
import Controls from "@/components/Controls";
import type { MatchSnapshot } from "@/lib/types";

const SPEEDS: Record<1 | 2 | 4, number> = { 1: 1200, 2: 700, 4: 350 };
const CONTAINER_HEIGHT = 10 * (BAR_HEIGHT + GAP);

interface Props {
  snapshots: MatchSnapshot[];
}

export default function BarChartRace({ snapshots }: Props) {
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
          paddingRight: 0,
          fontSize: 11,
          fontWeight: 600,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <div style={{ width: 39, flexShrink: 0 }}>Team</div>
        <div style={{ flex: 1 }}>Points progress</div>
        <div style={{ width: 36, textAlign: "right", flexShrink: 0 }}>Pts</div>
        <div style={{ width: 72, textAlign: "right", flexShrink: 0 }}>NRR</div>
      </div>

      {/* Bars */}
      <div style={{ position: "relative", height: CONTAINER_HEIGHT }}>
        {snapshot.standings.map((standing) => (
          <RaceBar
            key={standing.team}
            standing={standing}
          />
        ))}
      </div>

      {/* Controls */}
      <Controls
        isPlaying={isPlaying}
        speed={speed}
        frame={frame}
        total={snapshots.length}
        onTogglePlay={() => {
          if (frame >= snapshots.length - 1) {
            setFrame(0);
          }
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
