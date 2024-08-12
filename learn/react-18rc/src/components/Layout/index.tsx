import { Outlet } from 'react-router-dom';
import Sider from '@/components/Sider';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.zeroLayout}>
      <header className={styles.zeroLayoutHeader}>
        <h1>Route</h1>
      </header>
      <section className={`${styles.zeroLayout} ${styles.zeroLayoutHasSider}`}>
        <aside className={styles.zeroLayoutSider}>
          <Sider />
        </aside>
        <main className={styles.zeroLayoutContent}>
          <Outlet />
        </main>
      </section>
    </div>
  );
}
