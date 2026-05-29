"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { TEAM_CONFIG } from "@/constants/teams";
import type { WicketStanding } from "@/lib/types";

export const WICKET_BAR_HEIGHT = 52;
export const WICKET_GAP = 8;

interface Props {
  standing: WicketStanding;
  maxWickets: number;
}

export default function WicketBar({ standing, maxWickets }: Props) {
  const { player, team, wickets, economy, rank } = standing;
  const cfg = TEAM_CONFIG[team];
  const y = (rank - 1) * (WICKET_BAR_HEIGHT + WICKET_GAP);
  const fillPct = maxWickets > 0 ? (wickets / maxWickets) * 100 : 0;

  return (
    <motion.div
      layout
      key={player}
      animate={{ y }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: WICKET_BAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Team logo */}
      <div
        style={{
          width: 39,
          height: WICKET_BAR_HEIGHT,
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
          height: WICKET_BAR_HEIGHT,
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
            minWidth: wickets > 0 ? 8 : 0,
          }}
        />
        {/* Player name + team abbrev */}
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

      {/* Wickets */}
      <div
        style={{
          width: 32,
          textAlign: "right",
          fontWeight: 800,
          fontSize: 18,
          color: "#ffffff",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {wickets}
      </div>

      {/* Economy */}
      <div
        style={{
          width: 52,
          textAlign: "right",
          fontSize: 12,
          fontWeight: 600,
          color: "#9ca3af",
          flexShrink: 0,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {economy.toFixed(2)}
      </div>
    </motion.div>
  );
}
