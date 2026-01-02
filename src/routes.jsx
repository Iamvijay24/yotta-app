import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layouts from './layouts/Layouts';
import Home from './pages/welcome/Index';
import Profile from './pages/profile/Index';
import MyProgress from './pages/myProgress/Index';
import Courses from './pages/courses/Index';
import CourseOverview from './pages/courseOverview/Index';
import Enrolled_section from './pages/myProgress/sections/EnrolledSection';
import Recommended_section from './pages/myProgress/sections/RecommendedSection';
import Trending_section from './pages/myProgress/sections/TrendingSection';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/account/login';
import Register from './pages/account/register';
import ForgotPassword from './pages/account/forgot';
import CoursePlayer from './pages/coursePlayer/Index';
import PaymentStatus from './components/PaymentStatus';
import PageNotFound from './components/PageNotFound';
import Support from './pages/support';

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
      {path: '/support', element: <Support/>},
      { path: 'courses/:courseId', element: <CourseOverview /> },
      { path: 'courses/:courseId/play', element: <CoursePlayer /> },
      { path: '/payment-status', element: <PaymentStatus /> },
      { path: '*', element: <PageNotFound /> },
      { path: '/not-found', element: <PageNotFound /> },
    ],
  },

  { path: '*', element: <PageNotFound/> }
]);

export default routes;
