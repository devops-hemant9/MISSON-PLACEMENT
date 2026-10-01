import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import RoadmapView from './pages/RoadmapView';

// This is a custom wrapper component that checks if a user is logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Auth />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/roadmap/:id" 
            element={
              <ProtectedRoute>
                <RoadmapView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}