import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([{ date: "", time: "" }]);
  const [slotMsg, setSlotMsg] = useState("");
  const [notes, setNotes] = useState({});

  const load = () => {
    API.get(`/appointments/doctor/${user._id}`)
      .then(r => {
        // Priority: Pending (1) > Confirmed (2) > Completed (3) > Cancelled (4)
        const sorted = r.data.sort((a, b) => {
          const statusOrder = { pending: 1, confirmed: 2, completed: 3, cancelled: 4 };
          const aOrder = statusOrder[a.status?.toLowerCase()] || 5;
          const bOrder = statusOrder[b.status?.toLowerCase()] || 5;
          return aOrder - bOrder;
        });
        setAppointments(sorted);
      })
      .catch(err => console.error("Load error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user._id]);

  const updateStatus = async (id, statusValue) => {
    try {
      await API.patch(`/appointments/${id}`, { 
        status: statusValue, 
        doctorNotes: notes[id] || "" 
      });
      load(); 
      const displayStatus = statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
      alert(`Appointment ${displayStatus}`);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const addSlot = () => setSlots([...slots, { date: "", time: "" }]);
  const changeSlot = (i, k, v) => { const s = [...slots]; s[i][k] = v; setSlots(s); };

  const saveSlots = async () => {
    try {
      await API.post(`/doctors/${user._id}/slots`, { slots: slots.map(s => ({ date: s.date, time: s.time })) });
      setSlotMsg("✅ Slots added successfully!");
      setSlots([{ date: "", time: "" }]);
    } catch { setSlotMsg("❌ Failed to add slots."); }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  
  const stats = [
    { label: "Total Patients", value: appointments.length, color: "#f0f9ff", accent: "#0891b2" },
    { label: "Today", value: appointments.filter(a => a.date === todayStr).length, color: "#fefce8", accent: "#ca8a04" },
    { label: "Pending", value: appointments.filter(a => a.status?.toLowerCase() === "pending").length, color: "#ede9fe", accent: "#7c3aed" },
    { label: "Completed", value: appointments.filter(a => a.status?.toLowerCase() === "completed").length, color: "#d1fae5", accent: "#059669" },
  ];

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={spin} /><p style={{ marginTop: 16, color: "#64748b", fontFamily: "'Sora',sans-serif" }}>Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div style={s.userName}>Dr. {user.name}</div>
          <div style={s.userRole}>{user.specialty || user.specialization}</div>
          <div style={s.experienceText}>{user.experience ? `${user.experience} Years Experience` : "Exp: N/A"}</div>
          <div style={s.deptBadge}>{user.department}</div>
        </div>
        <nav style={s.nav}>
          {[{ id: "home", label: "🏠 Overview" }, { id: "appts", label: "📋 Appointments" }, { id: "slots", label: "🕐 Manage Slots" }].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ ...s.navBtn, ...(tab === item.id ? s.navActive : {}) }}>{item.label}</button>
          ))}
        </nav>
      </aside>

      <main style={s.main}>
        {tab === "home" && (
          <div>
            <h1 style={s.pageTitle}>Welcome, Dr. {user.name?.split(" ")[0]} 🩺</h1>
            <div style={s.statsGrid}>
              {stats.map(st => (
                <div key={st.label} style={{ ...s.statCard, background: st.color }}>
                  <div style={{ ...s.statNum, color: st.accent }}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>
            
            {/* ✅ RECTIFIED: Heading chnaged to Upcoming Appointments */}
            <h2 style={s.secTitle}>Upcoming Appointments</h2>
            
            {appointments.filter(a => a.status?.toLowerCase() === "pending" || a.status?.toLowerCase() === "confirmed").slice(0, 8).map(a => (
              <ApptRow key={a._id} a={a} notes={notes} setNotes={setNotes} updateStatus={updateStatus} full={tab === "appts" || a.status === "confirmed"} />
            ))}
          </div>
        )}

        {tab === "appts" && (
          <div>
            <h1 style={s.pageTitle}>Full Appointment Ledger</h1>
            {appointments.length === 0 ? <div style={s.empty}><p>No appointments yet.</p></div> : 
              appointments.map(a => <ApptRow key={a._id} a={a} notes={notes} setNotes={setNotes} updateStatus={updateStatus} full />)
            }
          </div>
        )}

        {tab === "slots" && (
          <div>
            <h1 style={s.pageTitle}>Manage Availability</h1>
            <div style={s.slotCard}>
              <h3 style={s.slotTitle}>Add New Slots</h3>
              {slots.map((sl, i) => (
                <div key={i} style={s.slotRow}>
                  <input type="date" value={sl.date} onChange={e => changeSlot(i, "date", e.target.value)} style={s.slotInput} min={new Date().toISOString().slice(0, 10)} />
                  <input type="time" value={sl.time} onChange={e => changeSlot(i, "time", e.target.value)} style={s.slotInput} />
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button onClick={addSlot} style={s.btnOutline}>+ Add Another Slot</button>
                <button onClick={saveSlots} style={s.btnPrimary}>Save Slots</button>
              </div>
              {slotMsg && <p style={{ marginTop: 14, fontSize: 14 }}>{slotMsg}</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ApptRow({ a, notes, setNotes, updateStatus, full }) {
  const p = a.patientId;
  const statusLower = a.status?.toLowerCase();
  const isPending = statusLower === "pending";
  const isConfirmed = statusLower === "confirmed";
  const isFinalState = statusLower === "completed" || statusLower === "cancelled";

  return (
    <div style={{ ...s.apptCard, opacity: isFinalState ? 0.7 : 1 }}>
      <div style={s.apptTop}>
        <div style={s.apptLeft}>
          <div style={s.pAvatar}>{p?.name?.[0] || "P"}</div>
          <div>
            <div style={s.pName}>{p?.name || a.patientName}</div>
            <div style={s.pMeta}>{p?.age ? `${p.age} yrs · ` : ""}{p?.gender || ""}</div>
          </div>
        </div>
        <div style={s.apptRight}>
          <div style={s.apptDate}>📅 {a.date} · {a.timeSlot || a.time}</div>
          <StatusBadge status={a.status} />
        </div>
      </div>
      
      {full && (
        <div style={s.apptActions}>
          <textarea
            placeholder={isFinalState ? "Final consultation summary" : "Add consultation notes…"}
            defaultValue={a.doctorNotes || ""}
            disabled={isFinalState}
            onChange={e => setNotes({ ...notes, [a._id]: e.target.value })}
            style={s.notesInput}
          />
          
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {isPending && (
              <>
                <button onClick={() => updateStatus(a._id, "confirmed")} style={{ ...s.stBtn, background: "#059669", color: "#fff" }}>Confirm</button>
                <button onClick={() => updateStatus(a._id, "cancelled")} style={{ ...s.stBtn, background: "#dc2626", color: "#fff" }}>Cancel</button>
              </>
            )}
            {isConfirmed && (
              <button onClick={() => updateStatus(a._id, "completed")} style={{ ...s.stBtn, background: "#0891b2", color: "#fff" }}>Mark as Completed</button>
            )}
            {isFinalState && (
              <div style={s.statusText}>
                <span style={{ color: statusLower === "completed" ? "#059669" : "#dc2626" }}>●</span> 
                {statusLower === "completed" ? " Record Finalized" : " Cancelled"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const spin = { width: 40, height: 40, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#0891b2", animation: "spin .7s linear infinite", margin: "0 auto" };

const s = {
  page: { display: "flex", minHeight: "100vh", paddingTop: 68, fontFamily: "'Sora',sans-serif" },
  sidebar: { width: 240, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "32px 16px", position: "sticky", top: 68, height: "calc(100vh - 68px)", display: "flex", flexDirection: "column" },
  sideTop: { textAlign: "center", marginBottom: 32 },
  avatar: { width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#0e7490,#0f172a)", color: "#fff", fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" },
  userName: { fontWeight: 600, fontSize: 15, color: "#0f172a" },
  userRole: { fontSize: 12, color: "#0891b2", marginTop: 2, fontWeight: 500 },
  experienceText: { fontSize: 12, color: "#64748b", marginTop: 4 },
  deptBadge: { display: "inline-block", background: "#f0f9ff", color: "#0369a1", padding: "3px 12px", borderRadius: 99, fontSize: 11, fontWeight: 500, marginTop: 6 },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navBtn: { padding: "11px 16px", border: "none", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "'Sora',sans-serif", fontSize: 14, fontWeight: 500, color: "#475569" },
  navActive: { background: "#f0fdf4", color: "#059669" },
  main: { flex: 1, padding: "40px 48px" },
  pageTitle: { fontFamily: "'DM Serif Display',serif", fontSize: 32, color: "#0f172a", marginBottom: 4 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 16, marginBottom: 40 },
  statCard: { borderRadius: 16, padding: "20px 24px", border: "1px solid rgba(0,0,0,.06)" },
  statNum: { fontSize: 36, fontWeight: 700, fontFamily: "'DM Serif Display',serif", lineHeight: 1 },
  statLabel: { fontSize: 13, color: "#64748b", marginTop: 6 },
  secTitle: { fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "#0f172a", margin: "32px 0 16px" },
  empty: { background: "#f8fafc", borderRadius: 16, padding: 40, textAlign: "center", border: "1px dashed #cbd5e1", color: "#64748b", fontSize: 15 },
  apptCard: { background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 12, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,.04)" },
  apptTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  apptLeft: { display: "flex", alignItems: "flex-start", gap: 14 },
  pAvatar: { width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#0e7490,#0f172a)", color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  pName: { fontWeight: 600, fontSize: 14, color: "#0f172a" },
  pMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  apptRight: { textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 },
  apptDate: { fontSize: 13, color: "#64748b" },
  apptActions: { marginTop: 14, display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 14 },
  notesInput: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "'Sora',sans-serif", fontSize: 13, color: "#0f172a", outline: "none" },
  stBtn: { padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Sora',sans-serif", fontSize: 12, fontWeight: 600 },
  statusText: { color: "#475569", fontSize: "12px", fontWeight: "600", marginTop: "4px" },
  slotCard: { background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,.05)", maxWidth: 560 },
  slotTitle: { fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 20 },
  slotRow: { display: "flex", gap: 12, marginBottom: 12 },
  slotInput: { flex: 1, padding: "11px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "'Sora',sans-serif", fontSize: 14, color: "#0f172a", outline: "none" },
  btnOutline: { background: "transparent", color: "#0891b2", border: "1.5px solid #0891b2", padding: "10px 20px", borderRadius: 9, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnPrimary: { background: "#0891b2", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 9, fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(8,145,178,.3)" },
};