import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import '@xyflow/react/dist/style.css';
import MainLayout from './layout/main';
import Dashboard from './dashboard';
import TaggingDetailedReport from './tagging_detailed_report/index';
import HierarchyFlow from './hierarchy-flow/HierachyFlow';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/historical-report"
          element={
            <MainLayout>
              <TaggingDetailedReport />
            </MainLayout>
          }
        />
        <Route
          path="/hierarchy-flow"
          element={
            <MainLayout>
              <HierarchyFlow />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}
