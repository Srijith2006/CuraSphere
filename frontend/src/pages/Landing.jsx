import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { value: "50+", label: "Specialist Doctors" },
  { value: "24/7", label: "Appointment Booking" },
  { value: "100%", label: "Verified Profiles" },
  { value: "7", label: "Specialized Departments" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuth, role } = useAuth();

  // ✅ Logic: If logged in, redirect to dashboard. If not, go to Register.
  const handleStart = () => {
    if (isAuth) {
      navigate(role === "doctor" ? "/doctor" : "/patient");
    } else {
      navigate("/register");
    }
  };

  // ✅ RECTIFIED: Passing role as a query parameter so Login page can auto-toggle
  const handleDoctorLogin = () => {
    if (isAuth && role === "doctor") {
      navigate("/doctor");
    } else {
      navigate("/login?role=doctor");
    }
  };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>

      {/* ── Hero Section ── */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroContent}>
          <div style={s.badge}>🏥 Smart Clinic Appointment System</div>
          <h1 style={s.heroTitle}>
            Healthcare,<br />
            <span style={s.heroAccent}>simplified.</span>
          </h1>
          <p style={s.heroSub}>
            Book appointments with top specialists in seconds.<br />
            No queues. No calls. Just CuraSphere.
          </p>
          <div style={s.heroActions}>
            <button onClick={handleStart} style={s.btnPrimary}>
              Book an Appointment →
            </button>
            <button onClick={handleDoctorLogin} style={s.btnSecondary}>
              Doctor Login
            </button>
          </div>
        </div>

        {/* ✅ CuraSphere Logo (Sphere + Heart + Pulse) */}
        <div style={s.heroImageContainer}>
          <div style={s.logoSphere}>
            <div style={s.heartIcon}>❤️</div>
            <svg style={s.pulseSvg} viewBox="0 0 100 40">
              <path 
                d="M0,20 H30 L35,10 L45,30 L50,20 H100" 
                fill="none" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </svg>
            <div style={s.logoName}>CuraSphere</div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={s.stats}>
        {STATS.map(st => (
          <div key={st.label} style={s.statItem}>
            <div style={s.statValue}>{st.value}</div>
            <div style={s.statLabel}>{st.label}</div>
          </div>
        ))}
      </section>

      {/* ── How it works ── */}
      <section style={{ ...s.section, background: "#f8fafc" }}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>How CuraSphere Works</h2>
          <p style={s.sectionSub}>Three simple steps to your appointment</p>
        </div>
        <div style={s.steps}>
          {[
            { n: "01", title: "Create Account", desc: "Register as a patient in under a minute", icon: "👤" },
            { n: "02", title: "Choose Doctor", desc: "Browse our network and pick your specialist", icon: "🔍" },
            { n: "03", title: "Book & Confirm", desc: "Select a time slot and receive instant confirmation", icon: "✅" },
          ].map(step => (
            <div key={step.n} style={s.step}>
              <div style={s.stepNum}>{step.n}</div>
              <div style={s.stepIcon}>{step.icon}</div>
              <h3 style={s.stepTitle}>{step.title}</h3>
              <p style={s.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.cta}>
        <h2 style={s.ctaTitle}>Ready to book your appointment?</h2>
        <p style={s.ctaSub}>Join thousands of patients managing their health with CuraSphere</p>
        <button onClick={handleStart} style={s.btnPrimary}>
          Get Started — It's Free
        </button>
      </section>

      {/* ── Footer ── */}
      <footer style={s.footer}>
        <div style={s.footerBrand}>
            <span style={s.miniLogo}>+</span> CuraSphere
        </div>
        <span style={{ color: "#94a3b8", fontSize: 13 }}>© 2026 · Smart Clinic Appointment System</span>
      </footer>
    </div>
  );
}

const s = {
  hero: {
    minHeight: "100vh", paddingTop: 68,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "120px 10% 80px",
    position: "relative", overflow: "hidden",
    background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #ecfeff 100%)",
    gap: 40, flexWrap: "wrap",
  },
  heroBg: {
    position: "absolute", top: -100, right: -100,
    width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(8,145,178,.1) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroContent: { flex: 1, minWidth: 300, maxWidth: 560 },
  heroImageContainer: {
    flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minWidth: "320px",
  },
  logoSphere: {
    width: "300px", height: "300px", borderRadius: "50%",
    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    boxShadow: "0 20px 50px rgba(8, 145, 178, 0.3)",
    border: "10px solid rgba(255, 255, 255, 0.2)",
  },
  heartIcon: { fontSize: "60px", marginBottom: "10px" },
  pulseSvg: { width: "150px", height: "auto" },
  logoName: { 
    color: "white", fontSize: "28px", fontWeight: "800", 
    marginTop: "15px", letterSpacing: "1px" 
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "#f0f9ff", border: "1px solid #bae6fd",
    color: "#0369a1", padding: "6px 16px", borderRadius: 99,
    fontSize: 13, fontWeight: 500, marginBottom: 24,
  },
  heroTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(42px, 6vw, 68px)", lineHeight: 1.1,
    color: "#0f172a", marginBottom: 20,
  },
  heroAccent: { color: "#0891b2" },
  heroSub: { fontSize: 17, color: "#64748b", lineHeight: 1.7, marginBottom: 36 },
  heroActions: { display: "flex", gap: 14, flexWrap: "wrap" },
  btnPrimary: {
    background: "#0891b2", color: "#fff", border: "none",
    padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600,
    cursor: "pointer", boxShadow: "0 6px 20px rgba(8,145,178,.35)",
    fontFamily: "'Sora', sans-serif", transition: "all .2s",
  },
  btnSecondary: {
    background: "transparent", color: "#0891b2",
    border: "2px solid #0891b2",
    padding: "14px 30px", borderRadius: 10, fontSize: 15, fontWeight: 600,
    cursor: "pointer", fontFamily: "'Sora', sans-serif",
  },
  stats: {
    display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0,
    background: "#0f172a", padding: "48px 10%",
  },
  statItem: {
    flex: "1 1 160px", textAlign: "center", padding: "0 32px",
    borderRight: "1px solid #1e293b",
  },
  statValue: { fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#0891b2", lineHeight: 1 },
  statLabel: { fontSize: 13, color: "#94a3b8", marginTop: 8, fontWeight: 500 },
  section: { padding: "80px 10%" },
  sectionHeader: { textAlign: "center", marginBottom: 48 },
  sectionTitle: {
    fontFamily: "'DM Serif Display', serif", fontSize: 36,
    color: "#0f172a", marginBottom: 10,
  },
  sectionSub: { fontSize: 16, color: "#64748b" },
  steps: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 24,
  },
  step: {
    background: "#fff", borderRadius: 20, padding: 32,
    border: "1px solid #e2e8f0", textAlign: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,.05)",
  },
  stepNum: { fontSize: 12, fontWeight: 700, color: "#0891b2", letterSpacing: ".1em", marginBottom: 12 },
  stepIcon: { fontSize: 32, marginBottom: 14 },
  stepTitle: { fontSize: 17, fontWeight: 600, color: "#0f172a", marginBottom: 8 },
  stepDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6 },
  cta: {
    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
    padding: "80px 10%", textAlign: "center",
    color: "#fff",
  },
  ctaTitle: {
    fontFamily: "'DM Serif Display', serif", fontSize: 36,
    color: "#fff", marginBottom: 14,
  },
  ctaSub: { fontSize: 16, color: "#cffafe", marginBottom: 36 },
  footer: {
    background: "#0f172a", padding: "28px 10%",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: 12,
  },
  footerBrand: { color: "#0891b2", fontWeight: 700, fontSize: "18px" },
  miniLogo: { 
    background: "#0891b2", color: "white", padding: "2px 8px", 
    borderRadius: "50%", marginRight: "8px" 
  }
};