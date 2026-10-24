import React from 'react';
import { HealthProvider, useHealth } from './context/HealthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import InputForm from './components/InputForm';
import Login from './pages/Login';

const AppContent = () => {
  const { user } = useHealth();

  if (!user) {
    return <Login />;
  }

  // Route based on user role
  if (user.role === 'doctor') {
    return (
      <Layout>
        <DoctorDashboard />
      </Layout>
    );
  }

  // Default: Patient view
  return (
    <Layout>
      <Dashboard />
      <InputForm />
    </Layout>
  );
};

function App() {
  return (
    <HealthProvider>
      <AppContent />
    </HealthProvider>
  );
}

export default App;
