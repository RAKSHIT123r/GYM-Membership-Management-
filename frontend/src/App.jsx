import React, { useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ReceptionScanModal from './components/admin/ReceptionScanModal';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminClasses from './pages/admin/AdminClasses';
import AdminLockers from './pages/admin/AdminLockers';
import AdminBranches from './pages/admin/AdminBranches';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAttendance from './pages/admin/AdminAttendance';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import WorkoutBuilder from './pages/trainer/WorkoutBuilder';
import NutritionBuilder from './pages/trainer/NutritionBuilder';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberPlans from './pages/member/MemberPlans';
import MemberClasses from './pages/member/MemberClasses';
import MemberWorkout from './pages/member/MemberWorkout';
import MemberNutrition from './pages/member/MemberNutrition';
import MemberProgress from './pages/member/MemberProgress';
import MemberLockers from './pages/member/MemberLockers';
import MemberPayments from './pages/member/MemberPayments';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const [showGlobalScanModal, setShowGlobalScanModal] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-slate-400 text-sm">
        Authenticating ApexFit Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar onOpenScanModal={() => setShowGlobalScanModal(true)} />
      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {showGlobalScanModal && (
        <ReceptionScanModal onClose={() => setShowGlobalScanModal(false)} />
      )}
    </div>
  );
};

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedLayout />}>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <RoleRoute allowedRoles={['Admin', 'Trainer']}>
              <AdminMembers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/trainers"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminTrainers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/plans"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminPlans />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <RoleRoute allowedRoles={['Admin', 'Trainer']}>
              <AdminClasses />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/lockers"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminLockers />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/branches"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminBranches />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <RoleRoute allowedRoles={['Admin']}>
              <AdminPayments />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <RoleRoute allowedRoles={['Admin', 'Trainer']}>
              <AdminAttendance />
            </RoleRoute>
          }
        />

        {/* Trainer Routes */}
        <Route
          path="/trainer"
          element={
            <RoleRoute allowedRoles={['Trainer']}>
              <TrainerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/trainer/members"
          element={
            <RoleRoute allowedRoles={['Trainer', 'Admin']}>
              <AdminMembers />
            </RoleRoute>
          }
        />
        <Route
          path="/trainer/schedule"
          element={
            <RoleRoute allowedRoles={['Trainer', 'Admin']}>
              <AdminClasses />
            </RoleRoute>
          }
        />
        <Route
          path="/trainer/workouts"
          element={
            <RoleRoute allowedRoles={['Trainer', 'Admin']}>
              <WorkoutBuilder />
            </RoleRoute>
          }
        />
        <Route
          path="/trainer/nutrition"
          element={
            <RoleRoute allowedRoles={['Trainer', 'Admin']}>
              <NutritionBuilder />
            </RoleRoute>
          }
        />
        <Route
          path="/trainer/progress"
          element={
            <RoleRoute allowedRoles={['Trainer', 'Admin']}>
              <MemberProgress />
            </RoleRoute>
          }
        />

        {/* Member Routes */}
        <Route
          path="/member"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/member/plans"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberPlans />
            </RoleRoute>
          }
        />
        <Route
          path="/member/classes"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberClasses />
            </RoleRoute>
          }
        />
        <Route
          path="/member/workout"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberWorkout />
            </RoleRoute>
          }
        />
        <Route
          path="/member/nutrition"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberNutrition />
            </RoleRoute>
          }
        />
        <Route
          path="/member/progress"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberProgress />
            </RoleRoute>
          }
        />
        <Route
          path="/member/lockers"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberLockers />
            </RoleRoute>
          }
        />
        <Route
          path="/member/payments"
          element={
            <RoleRoute allowedRoles={['Member']}>
              <MemberPayments />
            </RoleRoute>
          }
        />
      </Route>

      {/* Catch-all fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
