import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { UsersPage } from './components/users/UsersPage';
import { RolesPage } from './components/roles/RolesPage';
import { PermissionsPage } from './components/permissions/PermissionsPage';
import { LogsPage } from './components/logs/LogsPage';
import { LoginPage } from './components/login/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { getTokens } from './api';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const tokens = getTokens();
  return tokens.access ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<UsersPage />} />
          <Route path="home" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
