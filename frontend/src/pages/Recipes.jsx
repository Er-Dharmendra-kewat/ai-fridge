import { useState } from "react";

const INVENTORY = [
  { id: 1, name: "Whole Milk",      qty: 1, icon: "🥛" },
  { id: 2, name: "Free-Range Eggs", qty: 6, icon: "🥚" },
  { id: 3, name: "Roma Tomatoes",   qty: 3, icon: "🍅" },
  { id: 4, name: "Aged Cheddar",    qty: 1, icon: "🧀" },
  { id: 5, name: "Sourdough Bread", qty: 1, icon: "🍞" },
  { id: 6, name: "Baby Spinach",    qty: 1, icon: "🥬" },
  { id: 7, name: "Greek Yogurt",    qty: 2, icon: "🫙" },
  { id: 9, name: "Butter",          qty: 1, icon: "🧈" },
  { id: 10, name: "Red Onion",      qty: 2, icon: "🧅" },
];

const RECIPES = [
  { id: 1, name: "Cheese Omelette",   time: "10 min", difficulty: "Easy",   ingredients: ["Eggs", "Cheddar", "Butter"],               emoji: "🍳", desc: "Fluffy omelette with melted cheddar." },
  { id: 2, name: "Tomato & Egg Toast",time: "15 min", difficulty: "Easy",   ingredients: ["Eggs", "Tomatoes", "Bread", "Butter"],      emoji: "🥪", desc: "Buttered toast with fried egg and tomatoes." },
  { id: 3, name: "Spinach Frittata",  time: "20 min", difficulty: "Medium", ingredients: ["Eggs", "Spinach", "Cheddar", "Onion"],      emoji: "🥘", desc: "Italian baked egg dish with spinach." },
  { id: 4, name: "Grilled Cheese",    time: "8 min",  difficulty: "Easy",   ingredients: ["Bread", "Cheddar", "Butter"],               emoji: "🫓", desc: "Golden crispy bread with gooey cheese." },
  { id: 5, name: "Tomato Bruschetta", time: "12 min", difficulty: "Easy",   ingredients: ["Bread", "Tomatoes", "Onion"],               emoji: "🍅", desc: "Toasted bread with fresh tomato salsa." },
  { id: 6, name: "Yogurt Parfait",    time: "5 min",  difficulty: "Easy",   ingredients: ["Yogurt", "Milk"],                           emoji: "🍨", desc: "Creamy yogurt with fresh ingredients." },
];

export default function Recipes() {
  const [selected,  setSelected]  = useState(null);
  const [aiPrompt,  setAiPrompt]  = useState("");
  const [aiResult,  setAiResult]  = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const askAI = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult("");
    try {
      const fridgeItems = INVENTORY.filter((i) => i.qty > 0).map((i) => i.name).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `My fridge contains: ${fridgeItems}.\n\nUser question: ${aiPrompt}\n\nSuggest a recipe or answer the cooking question based on these ingredients. Be concise and practical.` }],
        }),
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || "No response received.");
    } catch (e) {
      setAiResult("Could not connect to AI. Please try again.");
    }
    setAiLoading(false);
  };

  return (
    <div style={{ padding: "0 0 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f8fafc", marginBottom: 6, letterSpacing: -0.5 }}>AI Recipes</h1>
      <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Smart suggestions based on what's in your fridge right now.</p>

      {/* Ingredient chips */}
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 18, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Available Ingredients</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INVENTORY.filter((i) => i.qty > 0).map((i) => (
            <span key={i.id} style={{ background: "#1e293b", border: "1px solid #334155", padding: "5px 12px", borderRadius: 20, fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
              {i.icon} {i.name}
            </span>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div style={{ background: "linear-gradient(135deg, #0c1a2e, #0f172a)", border: "1px solid #1e3a5f", borderRadius: 16, padding: 22, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8", marginBottom: 14, textTransform: "uppercase", letterSpacing: 0.8 }}>🧠 Ask the AI Chef</div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askAI()}
            placeholder="e.g. What can I cook for dinner tonight?"
            style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
          />
          <button onClick={askAI} disabled={aiLoading}
            style={{ padding: "10px 22px", background: aiLoading ? "#334155" : "#38bdf8", border: "none", borderRadius: 10, color: aiLoading ? "#64748b" : "#0f172a", fontWeight: 700, fontSize: 13, cursor: aiLoading ? "default" : "pointer" }}>
            {aiLoading ? "Thinking..." : "Ask →"}
          </button>
        </div>
        {aiResult && (
          <div style={{ marginTop: 16, background: "#1e293b", borderRadius: 10, padding: 16, fontSize: 13, color: "#cbd5e1", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {aiResult}
          </div>
        )}
      </div>

      {/* Recipe cards */}
      <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 16 }}>Suggested Recipes</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {RECIPES.map((r) => (
          <div key={r.id} onClick={() => setSelected(selected?.id === r.id ? null : r)}
            style={{ background: "#0f172a", border: selected?.id === r.id ? "1px solid #38bdf8" : "1px solid #1e293b", borderRadius: 16, padding: 20, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{r.emoji}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>{r.name}</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{r.desc}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, background: "rgba(56,189,248,0.1)", color: "#38bdf8", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>⏱ {r.time}</span>
              <span style={{ fontSize: 11, background: "#1e293b", color: "#94a3b8", padding: "2px 8px", borderRadius: 12, fontWeight: 600 }}>{r.difficulty}</span>
            </div>
            {selected?.id === r.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1e293b" }}>
                <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Ingredients</div>
                {r.ingredients.map((i) => (
                  <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "3px 0" }}>• {i}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}