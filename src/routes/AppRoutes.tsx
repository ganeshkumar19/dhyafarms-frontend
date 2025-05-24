import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';

import Farms from '@/pages/Farms';
import Devices from '@/pages/Devices'; // ✅ Import your Devices page
import ManualEntry from '@/pages/ManualEntry';
import Trends from '@/pages/Trends';
import AlertsPage from '@/pages/Alerts';
import SupportPage from '@/pages/Support';
import Plans from '@/pages/Plans';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import AboutUs from '@/pages/website/AboutUs';
import Solutions from '@/pages/website/Solutions';
import Products from '@/pages/website/Products';
import Faq from '@/pages/website/Faq';



import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '@/layout/DashboardLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import GetStartedStep1 from '@/pages/onboarding/GetStartedStep1';
import GetStartedStep2 from '@/pages/onboarding/GetStartedStep2';
import GetStartedStep3 from '@/pages/onboarding/GetStartedStep3';
import GetStartedStep4 from '@/pages/onboarding/GetStartedStep4';
import GetStartedStep5 from '@/pages/onboarding/GetStartedStep5';
import WebsiteLayout from '@/layout/WebsiteLayout';
import ContactUs from '@/pages/website/ContactUs';
import WebsiteSupport from '@/pages/website/WebsiteSupport';
import Ponds from '@/pages/Ponds';
import NotFound from '@/components/NotFound';
import AuthPage from '@/pages/onboarding/AuthPage';





const AppRoutes = () => {
   
  
  
  return (
    <BrowserRouter>
      <Routes>
      <Route element={<WebsiteLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/websupport" element={<WebsiteSupport />} />
        </Route>


        <Route path="/get-started" element={<Navigate to="/get-started/step1" replace />} />
        <Route path="/get-started/step1" element={<GetStartedStep1 />} />
        <Route path="/get-started/step2" element={<GetStartedStep2 />} />
        <Route path="/get-started/step3" element={<GetStartedStep3 />} />
        <Route path="/get-started/step4" element={<GetStartedStep4 />} />
        <Route path="/get-started/step5" element={<GetStartedStep5 />} />

        {/* Protected Dashboard Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="farms" element={<Farms />} />
          <Route path="farms/:farmId" element={<Ponds />} /> 
          <Route path="devices" element={<Devices />} />
          <Route path="manual-entry" element={<ManualEntry />} />
          <Route path="trends" element={<Trends />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="plans" element={<Plans />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
