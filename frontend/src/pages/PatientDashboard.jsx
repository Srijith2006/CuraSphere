import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

const DEPTS = ["Cardiology","General","Orthopedics","Neurology","Pediatrics","Dermatology","ENT"];

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selDept, setSelDept] = useState("");
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/appointments/patient/${user._id}`),
      API.get("/doctors"),
    ]).then(([a, d]) => {
      setAppointments(a.data);
      setDoctors(d.data);
    }).catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [user._id]);

  const filtered = selDept ? doctors.filter(d => d.department === selDept) : doctors;

  // ✅ RECTIFIED: Added .toLowerCase() to match backend data
  const stats = [
    { label: "Total Appointments", value: appointments.length, color: "#f0f9ff", accent: "#0891b2" },
    { label: "Confirmed", value: appointments.filter(a => a.status?.toLowerCase() === "confirmed").length, color: "#d1fae5", accent: "#059669" },
    { label: "Pending", value: appointments.filter(a => a.status?.toLowerCase() === "pending").length, color: "#ede9fe", accent: "#7c3aed" },
    { label: "Completed", value: appointments.filter(a => a.status?.toLowerCase() === "completed").length, color: "#e0f2fe", accent: "#0369a1" },
  ];

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={spin} /><p style={{ marginTop:16, color:"#64748b", fontFamily:"'Sora',sans-serif" }}>Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sideTop}>
          <div style={s.avatar}>{user.name?.[0]?.toUpperCase()}</div>
          <div style={s.userName}>{user.name}</div>
          <div style={s.userRole}>Patient</div>
        </div>
        <nav style={s.nav}>
          {[
            { id:"home",    label:"🏠 Overview" },
            { id:"doctors", label:"🔍 Find Doctors" },
            { id:"appts",   label:"📅 My Appointments" },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{ ...s.navBtn, ...(tab === item.id ? s.navActive : {}) }}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {tab === "home" && (
          <div style={{ animation:"fadeUp .4s ease both" }}>
            <h1 style={s.pageTitle}>Good day, {user.name?.split(" ")[0]} 👋</h1>
            <p style={s.pageSub}>Here's your health summary</p>

            <div style={s.statsGrid}>
              {stats.map(st => (
                <div key={st.label} style={{ ...s.statCard, background: st.color }}>
                  <div style={{ ...s.statNum, color: st.accent }}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              ))}
            </div>

            <h2 style={s.secTitle}>Recent Appointments</h2>
            {appointments.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize:40 }}>📋</div>
                <p>No appointments yet. <button onClick={() => setTab("doctors")} style={s.inlineBtn}>Book your first one →</button></p>
              </div>
            ) : (
              appointments.slice(0,3).map(a => <AppCard key={a._id} a={a} />)
            )}
          </div>
        )}

        {tab === "doctors" && (
          <div>
            <h1 style={s.pageTitle}>Find a Doctor</h1>
            <p style={s.pageSub}>Browse by department and book an appointment</p>

            <div style={s.deptRow}>
              <button onClick={() => setSelDept("")}
                style={{ ...s.deptChip, ...(selDept === "" ? s.deptChipActive : {}) }}>
                All
              </button>
              {DEPTS.map(d => (
                <button key={d} onClick={() => setSelDept(d)}
                  style={{ ...s.deptChip, ...(selDept === d ? s.deptChipActive : {}) }}>
                  {d}
                </button>
              ))}
            </div>

            <div style={s.docGrid}>
              {filtered.length === 0 && <p style={{ color:"#64748b" }}>No doctors found in this department.</p>}
              {filtered.map(doc => (
                <div key={doc._id} style={s.docCard}>
                  <div style={s.docAvatar}>{doc.name?.[0]?.toUpperCase()}</div>
                  <div style={s.docName}>Dr. {doc.name}</div>
                  <div style={s.docSpec}>{doc.specialty || doc.specialization}</div>
                  <div style={s.docDept}>{doc.department}</div>
                  <div style={s.docMeta}>
                    <span>🎓 {doc.qualification || "MD"}</span>
                    <span>⏳ {doc.experience} yrs</span>
                  </div>
                  <button onClick={() => navigate(`/book/${doc._id}`)} style={s.bookBtn}>
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "appts" && (
          <div>
            <h1 style={s.pageTitle}>My Appointments</h1>
            <p style={s.pageSub}>Track all your upcoming and past appointments</p>
            {appointments.length === 0 ? (
              <div style={s.empty}>
                <div style={{ fontSize:40 }}>📅</div>
                <p>No appointments yet.</p>
              </div>
            ) : (
              appointments.map(a => <AppCard key={a._id} a={a} full />)
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function AppCard({ a, full }) {
  const doc = a.doctorId;
  return (
    <div style={s.appCard}>
      <div style={s.appLeft}>
        <div style={s.appAvatar}>{doc?.name?.[0] || "D"}</div>
        <div>
          <div style={s.appDoc}>Dr. {doc?.name || a.doctorName || "Unknown"}</div>
          <div style={s.appSpec}>{doc?.specialization || doc?.specialty} · {a.department}</div>
          {full && a.doctorNotes && (
            <div style={s.appNotes}>📝 <b>Dr Notes:</b> {a.doctorNotes}</div>
          )}
        </div>
      </div>
      <div style={s.appRight}>
        <div style={s.appDate}>📅 {a.date} · {a.time}</div>
        <StatusBadge status={a.status} />
        {full && a.reason && <div style={s.appReason}>"{a.reason}"</div>}
      </div>
    </div>
  );
}

const spin = {
  width:40, height:40, borderRadius:"50%",
  border:"3px solid #e2e8f0", borderTopColor:"#0891b2",
  animation:"spin .7s linear infinite", margin:"0 auto",
};

const s = {
  page:{ display:"flex", minHeight:"100vh", paddingTop:68, fontFamily:"'Sora',sans-serif" },
  sidebar:{
    width:240, background:"#fff", borderRight:"1px solid #e2e8f0",
    padding:"32px 16px", position:"sticky", top:68, height:"calc(100vh - 68px)",
    display:"flex", flexDirection:"column",
  },
  sideTop:{ textAlign:"center", marginBottom:32 },
  avatar:{
    width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#0891b2,#0e7490)",
    color:"#fff", fontSize:24, fontWeight:700,
    display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px",
  },
  userName:{ fontWeight:600, fontSize:15, color:"#0f172a" },
  userRole:{ fontSize:12, color:"#64748b", marginTop:2 },
  nav:{ display:"flex", flexDirection:"column", gap:4 },
  navBtn:{
    padding:"11px 16px", border:"none", borderRadius:10, background:"transparent",
    cursor:"pointer", textAlign:"left", fontFamily:"'Sora',sans-serif",
    fontSize:14, fontWeight:500, color:"#475569", transition:"all .15s",
  },
  navActive:{ background:"#f0f9ff", color:"#0891b2" },
  main:{ flex:1, padding:"40px 48px", maxWidth:900 },
  pageTitle:{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:"#0f172a", marginBottom:4 },
  pageSub:{ fontSize:15, color:"#64748b", marginBottom:32 },
  statsGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16, marginBottom:40 },
  statCard:{ borderRadius:16, padding:"20px 24px", border:"1px solid rgba(0,0,0,.06)" },
  statNum:{ fontSize:36, fontWeight:700, fontFamily:"'DM Serif Display',serif", lineHeight:1 },
  statLabel:{ fontSize:13, color:"#64748b", marginTop:6 },
  secTitle:{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:"#0f172a", margin:"32px 0 16px" },
  empty:{
    background:"#f8fafc", borderRadius:16, padding:40, textAlign:"center",
    border:"1px dashed #cbd5e1", color:"#64748b", fontSize:15,
  },
  inlineBtn:{ background:"none", border:"none", color:"#0891b2", fontWeight:600, cursor:"pointer", fontSize:15 },
  deptRow:{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 },
  deptChip:{
    padding:"7px 16px", borderRadius:99, border:"1.5px solid #e2e8f0",
    background:"#fff", cursor:"pointer", fontFamily:"'Sora',sans-serif",
    fontSize:13, fontWeight:500, color:"#475569", transition:"all .15s",
  },
  deptChipActive:{ background:"#0891b2", color:"#fff", borderColor:"#0891b2" },
  docGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:20 },
  docCard:{
    background:"#fff", borderRadius:20, padding:24,
    border:"1px solid #e2e8f0", boxShadow:"0 2px 12px rgba(0,0,0,.05)",
    display:"flex", flexDirection:"column", gap:6, transition:"transform .2s",
  },
  docAvatar:{
    width:48, height:48, borderRadius:14,
    background:"linear-gradient(135deg,#0891b2,#0e7490)",
    color:"#fff", fontSize:20, fontWeight:700,
    display:"flex", alignItems:"center", justifyContent:"center", marginBottom:4,
  },
  docName:{ fontWeight:600, fontSize:15, color:"#0f172a" },
  docSpec:{ fontSize:13, color:"#0891b2", fontWeight:500 },
  docDept:{
    display:"inline-block", background:"#f0f9ff", color:"#0369a1",
    padding:"3px 10px", borderRadius:99, fontSize:12, fontWeight:500,
  },
  docMeta:{ display:"flex", gap:14, fontSize:12, color:"#64748b", marginTop:4 },
  docBio:{ fontSize:12, color:"#94a3b8", lineHeight:1.5, marginTop:4 },
  bookBtn:{
    marginTop:8, background:"#0891b2", color:"#fff", border:"none",
    padding:"10px", borderRadius:9, fontFamily:"'Sora',sans-serif",
    fontSize:13, fontWeight:600, cursor:"pointer",
    boxShadow:"0 4px 12px rgba(8,145,178,.25)",
  },
  appCard:{
    background:"#fff", borderRadius:16, padding:"20px 24px", marginBottom:12,
    border:"1px solid #e2e8f0", display:"flex", justifyContent:"space-between",
    alignItems:"flex-start", gap:16, flexWrap:"wrap",
    boxShadow:"0 2px 8px rgba(0,0,0,.04)",
  },
  appLeft:{ display:"flex", alignItems:"flex-start", gap:14 },
  appAvatar:{
    width:42, height:42, borderRadius:12,
    background:"linear-gradient(135deg,#0891b2,#0e7490)",
    color:"#fff", fontWeight:700, fontSize:16,
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  },
  appDoc:{ fontWeight:600, fontSize:14, color:"#0f172a" },
  appSpec:{ fontSize:12, color:"#64748b", marginTop:2 },
  appNotes:{ fontSize:12, color:"#059669", marginTop:4, fontStyle:"italic" },
  appRight:{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 },
  appDate:{ fontSize:13, color:"#64748b" },
  appReason:{ fontSize:12, color:"#94a3b8", fontStyle:"italic" },
};