import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const DEPTS = ["Cardiology","General","Orthopedics","Neurology","Pediatrics","Dermatology","ENT"];

export default function Register() {
  const { login } = useAuth(); // Keeping this import to avoid breaking AuthContext usage elsewhere
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({
    name:"", email:"", password:"", phone:"",
    age:"", gender:"", bloodGroup:"",
    specialty:"", department:"General", qualification:"MBBS", experience:"", bio:""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    try {
      // ✅ Sending the request to the backend
      await API.post(`/auth/register/${role}`, { ...form, role });
      
      // ✅ RECTIFIED: Instead of auto-login (which caused the error), 
      // we now alert the user and redirect them to the Login page.
      alert("Registration successful! Please sign in with your credentials.");
      navigate("/login"); 

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. This email might already be in use.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.top}>
          {/* ✅ Professional CuraSphere Branding */}
          <div style={s.logo}>
            <span style={s.plus}>+</span> CuraSphere
          </div>
          <h2 style={s.title}>Create your account</h2>
          <p style={s.sub}>Join the CuraSphere network today</p>
        </div>

        {/* Role Toggle */}
        <div style={s.toggle}>
          {["patient","doctor"].map(r => (
            <button key={r} type="button" onClick={() => setRole(r)}
              style={{ ...s.toggleBtn, ...(role === r ? s.toggleActive : {}) }}>
              {r === "patient" ? "👤 Patient" : "🩺 Doctor"}
            </button>
          ))}
        </div>

        {error && <div style={s.error}>⚠ {error}</div>}

        <form onSubmit={submit} style={s.form}>
          {/* Common fields */}
          <Row>
            <Field label="Full Name" name="name" value={form.name} onChange={handle} placeholder="Dr. / Mr. / Ms." required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
          </Row>
          <Row>
            <Field label="Password" name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
            <Field label="Phone" name="phone" value={form.phone} onChange={handle} placeholder="+91 XXXXX XXXXX" />
          </Row>

          {role === "patient" && (
            <Row>
              <Field label="Age" name="age" type="number" value={form.age} onChange={handle} placeholder="25" />
              <div style={s.group}>
                <label style={s.label}>Gender</label>
                <select name="gender" value={form.gender} onChange={handle} style={s.input}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <Field label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handle} placeholder="A+, B-, O+" />
            </Row>
          )}

          {role === "doctor" && (
            <>
              <Row>
                <Field label="Specialty" name="specialty" value={form.specialty} onChange={handle} placeholder="e.g. Interventional Cardiologist" required />
                <div style={s.group}>
                  <label style={s.label}>Department</label>
                  <select name="department" value={form.department} onChange={handle} style={s.input} required>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </Row>
              <Row>
                <Field label="Qualification" name="qualification" value={form.qualification} onChange={handle} placeholder="MBBS, MD" />
                <Field label="Experience (years)" name="experience" type="number" value={form.experience} onChange={handle} placeholder="5" />
              </Row>
              <div style={s.group}>
                <label style={s.label}>Bio</label>
                <textarea name="bio" value={form.bio} onChange={handle}
                  placeholder="Brief description about yourself and your expertise..."
                  style={{ ...s.input, minHeight: 80, resize: "vertical" }} />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={s.foot}>
          Already have an account? <Link to="/login" style={s.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

// Reusable Sub-components
const Row = ({ children }) => <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>{children}</div>;
const Field = ({ label, ...props }) => (
  <div style={{ flex:"1 1 180px", display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:500, color:"#475569" }}>{label}</label>
    <input style={{ padding:"11px 14px", borderRadius:8, border:"1.5px solid #e2e8f0",
      fontFamily:"'Sora',sans-serif", fontSize:14, color:"#0f172a", outline:"none" }} {...props} />
  </div>
);

const s = {
  page: {
    minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
    background:"linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)",
    padding:"100px 16px 40px",
  },
  card: {
    background:"#fff", borderRadius:24, padding:"44px 40px",
    width:"100%", maxWidth:620,
    boxShadow:"0 20px 60px rgba(0,0,0,.1)", border:"1px solid #e2e8f0",
  },
  top:{ textAlign:"center", marginBottom:28 },
  logo:{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:22, color:"#0f172a", marginBottom:16 },
  plus: { background: "#0891b2", color: "white", padding: "2px 8px", borderRadius: "50%", marginRight: 8 },
  title:{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#0f172a", marginBottom:6 },
  sub:{ fontSize:14, color:"#64748b" },
  toggle:{
    display:"flex", background:"#f1f5f9", borderRadius:10,
    padding:4, gap:4, marginBottom:24,
  },
  toggleBtn:{
    flex:1, padding:"9px 0", border:"none", borderRadius:8,
    background:"transparent", cursor:"pointer",
    fontFamily:"'Sora',sans-serif", fontSize:13, fontWeight:500, color:"#64748b",
  },
  toggleActive:{
    background:"#fff", color:"#0891b2",
    boxShadow:"0 2px 8px rgba(0,0,0,.08)",
  },
  error:{
    background:"#fee2e2", color:"#991b1b", border:"1px solid #fca5a5",
    padding:"10px 16px", borderRadius:8, fontSize:13, marginBottom:18,
  },
  form:{ display:"flex", flexDirection:"column", gap:16 },
  group:{ flex:"1 1 180px", display:"flex", flexDirection:"column", gap:6 },
  label:{ fontSize:13, fontWeight:500, color:"#475569" },
  input:{
    padding:"11px 14px", borderRadius:8, border:"1.5px solid #e2e8f0",
    fontFamily:"'Sora',sans-serif", fontSize:14, color:"#0f172a", outline:"none",
  },
  btn:{
    background:"#0891b2", color:"#fff", border:"none",
    padding:"13px", borderRadius:10, fontSize:15, fontWeight:600,
    cursor:"pointer", fontFamily:"'Sora',sans-serif",
    boxShadow:"0 4px 16px rgba(8,145,178,.3)", marginTop:4,
  },
  foot:{ textAlign:"center", marginTop:20, fontSize:14, color:"#64748b" },
  link:{ color:"#0891b2", fontWeight:600, textDecoration:"none" },
};