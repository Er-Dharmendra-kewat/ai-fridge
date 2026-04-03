import React from "react";

export default function MiniBar({ data, color }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
      {data.map((v, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: `${(v / max) * 100}%`,
            background: color,
            borderRadius: 2,
            opacity: 0.7 + (i / data.length) * 0.3,
            transition: "height 0.5s ease",
          }}
        />
      ))}
    </div>
  );
}