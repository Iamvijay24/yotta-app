import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoadSpinner from './components/LoadSpinner';

// Lazy load all route components
const Layouts = React.lazy(() => import('./layouts/Layouts'));
const Home = React.lazy(() => import('./pages/welcome/Index'));
const Profile = React.lazy(() => import('./pages/profile/Index'));
const MyProgress = React.lazy(() => import('./pages/myProgress/Index'));
const Courses = React.lazy(() => import('./pages/courses/Index'));
const CourseOverview = React.lazy(() => import('./pages/courseOverview/Index'));
const Enrolled_section = React.lazy(() => import('./pages/myProgress/sections/EnrolledSection'));
const Recommended_section = React.lazy(() => import('./pages/myProgress/sections/RecommendedSection'));
const Trending_section = React.lazy(() => import('./pages/myProgress/sections/TrendingSection'));
const PrivateRoute = React.lazy(() => import('./components/PrivateRoute'));
const Login = React.lazy(() => import('./pages/account/login'));
const Register = React.lazy(() => import('./pages/account/register'));
const ForgotPassword = React.lazy(() => import('./pages/account/forgot'));
const CoursePlayer = React.lazy(() => import('./pages/coursePlayer/Index'));
const PaymentStatus = React.lazy(() => import('./components/PaymentStatus'));
const PageNotFound = React.lazy(() => import('./components/PageNotFound'));
const Support = React.lazy(() => import('./pages/support'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <Register />
      </Suspense>
    )
  },
  {
    path: '/forgot',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <ForgotPassword />
      </Suspense>
    )
  },
  {
    path: '/home',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <Home />
      </Suspense>
    )
  },
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/payment-status',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <PaymentStatus />
      </Suspense>
    )
  },

  {
    path: '/',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <PrivateRoute>
          <Layouts />
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        path: 'my-progress',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <MyProgress />
          </Suspense>
        )
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Profile />
          </Suspense>
        )
      },
      {
        path: 'courses',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Courses />
          </Suspense>
        )
      },
      {
        path: 'enrolled-courses',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Enrolled_section />
          </Suspense>
        )
      },
      {
        path: 'recommended-courses',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Recommended_section />
          </Suspense>
        )
      },
      {
        path: 'trending-courses',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Trending_section />
          </Suspense>
        )
      },
      {
        path: '/support',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <Support />
          </Suspense>
        )
      },
      {
        path: 'courses/:courseId',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <CourseOverview />
          </Suspense>
        )
      },
      {
        path: 'courses/:courseId/play',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <CoursePlayer />
          </Suspense>
        )
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <PageNotFound />
          </Suspense>
        )
      },
      {
        path: '/not-found',
        element: (
          <Suspense fallback={<LoadSpinner />}>
            <PageNotFound />
          </Suspense>
        )
      },
    ],
  },

  {
    path: '*',
    element: (
      <Suspense fallback={<LoadSpinner />}>
        <PageNotFound />
      </Suspense>
    )
  }
]);
// force commit
export default router;
