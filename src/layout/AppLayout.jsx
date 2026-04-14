import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

const navItems = [
  { to: '/todos', label: 'Todo List', badge: '01' },
  { to: '/form-builder', label: 'Form Builder', badge: '02' },
  { to: '/form-preview', label: 'Form Preview', badge: '03' },
]

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sectionHint}>React Assesment</h2>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? styles.navLinkActive : styles.navLink
              }
            >
              <span className={styles.navBadge} aria-hidden="true">
                {item.badge}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
