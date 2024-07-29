import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import '@xyflow/react/dist/style.css';
import MainLayout from './layout/main';
import Dashboard from './dashboard';
import TaggingDetailedReport from './tagging_detailed_report/index';
import HierarchyFlow from './hierarchy-flow/HierachyFlow';
import LoginPage from './auth/LoginPage';
import { AuthProvider } from './auth/AuthContext';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          }
        />
        <Route
          path="/"
          element={
            <AuthProvider>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/historical-report"
          element={
            <AuthProvider>
              <MainLayout>
                <TaggingDetailedReport />
              </MainLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/hierarchy-flow"
          element={
            <AuthProvider>
              <MainLayout>
                <HierarchyFlow />
              </MainLayout>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}
