import type { RouteObject } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Courses from '@/pages/Courses';
import CoursesIndex from '@/pages/CoursesIndex';
import Course from '@/pages/Course';
import NoMatch from '@/pages/NoMatch';

// ͨ�� ģ����չ ���� �ӿںϲ��������������
// declare module 'react-router-dom' {
//   export interface RouteObject {
//     name?: string;
//   }
// }

// ��չ�ӿ�
// interface interfaceMyRoute extends RouteObject {
//   name?: string; // ����
//   children?: interfaceMyRoute[]; // ����
// }

// ͨ������������չ
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
 * ��������ʽ·��
 * ���·������� src/pages ��ʼ����
 * ���ָ�� src Ŀ¼���ļ��������� @��Ҳ������ ../
 * ����
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
