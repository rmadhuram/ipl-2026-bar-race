"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { TEAM_CONFIG } from "@/constants/teams";
import type { TeamStanding } from "@/lib/types";

const BAR_HEIGHT = 56;
const GAP = 8;
const MAX_PTS = 18;
const BADGE_WIDTH = 56;

interface Props {
  standing: TeamStanding;
}

export default function RaceBar({ standing }: Props) {
  const { team, pts, nrr, rank } = standing;
  const cfg = TEAM_CONFIG[team];
  const y = (rank - 1) * (BAR_HEIGHT + GAP);
  const fillPct = MAX_PTS > 0 ? (pts / MAX_PTS) * 100 : 0;
  const nrrStr = (nrr >= 0 ? "+" : "") + nrr.toFixed(3);

  return (
    <motion.div
      layout
      key={team}
      animate={{ y }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Team logo */}
      <div
        style={{
          width: BADGE_WIDTH,
          height: BAR_HEIGHT,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src={cfg.logo}
          alt={team}
          width={BADGE_WIDTH}
          height={BADGE_WIDTH}
          unoptimized
          style={{ objectFit: "contain", borderRadius: 4 }}
        />
      </div>

      {/* Bar fill area */}
      <div
        style={{
          flex: 1,
          height: BAR_HEIGHT,
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          background: "rgba(255,255,255,0.06)",
        }}
      >
        <motion.div
          animate={{ width: `${fillPct}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            background: cfg.primary,
            borderRadius: 6,
            minWidth: pts > 0 ? 8 : 0,
          }}
        />
        {/* Team name inside bar */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontSize: 13,
            fontWeight: 600,
            color: fillPct > 30 ? cfg.text : "#ffffff",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          {team}
        </div>
      </div>

      {/* Points */}
      <div
        style={{
          width: 36,
          textAlign: "right",
          fontWeight: 800,
          fontSize: 20,
          color: "#ffffff",
          flexShrink: 0,
        }}
      >
        {pts}
      </div>

      {/* NRR */}
      <div
        style={{
          width: 72,
          textAlign: "right",
          fontSize: 12,
          color: nrr >= 0 ? "#4ade80" : "#f87171",
          fontWeight: 600,
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {nrrStr}
      </div>
    </motion.div>
  );
}

export { BAR_HEIGHT, GAP };
