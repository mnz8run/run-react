import type { RouteObject } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Courses from '@/pages/Courses';
import CoursesIndex from '@/pages/CoursesIndex';
import Course from '@/pages/Course';
import NoMatch from '@/pages/NoMatch';

// 通过 模块扩展 进行 接口合并，添加类型属性
// declare module 'react-router-dom' {
//   export interface RouteObject {
//     name?: string;
//   }
// }

// 扩展接口
// interface interfaceMyRoute extends RouteObject {
//   name?: string; // 新增
//   children?: interfaceMyRoute[]; // 覆盖
// }

// 通过交叉类型扩展
export type typeMyRoute = Omit<{ [K in keyof RouteObject]: RouteObject[K] }, 'children'> & {
  name?: string;
  children?: typeMyRoute[];
};

const routes: typeMyRoute[] = [
  {
    path: '/',
    name: 'Home',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/courses',
        name: 'Courses',
        element: <Courses />,
        children: [
          { index: true, element: <CoursesIndex /> },
          { path: '/courses/:id', element: <Course /> },
        ],
      },
      { path: '*', element: <NoMatch /> },
    ],
  },
];

export default routes;

/**
 * 集中配置式路由
 * 相对路径，会从 src/pages 开始找起
 * 如果指向 src 目录的文件，可以用 @，也可以用 ../
 * 待续
 */
// const route = [
//   {
//     path: '/',
//     name: 'Home',
//     component: '@/components/Layout',
//     routes: [
//       {
//         path: '/courses',
//         name: 'Courses',
//         component: '@/pages/Courses',
//         routes: [{ path: '/courses/:id', component: '@/pages/Course' }],
//       },
//     ],
//   },
// ];
