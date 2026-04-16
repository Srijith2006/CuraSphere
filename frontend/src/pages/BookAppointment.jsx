import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selSlot, setSelSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // ✅ Fetching doctor details and filtering only unbooked slots
    API.get(`/doctors/${doctorId}`)
      .then((r) => {
        setDoctor(r.data);
        // Supports both 'availableSlots' or just 'slots' depending on your model
        const allSlots = r.data.availableSlots || r.data.slots || [];
        setSlots(allSlots.filter((s) => !s.isBooked));
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Could not load doctor details. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  const submit = async () => {
    // 1. Client-side validation
    if (!selSlot) {
      setError("Please select a time slot.");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for the visit.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // ✅ RECTIFIED PAYLOAD: Standardizing field names to match common Backend Schemas
      const payload = {
        doctorId: doctorId,
        patientId: user._id,
        patientName: user.name,
        doctorName: doctor.name,
        department: doctor.department,
        date: selSlot.date,
        timeSlot: selSlot.time, // Matches your Slot Model
        time: selSlot.time,     // Backup naming convention
        reason: reason.trim(),
        status: "pending"
      };

      // Ensure the endpoint matches your Backend Route
      await API.post("/appointments", payload);
      
      setSuccess(true);
    } catch (e) {
      // ✅ Detailed error logging for debugging
      const msg = e.response?.data?.message || "Booking failed. The slot may have been taken.";
      setError(msg);
      console.error("Booking Error:", e.response?.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#0891b2", animation: "spin .7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (success) return (
    <div style={s.page}>
      <div style={s.successCard}>
        <div style={s.successIcon}>🎉</div>
        <h2 style={s.successTitle}>Appointment Booked!</h2>
        <p style={s.successSub}>Your appointment with Dr. {doctor?.name} has been submitted. Check your dashboard for confirmation.</p>
        <div style={s.successDetails}>
          <div style={s.sDetail}><span>🗓 Date</span><strong>{selSlot?.date}</strong></div>
          <div style={s.sDetail}><span>⏰ Time</span><strong>{selSlot?.time}</strong></div>
          <div style={s.sDetail}><span>🏥 Dept</span><strong>{doctor?.department}</strong></div>
        </div>
        <button onClick={() => navigate("/patient")} style={s.btnPrimary}>
          Go to My Appointments →
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.wrapper}>
        {/* Doctor Identity Card */}
        <div style={s.docCard}>
          <div style={s.docHeader}>
            <div style={s.docAvatar}>{doctor?.name?.[0]}</div>
            <div>
              <h2 style={s.docName}>Dr. {doctor?.name}</h2>
              <p style={s.docSpec}>{doctor?.specialty}</p>
              <span style={s.docDept}>{doctor?.department}</span>
            </div>
          </div>
          <div style={s.docMeta}>
            <div style={s.metaItem}><span style={s.metaIcon}>🎓</span><span>{doctor?.qualification}</span></div>
            <div style={s.metaItem}><span style={s.metaIcon}>⏳</span><span>{doctor?.experience} years exp</span></div>
          </div>
          {doctor?.bio && <p style={s.docBio}>{doctor.bio}</p>}
        </div>

        {/* Booking Interaction Card */}
        <div style={s.formCard}>
          <h2 style={s.formTitle}>Book Appointment</h2>
          <p style={s.formSub}>Confirm your preferred time and reason</p>

          {error && <div style={s.error}>⚠ {error}</div>}

          <h3 style={s.sectionLabel}>Available Slots</h3>
          {slots.length === 0 ? (
            <div style={s.noSlots}>No available slots. Please try another doctor.</div>
          ) : (
            <div style={s.slotsGrid}>
              {slots.map((sl, i) => (
                <button 
                  key={i}
                  type="button"
                  onClick={() => setSelSlot(sl)}
                  style={{ ...s.slotBtn, ...(selSlot === sl ? s.slotSelected : {}) }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{sl.date}</div>
                  <div style={{ fontSize: 12, marginTop: 2 }}>{sl.time}</div>
                </button>
              ))}
            </div>
          )}

          <h3 style={{ ...s.sectionLabel, marginTop: 24 }}>Reason for Visit</h3>
          <textarea
            value={reason} 
            onChange={e => setReason(e.target.value)}
            placeholder="Describe your symptoms..."
            style={s.textarea}
            rows={4}
          />

          <button 
            onClick={submit} 
            disabled={submitting || !selSlot || !reason.trim()} 
            style={s.btnPrimary}
          >
            {submitting ? "Processing..." : "Confirm Appointment →"}
          </button>
          <button onClick={() => navigate("/patient")} style={s.btnGhost}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg,#f0f9ff 0%,#ecfeff 100%)", fontFamily: "'Sora',sans-serif", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "100px 16px 60px" },
  wrapper: { width: "100%", maxWidth: 860, display: "flex", gap: 24, flexWrap: "wrap" },
  docCard: { flex: "0 0 280px", background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,.07)" },
  docHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
  docAvatar: { width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#0891b2,#0e7490)", color: "#fff", fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  docName: { fontFamily: "'DM Serif Display',serif", fontSize: 20, color: "#0f172a" },
  docSpec: { fontSize: 13, color: "#0891b2", fontWeight: 500 },
  docDept: { display: "inline-block", background: "#f0f9ff", color: "#0369a1", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 500, marginTop: 6 },
  docMeta: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 },
  metaItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569" },
  metaIcon: { fontSize: 16 },
  docBio: { fontSize: 13, color: "#94a3b8", lineHeight: 1.6 },
  formCard: { flex: 1, minWidth: 300, background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,.07)" },
  formTitle: { fontFamily: "'DM Serif Display',serif", fontSize: 26, color: "#0f172a", marginBottom: 6 },
  formSub: { fontSize: 14, color: "#64748b", marginBottom: 24 },
  error: { background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5", padding: "10px 16px", borderRadius: 8, fontSize: 13, marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: 600, color: "#475569", marginBottom: 12 },
  noSlots: { background: "#f8fafc", borderRadius: 12, padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 14, border: "1px dashed #cbd5e1" },
  slotsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 },
  slotBtn: { padding: "10px 8px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontFamily: "'Sora',sans-serif", color: "#0f172a", transition: "all .15s", textAlign: "center" },
  slotSelected: { background: "#f0f9ff", borderColor: "#0891b2", color: "#0891b2", boxShadow: "0 0 0 3px rgba(8,145,178,.12)" },
  textarea: { width: "100%", padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontFamily: "'Sora',sans-serif", fontSize: 14, color: "#0f172a", resize: "vertical", outline: "none", marginBottom: 20 },
  btnPrimary: { width: "100%", background: "#0891b2", color: "#fff", border: "none", padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Sora',sans-serif", boxShadow: "0 4px 16px rgba(8,145,178,.3)", marginBottom: 10 },
  btnGhost: { width: "100%", background: "transparent", color: "#64748b", border: "none", padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "'Sora',sans-serif" },
  successCard: { background: "#fff", borderRadius: 24, padding: "52px 40px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,.1)", border: "1px solid #e2e8f0" },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontFamily: "'DM Serif Display',serif", fontSize: 30, color: "#0f172a", marginBottom: 10 },
  successSub: { fontSize: 15, color: "#64748b", lineHeight: 1.6, marginBottom: 28 },
  successDetails: { background: "#f8fafc", borderRadius: 14, padding: 20, marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 },
  sDetail: { display: "flex", justifyContent: "space-between", fontSize: 14, color: "#475569" }
};