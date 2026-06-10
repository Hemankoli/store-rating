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
  admin:       { label: 'Admin', cls: 'badge badge-amber' },
  user:        { label: 'User',  cls: 'badge badge-zinc' },
  store_owner: { label: 'Owner', cls: 'badge badge-green' },
};

const AVATAR_COLORS = {
  admin:       ['#f59e0b', '#0c0a00'],
  user:        ['#71717a', '#fafafa'],
  store_owner: ['#22c55e', '#020b03'],
};

const ROLE_HOME = { admin: '/admin/dashboard', user: '/stores', store_owner: '/owner/dashboard' };

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links  = NAV_LINKS[user?.role]  || [];
  const badge  = ROLE_BADGE[user?.role];
  const logoTo = user ? (ROLE_HOME[user.role] ?? '/') : '/';
  const [avatarBg, avatarFg] = AVATAR_COLORS[user?.role] ?? ['#3f3f46', '#fafafa'];
  const initial = user?.name?.trim()[0]?.toUpperCase() ?? '?';

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <nav style={{
        backgroundColor: 'rgba(24,24,27,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 58 }}>

          {/* Logo */}
          <Link to={logoTo} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginRight: 40 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: 'var(--accent)',
            }}>★</span>
            <span style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 20, fontWeight: 400,
              color: 'var(--text)', letterSpacing: '-0.3px',
            }}>Ratify</span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: 2, flex: 1 }}>
            {links.map(({ to, label }) => {
              const active = pathname === to || pathname.startsWith(to + '/');
              return (
                <Link key={to} to={to} style={{
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                  position: 'relative',
                }}>
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: -1, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 18, height: 2,
                      background: 'var(--accent)',
                      borderRadius: 2,
                    }} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {badge && <span className={badge.cls}>{badge.label}</span>}

            {/* Avatar */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: avatarBg, color: avatarFg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              flexShrink: 0, userSelect: 'none',
              border: `1.5px solid ${avatarBg}`,
              boxShadow: `0 0 0 2px var(--surface)`,
            }}>{initial}</div>

            <span style={{
              fontSize: 13, color: 'var(--subtle)',
              maxWidth: 140, overflow: 'hidden',
              textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{user?.name}</span>

            <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: 13, marginLeft: 2 }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px', animation: 'fadeUp 0.3s ease both' }}>
        {children}
      </main>
    </div>
  );
}
