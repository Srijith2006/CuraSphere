import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, role, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* ✅ RECTIFIED: Top-left branding updated to final CuraSphere logo */}
        <Link to="/" style={styles.logo}>
          {/* Circular Sphere Logo with a clear white cross (+) inside */}
          <div style={styles.logoSphere}>
             <span style={styles.logoPlus}>+</span>
          </div>
          <span style={styles.logoText}>Cura<span style={styles.logoAccent}>Sphere</span></span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.links}>
          {!isAuth ? (
            <>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/login" style={styles.link}>Sign In</Link>
              <Link to="/register" style={styles.btn}>Get Started</Link>
            </>
          ) : (
            <>
              <span style={styles.userChip}>
                {role === "doctor" ? "🩺 Dr. " : "👤 "}
                {user?.name?.split(" ")[0]}
              </span>
              <button 
                onClick={() => { logout(); navigate("/"); }} 
                style={styles.btnOutline}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { 
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, 
    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", 
    borderBottom: "1px solid #f1f5f9" 
  },
  inner: { 
    maxWidth: 1200, margin: "0 auto", padding: "0 24px", 
    height: 70, display: "flex", alignItems: "center", justifyContent: "space-between" 
  },
  logo: { 
    display: "flex", alignItems: "center", gap: 12, textDecoration: "none" 
  },
  // ✅ Sphere design using the dark teal shade #0891b2
  logoSphere: { 
    width: 36, height: 36, borderRadius: "50%", 
    background: "#0891b2", display: "flex", alignItems: "center", 
    justifyContent: "center", boxShadow: "0 4px 10px rgba(8, 145, 178, 0.2)"
  },
  logoPlus: { 
    color: "#fff", fontSize: 20, fontWeight: "700", marginTop: -1 
  },
  logoText: { 
    fontWeight: 800, fontSize: 22, color: "#0f172a", 
    fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px" 
  },
  logoAccent: { color: "#0891b2" },
  links: { display: "flex", alignItems: "center", gap: 12 },
  link: { 
    textDecoration: "none", color: "#475569", fontWeight: 500, 
    fontSize: 14, padding: "8px 12px" 
  },
  btn: { 
    background: "#0891b2", color: "#fff", padding: "10px 22px", 
    borderRadius: 10, textDecoration: "none", fontWeight: 600, 
    fontSize: 14, boxShadow: "0 4px 12px rgba(8, 145, 178, 0.25)" 
  },
  btnOutline: { 
    background: "none", border: "1.5px solid #0891b2", color: "#0891b2", 
    padding: "8px 20px", borderRadius: 10, cursor: "pointer", 
    fontWeight: 600, fontSize: 14 
  },
  userChip: { 
    background: "#f0f9ff", color: "#0369a1", padding: "7px 16px", 
    borderRadius: 99, fontSize: 13, fontWeight: 500, border: "1px solid #bae6fd" 
  }
};