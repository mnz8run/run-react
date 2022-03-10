import { Link, Outlet } from 'react-router-dom';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.zeroLayout}>
      <header className={styles.zeroLayoutHeader}>
        <h1>Route</h1>
      </header>
      <section className={`${styles.zeroLayout} ${styles.zeroLayoutHasSider}`}>
        <aside className={styles.zeroLayoutSider}>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/nothing-here">Nothing Here</Link>
            </li>
          </ul>
        </aside>
        <main className={styles.zeroLayoutContent}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
