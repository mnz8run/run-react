import type { RouteObject } from 'react-router-dom';
import Layout from '@/pages/Layout';
import Home from '@/pages/Home';
import Courses from '@/pages/Courses';
import CoursesIndex from '@/pages/CoursesIndex';
import Course from '@/pages/Course';
import NoMatch from '@/pages/NoMatch';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: '/courses',
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
