import { Link } from 'react-router-dom';
import routes from '../../../config/routes';
import type { typeMyRoute } from '../../../config/routes';
import styles from './index.less';

// 在这使用 routes 就报错 循环引用
// Uncaught ReferenceError: Cannot access '__WEBPACK_DEFAULT_EXPORT__' before initialization
// console.log(routes);

export default function Sider() {
  const routesLi: any = [];
  function transMenu(param: typeMyRoute[]) {
    param.forEach((ele) => {
      if (ele?.name) {
        routesLi.push(
          <li className={styles.menuItem} key={ele.name}>
            <Link to={ele.path as string}>{ele.name}</Link>
          </li>,
        );
      }
      if (ele?.children) {
        transMenu(ele?.children);
      }
    });
  }
  transMenu(routes);

  return (
    <ul style={{ width: '100%' }}>
      {routesLi}
      {/* <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/courses">Courses</Link>
      </li>
      <li>
        <Link to="/nothing-here">Nothing Here</Link>
      </li> */}
    </ul>
  );
}
