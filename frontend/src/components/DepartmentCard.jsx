const icons = {
  Cardiology:   { icon: "🫀", color: "#fee2e2", border: "#fca5a5", text: "#991b1b" },
  General:      { icon: "🩺", color: "#f0fdf4", border: "#86efac", text: "#166534" },
  Orthopedics:  { icon: "🦴", color: "#fff7ed", border: "#fdba74", text: "#9a3412" },
  Neurology:    { icon: "🧠", color: "#faf5ff", border: "#d8b4fe", text: "#6b21a8" },
  Pediatrics:   { icon: "👶", color: "#fff0f6", border: "#f9a8d4", text: "#9d174d" },
  Dermatology:  { icon: "✨", color: "#fefce8", border: "#fde047", text: "#854d0e" },
  ENT:          { icon: "👂", color: "#f0f9ff", border: "#7dd3fc", text: "#0c4a6e" },
};

export default function DepartmentCard({ dept, count, onClick }) {
  const s = icons[dept] || icons.General;
  return (
    <div onClick={onClick} style={{
      background: s.color, border: `1.5px solid ${s.border}`,
      borderRadius: 16, padding: "20px 18px",
      cursor: "pointer", transition: "transform .18s, box-shadow .18s",
      display: "flex", flexDirection: "column", gap: 8,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.1)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <span style={{ fontSize: 28 }}>{s.icon}</span>
      <span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15, color: s.text }}>{dept}</span>
      {count !== undefined && (
        <span style={{ fontFamily: "'Sora',sans-serif", fontSize: 12, color: s.text, opacity: .7 }}>
          {count} doctor{count !== 1 ? "s" : ""} available
        </span>
      )}
    </div>
  );
}