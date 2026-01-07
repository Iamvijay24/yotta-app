// App.jsx (updated - no major changes, but ensures routing starts at login if needed)
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';
import { ConfigProvider } from 'antd';
import './App.css';
import {theme} from './shared/store/theme/index';
import { AuthProvider } from './shared/api';

const App = () => {
  return (
    <ConfigProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;