import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';

const Layouts = lazy(() => import('./layouts/Layouts'));
const Home = lazy(() => import('./pages/welcome/Index'));
const Profile = lazy(() => import('./pages/profile/Index'));
const MyProgress = lazy(() => import('./pages/myProgress/Index'));
const Courses = lazy(() => import('./pages/courses/Index'));
const CourseOverview = lazy(() => import('./pages/courseOverview/Index'));
const Enrolled_section = lazy(() => import('./pages/myProgress/sections/EnrolledSection'));
const Recommended_section = lazy(() => import('./pages/myProgress/sections/RecommendedSection'));
const Trending_section = lazy(() => import('./pages/myProgress/sections/TrendingSection'));
const Login = lazy(() => import('./pages/account/login'));
const Register = lazy(() => import('./pages/account/register'));
const ForgotPassword = lazy(() => import('./pages/account/forgot'));
const CoursePlayer = lazy(() => import('./pages/coursePlayer/Index'));
const PaymentStatus = lazy(() => import('./components/PaymentStatus'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));
const Support = lazy(() => import('./pages/support'));
import PrivateRoute from './components/PrivateRoute';

const RootRedirect = () => <Navigate to="/login" replace />;

const routes = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot', element: <ForgotPassword /> },
  { path: '/home', element: <Home /> },
  { path: '/', element: <RootRedirect /> },

  {
    path: '/',
    element: (
      <PrivateRoute>
        <Layouts />
      </PrivateRoute>
    ),
    children: [
      { path: 'my-progress', element: <MyProgress /> },
      { path: 'profile', element: <Profile /> },
      { path: 'courses', element: <Courses /> },
      { path: 'enrolled-courses', element: <Enrolled_section /> },
      { path: 'recommended-courses', element: <Recommended_section /> },
      { path: 'trending-courses', element: <Trending_section /> },
      { path: 'support', element: <Support /> },
      { path: 'courses/:courseId', element: <CourseOverview /> },
      { path: 'courses/:courseId/play', element: <CoursePlayer /> },
      { path: 'payment-status', element: <PaymentStatus /> },
      { path: '*', element: <PageNotFound /> },
      { path: 'not-found', element: <PageNotFound /> },
    ],
  },

  { path: '*', element: <PageNotFound /> },
]);

export default routes;
