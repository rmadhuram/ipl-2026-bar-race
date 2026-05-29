"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TEAM_CONFIG } from "@/constants/teams";
import type { PlayerStanding } from "@/lib/types";

export const PLAYER_BAR_HEIGHT = 52;
export const PLAYER_GAP = 8;
const ENTRY_Y = 10 * (PLAYER_BAR_HEIGHT + PLAYER_GAP);

interface Props {
  standing: PlayerStanding;
  maxRuns: number;
}

function PlayerBar({ standing, maxRuns }: Props) {
  const { player, team, runs, rank } = standing;
  const cfg = TEAM_CONFIG[team];
  const y = (rank - 1) * (PLAYER_BAR_HEIGHT + PLAYER_GAP);
  const fillPct = maxRuns > 0 ? (runs / maxRuns) * 100 : 0;

  return (
    <motion.div
      key={player}
      initial={{ y: ENTRY_Y, opacity: 0 }}
      animate={{ y, opacity: 1 }}
      exit={{ y: ENTRY_Y, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: PLAYER_BAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Team logo */}
      <div
        style={{
          width: 39,
          height: PLAYER_BAR_HEIGHT,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cfg && (
          <Image
            src={cfg.logo}
            alt={team}
            width={39}
            height={39}
            unoptimized
            style={{ objectFit: "contain", borderRadius: 4 }}
          />
        )}
      </div>

      {/* Bar fill area */}
      <div
        style={{
          flex: 1,
          height: PLAYER_BAR_HEIGHT,
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
            background: cfg?.primary ?? "#555",
            borderRadius: 6,
            minWidth: runs > 0 ? 8 : 0,
          }}
        />
        {/* Player name + team inside bar */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: fillPct > 25 ? (cfg?.text ?? "#fff") : "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            {player}
          </span>
          {fillPct > 40 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: fillPct > 40 ? (cfg?.text ?? "#fff") : "#9ca3af",
                opacity: 0.75,
                whiteSpace: "nowrap",
              }}
            >
              {cfg?.abbrev ?? team}
            </span>
          )}
        </div>
      </div>

      {/* Runs */}
      <div
        style={{
          width: 48,
          textAlign: "right",
          fontWeight: 800,
          fontSize: 18,
          color: "#ffffff",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {runs}
      </div>
    </motion.div>
  );
}

export default React.memo(PlayerBar, (prev, next) =>
  prev.standing.player === next.standing.player &&
  prev.standing.rank === next.standing.rank &&
  prev.standing.runs === next.standing.runs &&
  prev.maxRuns === next.maxRuns
);
