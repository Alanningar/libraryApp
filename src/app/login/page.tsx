// src/app/login/page.tsx

export default function LoginPage() {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <h1>Login</h1>
        <form style={{ display: "flex", flexDirection: "column", width: "300px" }}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required style={{ marginBottom: "10px", padding: "8px" }} />
  
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required style={{ marginBottom: "10px", padding: "8px" }} />
  
          <button type="submit" style={{ padding: "10px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
            Login
          </button>
        </form>
      </div>
    );
  }
  