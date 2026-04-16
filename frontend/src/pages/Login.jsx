import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Hook to access the URL query string
  
  const [form, setForm] = useState({ email: "", password: "", role: "patient" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Effect to automatically switch the toggle if the URL contains ?role=doctor
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("role");
    if (roleParam === "doctor") {
      setForm((prev) => ({ ...prev, role: "doctor" }));
    }
  }, [location]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      // ✅ Sending email, password, and role to your backend
      const { data } = await API.post("/auth/login", form);
      
      // ✅ Standardizing the data payload for your AuthContext
      login(data.user || data, data.token);
      
      // ✅ Explicit navigation based on the verified role from the backend
      const targetRole = data.user?.role || data.role || form.role;
      navigate(targetRole === "doctor" ? "/doctor" : "/patient");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.top}>
          {/* ✅ Branding Fix: CuraSphere with the Sphere-Plus logo */}
          <div style={s.logo}>
            <span style={s.plusIcon}>+</span> CuraSphere
          </div>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.sub}>Sign in to your account</p>
        </div>

        {/* Role toggle */}
        <div style={s.toggle}>
          {["patient", "doctor"].map(r => (
            <button 
              key={r} 
              type="button" 
              onClick={() => setForm({ ...form, role: r })}
              style={{ ...s.toggleBtn, ...(form.role === r ? s.toggleActive : {}) }}
            >
              {r === "patient" ? "👤 Patient" : "🩺 Doctor"}
            </button>
          ))}
        </div>

        {error && <div style={s.error}>⚠ {error}</div>}

        <form onSubmit={submit} style={s.form}>
          <div style={s.group}>
            <label style={s.label}>Email address</label>
            <input 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={handle}
              placeholder="you@example.com" 
              required 
              style={s.input} 
            />
          </div>
          <div style={s.group}>
            <label style={s.label}>Password</label>
            <input 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={handle}
              placeholder="••••••••" 
              required 
              style={s.input} 
            />
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p style={s.foot}>
          Don't have an account? <Link to="/register" style={s.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)",
    padding: "80px 16px",
  },
  card: {
    background: "#fff", borderRadius: 24, padding: "44px 40px",
    width: "100%", maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,.1)", border: "1px solid #e2e8f0",
  },
  top: { textAlign: "center", marginBottom: 28 },
  logo: { fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 16 },
  plusIcon: { background: "#0891b2", color: "white", padding: "2px 8px", borderRadius: "50%", marginRight: 8, fontSize: 16 },
  title: { fontFamily: "'DM Serif Display',serif", fontSize: 28, color: "#0f172a", marginBottom: 6 },
  sub: { fontSize: 14, color: "#64748b" },
  toggle: {
    display: "flex", background: "#f1f5f9", borderRadius: 10,
    padding: 4, gap: 4, marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, padding: "9px 0", border: "none", borderRadius: 8,
    background: "transparent", cursor: "pointer",
    fontFamily: "'Sora',sans-serif", fontSize: 13, fontWeight: 500, color: "#64748b",
    transition: "all .2s",
  },
  toggleActive: {
    background: "#fff", color: "#0891b2",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },
  error: {
    background: "#fee2e2", color: "#991b1b", border: "1px solid #fca5a5",
    padding: "10px 16px", borderRadius: 8, fontSize: 13, marginBottom: 18,
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#475569" },
  input: {
    padding: "12px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0",
    fontFamily: "'Sora',sans-serif", fontSize: 14, color: "#0f172a",
    outline: "none", transition: "border-color .2s",
  },
  btn: {
    background: "#0891b2", color: "#fff", border: "none",
    padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 600,
    cursor: "pointer", fontFamily: "'Sora',sans-serif",
    boxShadow: "0 4px 16px rgba(8,145,178,.3)", marginTop: 4,
  },
  foot: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748b" },
  link: { color: "#0891b2", fontWeight: 600, textDecoration: "none" },
};