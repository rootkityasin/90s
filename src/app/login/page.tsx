import { login } from './actions';

export default function Login() {
  return (
    <main className="container">
      <form action={login} className="auth">
        <h1 className="header-accent" style={{ fontSize:'2.4rem' }}>Login</h1>
        <label style={{ display:'grid', gap:'.3rem' }}>Email
          <input name="email" required placeholder="you@example.com" />
        </label>
        <label style={{ display:'grid', gap:'.3rem' }}>Role
          <select name="role" defaultValue="retail" style={{ padding:'.55rem', borderRadius:8 }}>
            <option value="retail">Retail Customer</option>
            <option value="client">Client Access</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <p style={{ fontSize:'.65rem', lineHeight:1.3 }}>Demo: retail@example.com / client@example.com / admin@example.com (role auto-matched).</p>
        <button type="submit">Enter</button>
      </form>
    </main>
  );
}