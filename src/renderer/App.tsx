import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import '@xyflow/react/dist/style.css';
import MainLayout from './layout/main';
import Dashboard from './dashboard';
import TaggingDetailedReport from './tagging_detailed_report/index';
import CampaignDetailedReport from './campaign_detailed_report/index';
import HierarchyFlow from './hierarchy-flow/HierachyFlow';
import UserChatBase from './target_analytics/UserChatBase';
import LoginPage from './auth/LoginPage';
import { AuthProvider } from './auth/AuthContext';
import UserTeamBase from './target_analytics/UserTeamBase';

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
          path="/campaign/historical-report"
          element={
            <AuthProvider>
              <MainLayout>
                <CampaignDetailedReport />
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
        <Route
          path="/targets/users"
          element={
            <AuthProvider>
              <MainLayout>
                <UserChatBase />
              </MainLayout>
            </AuthProvider>
          }
        />
        <Route
          path="/targets/teams"
          element={
            <AuthProvider>
              <MainLayout>
                <UserTeamBase />
              </MainLayout>
            </AuthProvider>
          }
        />
      </Routes>
    </Router>
  );
}
