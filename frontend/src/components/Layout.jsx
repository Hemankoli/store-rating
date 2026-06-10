import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NAV_LINKS = {
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  user: [
    { to: '/stores', label: 'Stores' },
    { to: '/change-password', label: 'Password' },
  ],
  store_owner: [
    { to: '/owner/dashboard', label: 'Dashboard' },
    { to: '/owner/change-password', label: 'Password' },
  ],
};

const ROLE_BADGE = {
  admin: { label: 'Admin', cls: 'badge badge-amber' },
  user: { label: 'User', cls: 'badge badge-zinc' },
  store_owner: { label: 'Owner', cls: 'badge badge-green' },
};

const ROLE_HOME = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' };

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = NAV_LINKS[user?.role] || [];
  const badge = ROLE_BADGE[user?.role];
  const logoTo = user ? (ROLE_HOME[user.role] ?? '/') : '/';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Top nav */}
      <nav style={{
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 58 }}>
          {/* Logo */}
          <Link to={logoTo} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 40 }}>
            <span style={{ fontSize: 18, color: 'var(--accent)' }}>★</span>
            <span style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 20,
              fontWeight: 400,
              color: 'var(--text)',
              letterSpacing: '-0.3px',
            }}>Ratify</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 4, flex: 1 }}>
            {links.map(({ to, label }) => {
              const active = pathname === to || pathname.startsWith(to + '/');
              return (
                <Link key={to} to={to} style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {badge && <span className={badge.cls}>{badge.label}</span>}
            <span style={{ fontSize: 13, color: 'var(--subtle)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13 }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {children}
      </main>
    </div>
  );
}
