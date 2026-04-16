export default function StatusBadge({ status }) {
  // ✅ 1. Normalize the status to lowercase to ensure it matches the keys below
  const normalizedStatus = status?.toLowerCase() || "pending";

  const map = {
    pending:   { bg: "#ede9fe", color: "#6d28d9", dot: "#8b5cf6", label: "Pending" },
    confirmed: { bg: "#d1fae5", color: "#065f46", dot: "#10b981", label: "Confirmed" },
    completed: { bg: "#e0f2fe", color: "#0369a1", dot: "#0891b2", label: "Completed" },
    cancelled: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444", label: "Cancelled" },
  };

  // ✅ 2. Select the style based on the normalized lowercase string
  const s = map[normalizedStatus] || map.pending;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: s.bg, color: s.color,
      padding: "4px 12px", borderRadius: 99,
      fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
      letterSpacing: ".02em",
    }}>
      <span style={{ 
        width: 7, 
        height: 7, 
        borderRadius: "50%", 
        background: s.dot, 
        display: "inline-block" 
      }} />
      {s.label}
    </span>
  );
}