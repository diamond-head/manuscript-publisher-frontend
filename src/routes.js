import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';
import ErrorUrl from './pages/Page410';
import ForgotComponent from './pages/Forgot';
import BeforeLoginLayout from './layouts/beforeLogin/befoeLogin-layout';

// ----------------------------------------------------------------------

export default function Router() {
  const oRoutes = [
    {
      path: '/',
      element: <BeforeLoginLayout />,
      children: [
        { path: '/', element: <Navigate to="/" /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'forgot', element: <ForgotComponent /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '410', element: <ErrorUrl /> },
        { path: '/', element: <Navigate to="/" /> }
        // { path: '*', element: <Navigate to="/login" /> }
      ]
    },
    { path: '*', element: <ErrorUrl /> }
    // { path: '*', element: <Navigate to="/cornous/home" replace /> }
  ];
  return useRoutes(oRoutes);
}
