import type { RouteObject } from 'react-router-dom';
import Layout from '@/components/Layout';
import Batching from '@/pages/Batching';
import BatchingClass from '@/pages/BatchingClass';

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
      {
        path: '/batching',
        name: 'Batching',
        element: <Batching />,
      },
      {
        path: '/batchingclass',
        name: 'BatchingClass',
        element: <BatchingClass />,
      },
    ],
  },
];

export default routes;
