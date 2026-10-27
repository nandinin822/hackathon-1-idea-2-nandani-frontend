import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './localization/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import BaseLayout from './components/layout/BaseLayout';
import HomePage from './pages/HomePage';
import FlightsPage from './pages/FlightsPage';
import TripPlannerPage from './pages/TripPlannerPage';
import MilesAndPointsPage from './pages/MilesAndPointsPage';
import SolutionsPage from './pages/SolutionsPage';
import CalculatorPage from './pages/CalculatorPage';
import CardWalletPage from './pages/CardWalletPage';
import RewardsPlannerPage from './pages/RewardsPlannerPage';
import ResultsPage from './pages/ResultsPage';
import SignInPage from './pages/SignInPage';
import FoundationShowcase from './pages/FoundationShowcase';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <BaseLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/flights" element={<FlightsPage />} />
              <Route path="/trip-planner" element={<TripPlannerPage />} />
              <Route path="/miles-and-points" element={<MilesAndPointsPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/wallet" element={<CardWalletPage />} />
              <Route path="/rewards-planner" element={<RewardsPlannerPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignInPage defaultMode="signup" />} />
              <Route path="/signup" element={<SignInPage defaultMode="signup" />} />
              <Route path="/dev-showcase" element={<FoundationShowcase />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </BaseLayout>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
