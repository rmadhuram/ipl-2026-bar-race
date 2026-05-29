"use client";

interface Props {
  isPlaying: boolean;
  speed: 1 | 2 | 4;
  frame: number;
  total: number;
  onTogglePlay: () => void;
  onSpeedChange: (s: 1 | 2 | 4) => void;
  onFrameChange: (f: number) => void;
}

export default function Controls({
  isPlaying,
  speed,
  frame,
  total,
  onTogglePlay,
  onSpeedChange,
  onFrameChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={onTogglePlay}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "#ffffff",
            color: "#000000",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: "pointer",
            border: "none",
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        {/* Scrubber */}
        <input
          type="range"
          min={0}
          max={total - 1}
          value={frame}
          onChange={(e) => onFrameChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#ffffff", cursor: "pointer" }}
        />

        {/* Frame counter */}
        <span style={{ color: "#9ca3af", fontSize: 13, flexShrink: 0, width: 60, textAlign: "right" }}>
          {frame + 1} / {total}
        </span>

        {/* Speed toggle */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {([1, 2, 4] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                background: speed === s ? "#ffffff" : "rgba(255,255,255,0.12)",
                color: speed === s ? "#000000" : "#9ca3af",
              }}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
