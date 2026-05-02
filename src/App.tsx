import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { UsersPage } from './components/users/UsersPage';
import { RolesPage } from './components/roles/RolesPage';
import { PermissionsPage } from './components/permissions/PermissionsPage';
import { LogsPage } from './components/logs/LogsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UsersPage />} />
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